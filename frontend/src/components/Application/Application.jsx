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

export default function Application() {
    function handleSubmit(e) {
        e.preventDefault()
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
                        <div className="application__form-contact">
                            <Input
                                id="name"
                                label="Как к вам обращаться"
                                placeholder="Иван"
                                className="field__input--half"
                                required
                            />

                            <PhoneInput
                                id="phone"
                                name="phone"
                                label="Телефон"
                                className="field__input--half"
                                required
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
                            />

                            <TimeInput
                                id="time"
                                name="time"
                                label="Время"
                                className="field__input--half"
                                required
                            />
                        </div>

                        <Input
                            id="place"
                            label="Место проведения"
                            placeholder="Адрес"
                            required
                        />

                        <div className="application__form-tent">
                            <QuantityInput
                                id="tent3x6"
                                name="tent3x6"
                                label="Шатёр 3×6м - 2.000 ₽/сут"
                                className="field__input--half"
                            />

                            <QuantityInput
                                id="tent3x3"
                                name="tent3x3"
                                label="Шатёр 3×3м - 1.500₽/сут"
                                className="field__input--half"
                            />
                        </div>

                        <div className="application__form-furniture">
                            <QuantityInput
                                id="furniture"
                                name="furniture"
                                label="Комплект мебели - 500₽/сут"
                                className="field__input--third"
                            />

                            <QuantityInput
                                id="chairs"
                                name="chairs"
                                label="Стул раскладной - 200₽/шт"
                                className="field__input--third"
                            />

                            <QuantityInput
                                id="bulb"
                                name="bulb"
                                label="Лампочка - 100₽/шт"
                                className="field__input--third"
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
                            />
                            <YesNoToggle
                                label="Сборка"
                                name="assembly"
                                iconYes={boxActiveIcon}
                                iconNo={boxIcon}
                                className="field__input--half"
                            />
                        </div>

                        <ButtonLink type="submit" className={'button__main application__form-button'}>
                            Отправить заявку
                        </ButtonLink>
                    </form>
                </div>
            </div>
        </>
    )
}