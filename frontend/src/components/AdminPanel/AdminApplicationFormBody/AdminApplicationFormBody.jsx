import { useCallback, useMemo, useState } from 'react';
import Input from '../../Input/Input.jsx';
import PhoneInput from '../../Input/PhoneInput.jsx';
import TimeInput from '../../Input/TimeInput.jsx';
import QuantityInput from '../../Input/QuantityInput.jsx';
import YesNoToggle from '../../Input/YesNoToggle.jsx';
import truckIcon from '../../../assets/images/application/truck.svg';
import truckActiveIcon from '../../../assets/images/application/truck-active.svg';
import boxIcon from '../../../assets/images/application/box.svg';
import boxActiveIcon from '../../../assets/images/application/box-active.svg';
import { stripSecondsTime, formatMoneyRub } from '../../../utils/format.js';

const PRICES = {
    tent3x6: 3000,
    tent3x3: 2000,
    furniture: 3000,
    chairs: 150,
    bulb: 100,
};

const PER_DAY_KEYS = ['tent3x6', 'tent3x3', 'furniture'];

const ASSEMBLY = {
    tent3x6: 2000,
    tent3x3: 1000,
};

function calcTotal(qty, days, assembly) {
    const d = Math.max(1, days);
    const mult = 1 + 0.5 * (d - 1);

    let perDay = 0;
    let perPiece = 0;
    for (const [key, count] of Object.entries(qty)) {
        if (PER_DAY_KEYS.includes(key)) {
            perDay += count * (PRICES[key] ?? 0);
        } else {
            perPiece += count * (PRICES[key] ?? 0);
        }
    }

    const rental = Math.round(perDay * mult + perPiece);

    let tentAssembly = 0;
    if (assembly) {
        tentAssembly += (qty.tent3x6 || 0) * ASSEMBLY.tent3x6;
        tentAssembly += (qty.tent3x3 || 0) * ASSEMBLY.tent3x3;
    }

    const furnitureAssembly = (qty.furniture || 0) >= 2 ? 500 : 0;

    const assemblyCost = tentAssembly + furnitureAssembly;
    return { rental, tentAssembly, furnitureAssembly, assembly: assemblyCost, total: rental + assemblyCost };
}

