import { useCallback, useEffect, useMemo, useState } from 'react';
import compassIcon from '../../assets/images/application/compass.svg'
import timeIcon from '../../assets/images/application/clock.svg'
import phoneIcon from '../../assets/images/application/phone.svg'
import truckIcon from '../../assets/images/application/truck.svg'
import truckActiveIcon from '../../assets/images/application/truck-active.svg'
import boxIcon from '../../assets/images/application/box.svg'
import boxActiveIcon from '../../assets/images/application/box-active.svg'
import ButtonLink from '../Button/ButtonLink.jsx'
import Input from "../Input/Input.jsx";
import QuantityInput from "../Input/QuantityInput.jsx";
import PhoneInput from "../Input/PhoneInput.jsx";
import TimeInput from "../Input/TimeInput.jsx";
import YesNoToggle from "../Input/YesNoToggle.jsx";
import { publicSubmitPayloadFromForm } from '../../api/applicationForm.js';
import { submitPublicApplication } from '../../api/applications.js';
import { ApiError } from '../../api/http.js';
import { formatMoneyRub } from '../../utils/format.js';
import { fetchServices } from '../../api/services.js';
import { useCity } from '../../context/CityContext.jsx';

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
    const total = rental + assemblyTotal;
    return { rental, assembly: assemblyTotal, total };
}

