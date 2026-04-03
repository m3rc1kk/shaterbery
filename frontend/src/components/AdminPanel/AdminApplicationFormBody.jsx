import { useState } from 'react';
import Input from '../Input/Input.jsx';
import PhoneInput from '../Input/PhoneInput.jsx';
import TimeInput from '../Input/TimeInput.jsx';
import QuantityInput from '../Input/QuantityInput.jsx';
import YesNoToggle from '../Input/YesNoToggle.jsx';
import truckIcon from '../../assets/images/application/truck.svg';
import truckActiveIcon from '../../assets/images/application/truck-active.svg';
import boxIcon from '../../assets/images/application/box.svg';
import boxActiveIcon from '../../assets/images/application/box-active.svg';
import { stripSecondsTime } from '../../utils/format.js';

/**
 * 
 * @param {object} props
 * @param {string} props.idPrefix 
 * @param {boolean} props.disabled
 * @param {object|null} props.defaults
 * @param {boolean} props.showAdminMeta
 */
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
    const delivery = d.delivery ?? true;
    const assembly = d.assembly ?? false;
    const source = d.source ?? 'site';
    const status = d.status ?? 'new';

    const [liveStatus, setLiveStatus] = useState(() => (showAdminMeta ? status : 'new'));

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

            <div className="new-applications__form-tent">
                <QuantityInput
                    id={`${idPrefix}-tent3x6`}
                    name="tent3x6"
                    label="Шатёр 3×6м - 2.000 ₽/сут"
                    className="field__input--half"
                    disabled={disabled}
                    defaultValue={tent3x6}
                />

                <QuantityInput
                    id={`${idPrefix}-tent3x3`}
                    name="tent3x3"
                    label="Шатёр 3×3м - 1.500₽/сут"
                    className="field__input--half"
                    disabled={disabled}
                    defaultValue={tent3x3}
                />
            </div>

            <div className="new-applications__form-furniture">
                <QuantityInput
                    id={`${idPrefix}-furniture`}
                    name="furniture"
                    label="Комплект мебели - 500₽/сут"
                    className="field__input--third"
                    disabled={disabled}
                    defaultValue={furniture}
                />

                <QuantityInput
                    id={`${idPrefix}-chairs`}
                    name="chairs"
                    label="Стул раскладной - 200₽/шт"
                    className="field__input--third"
                    disabled={disabled}
                    defaultValue={chairs}
                />

                <QuantityInput
                    id={`${idPrefix}-bulb`}
                    name="bulb"
                    label="Лампочка - 100₽/шт"
                    className="field__input--third"
                    disabled={disabled}
                    defaultValue={bulb}
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
                />
                <YesNoToggle
                    label="Сборка"
                    name="assembly"
                    iconYes={boxActiveIcon}
                    iconNo={boxIcon}
                    defaultYes={Boolean(assembly)}
                    className="field__input--half"
                    disabled={disabled}
                />
            </div>

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