export default function AdminApplicationFormBody({
    idPrefix,
    disabled,
    defaults = null,
    showAdminMeta = false,
}) {
    const d = defaults ?? {};
    const name = d.full_name ?? d.name ?? '';
    const phone = d.phone ?? '';
    const date = d.event_date ?? d.date ?? '';
    const time = stripSecondsTime(d.event_time ?? d.time ?? '');
    const place = d.location ?? d.place ?? '';
    const tent3x6 = d.tent_3x6_qty ?? d.tent3x6 ?? 0;
    const tent3x3 = d.tent_3x3_qty ?? d.tent3x3 ?? 0;
    const furniture = d.furniture_qty ?? d.furniture ?? 0;
    const chairs = d.chairs_qty ?? d.chairs ?? 0;
    const bulb = d.bulb_qty ?? d.bulb ?? 0;
    const daysDefault = d.rental_days ?? d.days ?? 1;
    const delivery = d.delivery ?? true;
    const assemblyDefault = d.assembly ?? false;
    const source = d.source ?? 'site';
    const status = d.status ?? 'new';

    const [liveStatus, setLiveStatus] = useState(() => (showAdminMeta ? status : 'new'));

    const [qty, setQty] = useState({
        tent3x6: Number(tent3x6) || 0,
        tent3x3: Number(tent3x3) || 0,
        furniture: Number(furniture) || 0,
        chairs: Number(chairs) || 0,
        bulb: Number(bulb) || 0,
    });
    const [liveDays, setLiveDays] = useState(Number(daysDefault) || 1);
    const [liveDelivery, setLiveDelivery] = useState(Boolean(delivery));
    const [liveAssembly, setLiveAssembly] = useState(Boolean(assemblyDefault));

    const handleQtyChange = useCallback((fieldName, value) => {
        setQty((prev) => ({ ...prev, [fieldName]: value }));
    }, []);

    const priceBreakdown = useMemo(
        () => calcTotal(qty, liveDays, liveAssembly),
        [qty, liveDays, liveAssembly],
    );
    const { rental: rentalCost, tentAssembly, furnitureAssembly, assembly: assemblyCost, total: totalPrice } = priceBreakdown;

    const statusFieldClass =
        liveStatus === 'new'
            ? 'field__input new-applications__source-select'
            : `field__input new-applications__status-tone new-applications__status-tone--${liveStatus}`;

    return (
        <>
            <div className="new-applications__form-contact">
                <Input
                    id={`${idPrefix}-name`}
                    name="name"
                    label="Как к вам обращаться"
                    placeholder="Иван"
                    className="field__input--half"
                    required
                    disabled={disabled}
                    defaultValue={name}
                />

                <PhoneInput
                    id={`${idPrefix}-phone`}
                    name="phone"
                    label="Телефон"
                    className="field__input--half"
                    required
                    disabled={disabled}
                    initialPhone={phone}
                />
            </div>

            <div className="new-applications__form-date">
                <Input
                    id={`${idPrefix}-date`}
                    name="date"
                    label="Дата"
                    type="date"
                    className="field__input--half"
                    required
                    disabled={disabled}
                    defaultValue={date}
                />

                <TimeInput
                    id={`${idPrefix}-time`}
                    name="time"
                    label="Время"
                    className="field__input--half"
                    required
                    disabled={disabled}
                    initialTime={time}
                />
            </div>

            <Input
                id={`${idPrefix}-place`}
                name="place"
                label="Место проведения"
                placeholder="Адрес"
                required
                disabled={disabled}
                defaultValue={place}
            />

            <QuantityInput
                id={`${idPrefix}-days`}
                name="days"
                label="Количество суток"
                min={1}
                max={30}
                disabled={disabled}
                defaultValue={daysDefault}
                onValueChange={setLiveDays}
            />

            <div className="new-applications__form-tent">
                <QuantityInput
                    id={`${idPrefix}-tent3x6`}
                    name="tent3x6"
                    label="Шатёр 3×6м — 3.000₽/сут"
                    className="field__input--half"
                    disabled={disabled}
                    defaultValue={tent3x6}
                    onValueChange={(v) => handleQtyChange('tent3x6', v)}
                />

                <QuantityInput
                    id={`${idPrefix}-tent3x3`}
                    name="tent3x3"
                    label="Шатёр 3×3м — 2.000₽/сут"
                    className="field__input--half"
                    disabled={disabled}
                    defaultValue={tent3x3}
                    onValueChange={(v) => handleQtyChange('tent3x3', v)}
                />
            </div>

            <div className="new-applications__form-furniture">
                <QuantityInput
                    id={`${idPrefix}-furniture`}
                    name="furniture"
                    label="Комплект мебели — 3.000₽/сут"
                    className="field__input--third"
                    disabled={disabled}
                    defaultValue={furniture}
                    onValueChange={(v) => handleQtyChange('furniture', v)}
                />

                <QuantityInput
                    id={`${idPrefix}-chairs`}
                    name="chairs"
                    label="Стул раскладной — 150₽/шт"
                    className="field__input--third"
                    disabled={disabled}
                    defaultValue={chairs}
                    onValueChange={(v) => handleQtyChange('chairs', v)}
                />

                <QuantityInput
                    id={`${idPrefix}-bulb`}
                    name="bulb"
                    label="Лампочка — 100₽/шт"
                    className="field__input--third"
                    disabled={disabled}
                    defaultValue={bulb}
                    onValueChange={(v) => handleQtyChange('bulb', v)}
                />
            </div>

            <div className="new-applications__form-services">
                <YesNoToggle
                    label="Доставка"
                    name="delivery"
                    iconYes={truckActiveIcon}
                    iconNo={truckIcon}
                    defaultYes={Boolean(delivery)}
                    className="field__input--half"
                    disabled={disabled}
                    onToggle={setLiveDelivery}
                />
                <YesNoToggle
                    label="Сборка"
                    name="assembly"
                    iconYes={boxActiveIcon}
                    iconNo={boxIcon}
                    defaultYes={Boolean(assemblyDefault)}
                    className="field__input--half"
                    disabled={disabled}
                    onToggle={setLiveAssembly}
                />
            </div>

            {totalPrice > 0 ? (
                <div className="new-applications__form-total">
                    {assemblyCost > 0 ? (
                        <>
                            <div className="new-applications__form-total-row">
                                <span className="new-applications__form-total-label">Аренда:</span>
                                <span className="new-applications__form-total-value new-applications__form-total-value--secondary">
                                    {formatMoneyRub(rentalCost)}
                                </span>
                            </div>
                            {tentAssembly > 0 ? (
                                <div className="new-applications__form-total-row">
                                    <span className="new-applications__form-total-label">Сборка шатров:</span>
                                    <span className="new-applications__form-total-value new-applications__form-total-value--secondary">
                                        {formatMoneyRub(tentAssembly)}
                                    </span>
                                </div>
                            ) : null}
                            {furnitureAssembly > 0 ? (
                                <div className="new-applications__form-total-row">
                                    <span className="new-applications__form-total-label">Установка мебели:</span>
                                    <span className="new-applications__form-total-value new-applications__form-total-value--secondary">
                                        {formatMoneyRub(furnitureAssembly)}
                                    </span>
                                </div>
                            ) : null}
                        </>
                    ) : null}
                    <div className="new-applications__form-total-row">
                        <span className="new-applications__form-total-label">Итого:</span>
                        <span className="new-applications__form-total-value">
                            {formatMoneyRub(totalPrice)}
                        </span>
                    </div>
                    {liveDelivery ? (
                        <span className="new-applications__form-total-hint">
                            * без учёта доставки
                        </span>
                    ) : null}
                    {liveDays > 1 ? (
                        <span className="new-applications__form-total-hint">
                            * следующие сутки аренды со скидкой 50%
                        </span>
                    ) : null}
                </div>
            ) : null}

            {showAdminMeta ? (
                <div className="new-applications__form-admin-meta">
                    <div className="field field__input--half">
                        <label className="field__label" htmlFor={`${idPrefix}-source`}>
                            Источник
                        </label>
                        <select
                            id={`${idPrefix}-source`}
                            name="source"
                            className="field__input new-applications__source-select"
                            defaultValue={source}
                            disabled={disabled}
                        >
                            <option value="site">Сайт</option>
                            <option value="manual">Вручную</option>
                        </select>
                    </div>
                    <div className="field field__input--half">
                        <label className="field__label" htmlFor={`${idPrefix}-status`}>
                            Статус
                        </label>
                        <select
                            id={`${idPrefix}-status`}
                            name="status"
                            className={statusFieldClass}
                            value={liveStatus}
                            onChange={(e) => setLiveStatus(e.target.value)}
                            disabled={disabled}
                        >
                            <option value="new">Новый</option>
                            <option value="inwork">В работе</option>
                            <option value="closed">Закрыт</option>
                        </select>
                    </div>
                </div>
            ) : null}
        </>
    );
}