export default function Application() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [fieldsKey, setFieldsKey] = useState(0);

    const [services, setServices] = useState([]);
    const { citySlug, cityData } = useCity();

    const initQty = useCallback((svcs) => {
        const q = {};
        for (const s of svcs) q[s.id] = 0;
        return q;
    }, []);

    const [qty, setQty] = useState({});
    const [days, setDays] = useState(1);
    const [delivery, setDelivery] = useState(true);
    const [assembly, setAssembly] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetchServices(citySlug)
            .then((data) => {
                if (!cancelled) {
                    setServices(data);
                    setQty(initQty(data));
                }
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [citySlug, initQty]);

    const handleQtyChange = useCallback((id, value) => {
        setQty((prev) => ({ ...prev, [id]: value }));
    }, []);

    const priceBreakdown = useMemo(() => calcTotal(services, qty, days, assembly), [services, qty, days, assembly]);
    const { rental: rentalCost, assembly: assemblyCost, total: totalPrice } = priceBreakdown;

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        setError('');
        const form = e.currentTarget;
        if (!(form instanceof HTMLFormElement)) return;
        setPending(true);
        try {
            const payload = publicSubmitPayloadFromForm(form, citySlug);
            await submitPublicApplication(payload);
            setMessage('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            form.reset();
            setFieldsKey((k) => k + 1);
            setQty(initQty(services));
            setDays(1);
            setDelivery(true);
            setAssembly(false);
        } catch (err) {
            const text = err instanceof ApiError ? err.message : 'Не удалось отправить заявку';
            setError(text);
        } finally {
            setPending(false);
        }
    }

    return (
        <>
            <div className="application">
                <div className="application__inner">
                    <div className="application__info">
                        <header className="application__header">
                            <h2 className="application__title">Свяжемся в течение часа</h2>
                            <div className="application__description">
                                <p>Уточним детали, рассчитаем стоимость. <br />
                                    Без навязчивых звонков.</p>
                            </div>
                        </header>

                        <ul className="application__contact-list">
                            <li className="application__contact-item">
                                <img src={phoneIcon} width={20} height={20} loading='lazy' alt="Телефон" className="application__contact-icon"/>
                                <div className="application__contact-body">
                                    <span className="application__contact-subtitle">Телефон</span>
                                    <span className="application__contact-title">
                                        {cityData?.slug === 'smolensk' ? '+7 (952) 535 11 60' : '+7 919 204 69 99'}
                                    </span>
                                </div>
                            </li>
                            <li className="application__contact-item">
                                <img src={timeIcon} width={20} height={20} loading='lazy' alt="Режим работы" className="application__contact-icon"/>
                                <div className="application__contact-body">
                                    <span className="application__contact-subtitle">Режим работы</span>
                                    <span className="application__contact-title">8:00 - 22:00, UTC+3</span>
                                </div>
                            </li>
                            <li className="application__contact-item">
                                <img src={compassIcon} width={20} height={20} loading='lazy' alt="Зона работы" className="application__contact-icon"/>
                                <div className="application__contact-body">
                                    <span className="application__contact-subtitle">Зона работы</span>
                                    <span className="application__contact-title">{cityData?.region_label || 'Орловская область'}</span>
                                </div>
                            </li>
                        </ul>

                    </div>

                    <form className="application__form" onSubmit={handleSubmit} noValidate>
                        <div key={fieldsKey} className="application__form-fields">
                        <div className="application__form-contact">
                            <Input
                                id="name"
                                name="name"
                                label="Как к вам обращаться"
                                placeholder="Иван"
                                className="field__input--half"
                                required
                                disabled={pending}
                            />

                            <PhoneInput
                                id="phone"
                                name="phone"
                                label="Телефон"
                                className="field__input--half"
                                required
                                disabled={pending}
                            />
                        </div>

                        <div className="application__form-date">
                            <Input
                                id="date"
                                name="date"
                                label="Дата"
                                type="date"
                                className="field__input--half"
                                required
                                disabled={pending}
                            />

                            <TimeInput
                                id="time"
                                name="time"
                                label="Время"
                                className="field__input--half"
                                required
                                disabled={pending}
                            />
                        </div>

                        <Input
                            id="place"
                            name="place"
                            label="Место проведения"
                            placeholder="Адрес"
                            required
                            disabled={pending}
                        />

                        <QuantityInput
                            id="days"
                            name="days"
                            label="Количество суток"
                            min={1}
                            max={30}
                            disabled={pending}
                            onValueChange={setDays}
                        />

                        <div className="application__form-services-list">
                            {services.map((svc) => (
                                <QuantityInput
                                    key={svc.id}
                                    id={`service_${svc.id}`}
                                    name={`service_${svc.id}`}
                                    label={formatServiceLabel(svc)}
                                    disabled={pending}
                                    onValueChange={(v) => handleQtyChange(svc.id, v)}
                                />
                            ))}
                        </div>

                        <div className="application__form-services">
                            <YesNoToggle
                                label="Доставка"
                                name="delivery"
                                iconYes={truckActiveIcon}
                                iconNo={truckIcon}
                                defaultYes
                                className="field__input--half"
                                disabled={pending}
                                onToggle={setDelivery}
                            />
                            <YesNoToggle
                                label="Сборка"
                                name="assembly"
                                iconYes={boxActiveIcon}
                                iconNo={boxIcon}
                                className="field__input--half"
                                disabled={pending}
                                onToggle={setAssembly}
                            />
                        </div>
                        </div>

                        {totalPrice > 0 ? (
                            <div className="application__form-total">
                                {assemblyCost > 0 ? (
                                    <>
                                        <div className="application__form-total-row">
                                            <span className="application__form-total-label">Аренда:</span>
                                            <span className="application__form-total-value application__form-total-value--secondary">
                                                {formatMoneyRub(rentalCost)}
                                            </span>
                                        </div>
                                        <div className="application__form-total-row">
                                            <span className="application__form-total-label">Сборка:</span>
                                            <span className="application__form-total-value application__form-total-value--secondary">
                                                {formatMoneyRub(assemblyCost)}
                                            </span>
                                        </div>
                                    </>
                                ) : null}
                                <div className="application__form-total-row">
                                    <span className="application__form-total-label">Итого:</span>
                                    <span className="application__form-total-value">
                                        {formatMoneyRub(totalPrice)}
                                    </span>
                                </div>
                                {delivery ? (
                                    <span className="application__form-total-hint">
                                        * без учёта доставки
                                    </span>
                                ) : null}

                            </div>
                        ) : null}

                        {message ? (
                            <p className="application__form-message application__form-message--ok" role="status">
                                {message}
                            </p>
                        ) : null}
                        {error ? (
                            <p className="application__form-message application__form-message--err" role="alert">
                                {error}
                            </p>
                        ) : null}

                        <ButtonLink
                            type="submit"
                            className={'button__main application__form-button'}
                            disabled={pending}
                        >
                            Отправить заявку
                        </ButtonLink>
                    </form>
                </div>
            </div>
        </>
    )
}