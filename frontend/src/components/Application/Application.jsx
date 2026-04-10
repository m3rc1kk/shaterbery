import { useCallback, useMemo, useState } from 'react';
import mailIcon from '../../assets/images/application/mail.svg'
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

export default function Application() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [fieldsKey, setFieldsKey] = useState(0);

    const [qty, setQty] = useState({
        tent3x6: 0,
        tent3x3: 0,
        furniture: 0,
        chairs: 0,
        bulb: 0,
    });
    const [days, setDays] = useState(1);
    const [delivery, setDelivery] = useState(true);
    const [assembly, setAssembly] = useState(false);

    const handleQtyChange = useCallback((name, value) => {
        setQty((prev) => ({ ...prev, [name]: value }));
    }, []);

    const priceBreakdown = useMemo(() => calcTotal(qty, days, assembly), [qty, days, assembly]);
    const { rental: rentalCost, tentAssembly, furnitureAssembly, assembly: assemblyCost, total: totalPrice } = priceBreakdown;

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        setError('');
        const form = e.currentTarget;
        if (!(form instanceof HTMLFormElement)) return;
        setPending(true);
        try {
            const payload = publicSubmitPayloadFromForm(form);
            await submitPublicApplication(payload);
            setMessage('Заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            form.reset();
            setFieldsKey((k) => k + 1);
            setQty({ tent3x6: 0, tent3x3: 0, furniture: 0, chairs: 0, bulb: 0 });
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
                                    <span className="application__contact-title">+7 999  999 99 99</span>
                                </div>
                            </li>
                            <li className="application__contact-item">
                                <img src={mailIcon} width={20} height={20} loading='lazy' alt="Почта" className="application__contact-icon"/>
                                <div className="application__contact-body">
                                    <span className="application__contact-subtitle">Почта</span>
                                    <span className="application__contact-title">example@gmail.com</span>
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
                                    <span className="application__contact-title">Орловская область</span>
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

                        <div className="application__form-tent">
                            <QuantityInput
                                id="tent3x6"
                                name="tent3x6"
                                label="Шатёр 3×6м — 3.000₽/сут"
                                className="field__input--half"
                                disabled={pending}
                                onValueChange={(v) => handleQtyChange('tent3x6', v)}
                            />

                            <QuantityInput
                                id="tent3x3"
                                name="tent3x3"
                                label="Шатёр 3×3м — 2.000₽/сут"
                                className="field__input--half"
                                disabled={pending}
                                onValueChange={(v) => handleQtyChange('tent3x3', v)}
                            />
                        </div>

                        <div className="application__form-furniture">
                            <QuantityInput
                                id="furniture"
                                name="furniture"
                                label="Комплект мебели — 3.000₽/сут"
                                className="field__input--third"
                                disabled={pending}
                                onValueChange={(v) => handleQtyChange('furniture', v)}
                            />

                            <QuantityInput
                                id="chairs"
                                name="chairs"
                                label="Стул раскладной — 150₽/шт"
                                className="field__input--third"
                                disabled={pending}
                                onValueChange={(v) => handleQtyChange('chairs', v)}
                            />

                            <QuantityInput
                                id="bulb"
                                name="bulb"
                                label="Лампочка — 100₽/шт"
                                className="field__input--third"
                                disabled={pending}
                                onValueChange={(v) => handleQtyChange('bulb', v)}
                            />
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
                                        {tentAssembly > 0 ? (
                                            <div className="application__form-total-row">
                                                <span className="application__form-total-label">Сборка шатров:</span>
                                                <span className="application__form-total-value application__form-total-value--secondary">
                                                    {formatMoneyRub(tentAssembly)}
                                                </span>
                                            </div>
                                        ) : null}
                                        {furnitureAssembly > 0 ? (
                                            <div className="application__form-total-row">
                                                <span className="application__form-total-label">Установка мебели:</span>
                                                <span className="application__form-total-value application__form-total-value--secondary">
                                                    {formatMoneyRub(furnitureAssembly)}
                                                </span>
                                            </div>
                                        ) : null}
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
                                {days > 1 ? (
                                    <span className="application__form-total-hint">
                                        * следующие сутки аренды со скидкой 50%
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