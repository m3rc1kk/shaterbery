import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { fetchServices } from '../../../api/services.js';

const UNIT_LABELS = { day: '/сут', piece: '/шт' };

function formatServiceLabel(svc) {
    const p = Number(svc.price_value) || 0;
    const formatted = p.toLocaleString('ru-RU');
    const unit = UNIT_LABELS[svc.price_unit] || '';
    let label = `${svc.title} — ${formatted}₽${unit}`;
    if (svc.half_price_next_days) {
        label += ' (−50% след. сутки)';
    }
    return label;
}

function calcTotal(services, qty, days, assembly) {
    const d = Math.max(1, days);
    const mult = 1 + 0.5 * (d - 1);

    let rental = 0;
    let assemblyTotal = 0;

    for (const svc of services) {
        const count = qty[svc.id] || 0;
        if (count <= 0) continue;
        const price = Number(svc.price_value) || 0;

        if (svc.price_unit === 'day') {
            if (svc.half_price_next_days) {
                rental += count * price * mult;
            } else {
                rental += count * price * d;
            }
        } else {
            rental += count * price;
        }

        if (assembly && svc.assembly_price > 0) {
            assemblyTotal += count * svc.assembly_price;
        }
    }

    rental = Math.round(rental);
    return { rental, assembly: assemblyTotal, total: rental + assemblyTotal };
}

function buildQtyFromDefaults(services, defaults) {
    const q = {};
    if (defaults?.items?.length) {
        for (const s of services) q[s.id] = 0;
        for (const item of defaults.items) {
            const sid = item.service_id ?? item.service?.id;
            if (sid && q[sid] !== undefined) {
                q[sid] = item.quantity || 0;
            }
        }
    } else {
        for (const s of services) q[s.id] = 0;
    }
    return q;
}

export default function AdminApplicationFormBody({
    idPrefix,
    disabled,
    defaults = null,
    showAdminMeta = false,
    cities = [],
}) {
    const d = defaults ?? {};
    const name = d.full_name ?? d.name ?? '';
    const phone = d.phone ?? '';
    const date = d.event_date ?? d.date ?? '';
    const time = stripSecondsTime(d.event_time ?? d.time ?? '');
    const place = d.location ?? d.place ?? '';
    const daysDefault = d.rental_days ?? d.days ?? 1;
    const delivery = d.delivery ?? true;
    const assemblyDefault = d.assembly ?? false;
    const source = d.source ?? 'site';
    const status = d.status ?? 'new';
    const cityDefault = d.city ?? '';

    const [liveStatus, setLiveStatus] = useState(() => (showAdminMeta ? status : 'new'));

    const [services, setServices] = useState([]);
    const [qty, setQty] = useState({});
    const [liveDays, setLiveDays] = useState(Number(daysDefault) || 1);
    const [liveDelivery, setLiveDelivery] = useState(Boolean(delivery));
    const [liveAssembly, setLiveAssembly] = useState(Boolean(assemblyDefault));

    useEffect(() => {
        let cancelled = false;
        fetchServices()
            .then((data) => {
                if (!cancelled) {
                    setServices(data);
                    setQty(buildQtyFromDefaults(data, defaults));
                }
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    const handleQtyChange = useCallback((id, value) => {
        setQty((prev) => ({ ...prev, [id]: value }));
    }, []);

    const priceBreakdown = useMemo(
        () => calcTotal(services, qty, liveDays, liveAssembly),
        [services, qty, liveDays, liveAssembly],
    );
    const { rental: rentalCost, assembly: assemblyCost, total: totalPrice } = priceBreakdown;

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

            <div className="new-applications__form-services-list">
                {services.map((svc) => (
                    <QuantityInput
                        key={svc.id}
                        id={`${idPrefix}-service_${svc.id}`}
                        name={`service_${svc.id}`}
                        label={formatServiceLabel(svc)}
                        disabled={disabled}
                        defaultValue={qty[svc.id] || 0}
                        onValueChange={(v) => handleQtyChange(svc.id, v)}
                    />
                ))}
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
                            <div className="new-applications__form-total-row">
                                <span className="new-applications__form-total-label">Сборка:</span>
                                <span className="new-applications__form-total-value new-applications__form-total-value--secondary">
                                    {formatMoneyRub(assemblyCost)}
                                </span>
                            </div>
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

                </div>
            ) : null}

            {showAdminMeta ? (
                <div className="new-applications__form-admin-meta">
                    {cities.length > 0 && (
                        <div className="field field__input--half">
                            <label className="field__label" htmlFor={`${idPrefix}-city`}>
                                Город
                            </label>
                            <select
                                id={`${idPrefix}-city`}
                                name="city"
                                className="field__input new-applications__source-select"
                                defaultValue={cityDefault}
                                disabled={disabled}
                            >
                                <option value="">— не указан —</option>
                                {cities.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
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
