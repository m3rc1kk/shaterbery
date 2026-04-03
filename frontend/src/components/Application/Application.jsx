import { useState } from 'react';
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

export default function Application() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);
    const [fieldsKey, setFieldsKey] = useState(0);

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
                                <img src={mailIcon} width={20} height={20} loading='lazy' alt="Телефон" className="application__contact-icon"/>
                                <div className="application__contact-body">
                                    <span className="application__contact-subtitle">Почта</span>
                                    <span className="application__contact-title">example@gmail.com</span>
                                </div>
                            </li>
                            <li className="application__contact-item">
                                <img src={timeIcon} width={20} height={20} loading='lazy' alt="Телефон" className="application__contact-icon"/>
                                <div className="application__contact-body">
                                    <span className="application__contact-subtitle">Режим работы</span>
                                    <span className="application__contact-title">8:00 - 22:00, UTC+3</span>
                                </div>
                            </li>
                            <li className="application__contact-item">
                                <img src={compassIcon} width={20} height={20} loading='lazy' alt="Телефон" className="application__contact-icon"/>
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

                        <div className="application__form-tent">
                            <QuantityInput
                                id="tent3x6"
                                name="tent3x6"
                                label="Шатёр 3×6м - 2.000 ₽/сут"
                                className="field__input--half"
                                disabled={pending}
                            />

                            <QuantityInput
                                id="tent3x3"
                                name="tent3x3"
                                label="Шатёр 3×3м - 1.500₽/сут"
                                className="field__input--half"
                                disabled={pending}
                            />
                        </div>

                        <div className="application__form-furniture">
                            <QuantityInput
                                id="furniture"
                                name="furniture"
                                label="Комплект мебели - 500₽/сут"
                                className="field__input--third"
                                disabled={pending}
                            />

                            <QuantityInput
                                id="chairs"
                                name="chairs"
                                label="Стул раскладной - 200₽/шт"
                                className="field__input--third"
                                disabled={pending}
                            />

                            <QuantityInput
                                id="bulb"
                                name="bulb"
                                label="Лампочка - 100₽/шт"
                                className="field__input--third"
                                disabled={pending}
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
                            />
                            <YesNoToggle
                                label="Сборка"
                                name="assembly"
                                iconYes={boxActiveIcon}
                                iconNo={boxIcon}
                                className="field__input--half"
                                disabled={pending}
                            />
                        </div>
                        </div>

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