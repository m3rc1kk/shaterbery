import { useState } from "react";
import { Link } from "react-router-dom";
import ButtonLink from "../Button/ButtonLink.jsx";
import FAQCard from "../FAQCard/FAQCard.jsx";
import arrowRight from "../../assets/images/hero/arrow-right.svg";
import phoneIcon from "../../assets/images/footer/phone.svg";
import mailIcon from "../../assets/images/footer/mail.svg";
import timeIcon from "../../assets/images/footer/clock.svg";
import compassIcon from "../../assets/images/footer/compass.svg";
import logo from '../../assets/images/Logo.svg'
import { AVITO_URL, faqItems } from "../../data/siteContent.js";

export default function Footer() {
    const [openId, setOpenId] = useState(null);

    const handleToggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <>
            <footer className="footer container">
                <div className="footer__inner">
                    <div className="footer__leftside">
                        <Link to="/#hero" className="footer__logo logo">
                            <img src={logo} width={94} height={42} loading='lazy' alt="Логотип" className="logo__image"/>
                        </Link>
                        <div className="footer__leftside-text">
                            <p>Аренда и установка шатров для мероприятий любого масштаба. Привозим, монтируем,
                                убираем - вы просто наслаждаетесь праздником.</p>
                        </div>

                        <div className="footer__leftside-buttons">
                            <ButtonLink to={AVITO_URL} className={'footer__button footer__button--transparent button__main button--transparent'}>Авито <img src={arrowRight} width={7} height={10}
                                                                                                                                                      loading='lazy' alt="Стрелка" className="footer__button-icon"/> </ButtonLink>
                            <ButtonLink to={'/#order'} className={'footer__button footer__button--transparent button__main button--transparent'}>Связаться <img src={arrowRight} width={7} height={10}
                                                                                                                                                      loading='lazy' alt="Стрелка" className="footer__button-icon"/> </ButtonLink>
                        </div>
                    </div>

                    <div className="footer__rightside">
                        <nav className="footer__nav">
                            <h3 className="footer__nav-title footer__title">Навигация</h3>
                            <ul className="footer__nav-list footer__list">
                                <li className="footer__nav-item">
                                    <ButtonLink to={'/#hero'} className={'footer__nav-link'}>
                                        Главная
                                    </ButtonLink>
                                </li>
                                <li className="footer__nav-item">
                                    <ButtonLink to={'/#how-it-works'} className={'footer__nav-link'}>
                                        Как это работает
                                    </ButtonLink>
                                </li>
                                <li className="footer__nav-item">
                                    <ButtonLink to={'/#gallery'} className={'footer__nav-link'}>
                                        Галерея
                                    </ButtonLink>
                                </li>
                                <li className="footer__nav-item">
                                    <ButtonLink to={'/#services'} className={'footer__nav-link'}>
                                        Ассортимент
                                    </ButtonLink>
                                </li>
                                <li className="footer__nav-item">
                                    <ButtonLink to={'/#order'} className={'footer__nav-link'}>
                                        Заказать
                                    </ButtonLink>
                                </li>
                                <li className="footer__nav-item">
                                    <ButtonLink to={'/#faq'} className={'footer__nav-link'}>
                                        FAQ
                                    </ButtonLink>
                                </li>
                            </ul>
                        </nav>

                        <div className="footer__services">
                            <h3 className="footer__services-title footer__title">Услуги</h3>
                            <ul className="footer__services-list footer__list">
                                <li className="footer__services-item">
                                    Шатёр 3х3
                                </li>
                                <li className="footer__services-item">
                                    Шатёр 3х6
                                </li>
                                <li className="footer__services-item">
                                    Комплект мебели
                                </li>
                                <li className="footer__services-item">
                                    Раскладные стулья
                                </li>
                                <li className="footer__services-item">
                                    Лампочки для шатра
                                </li>
                                <li className="footer__services-item">
                                    Доставка
                                </li>
                                <li className="footer__services-item">
                                    Сборка
                                </li>
                            </ul>
                        </div>

                        <div className="footer__contact">
                            <h3 className="footer__contact-title footer__title">Контакты</h3>
                            <ul className="footer__contact-list">
                                <li className="footer__contact-item">
                                    <img src={phoneIcon} width={20} height={20} loading='lazy' alt="Телефон" className="footer__contact-icon"/>
                                    <div className="footer__contact-body">
                                        <span className="footer__contact-subtitle">Телефон</span>
                                        <span className="footer__contact-title">+7 999  999 99 99</span>
                                    </div>
                                </li>
                                <li className="footer__contact-item">
                                    <img src={mailIcon} width={20} height={20} loading='lazy' alt="Телефон" className="footer__contact-icon"/>
                                    <div className="footer__contact-body">
                                        <span className="footer__contact-subtitle">Почта</span>
                                        <span className="footer__contact-title">example@gmail.com</span>
                                    </div>
                                </li>
                                <li className="footer__contact-item">
                                    <img src={timeIcon} width={20} height={20} loading='lazy' alt="Телефон" className="footer__contact-icon"/>
                                    <div className="footer__contact-body">
                                        <span className="footer__contact-subtitle">Режим работы</span>
                                        <span className="footer__contact-title">8:00 - 22:00, UTC+3</span>
                                    </div>
                                </li>
                                <li className="footer__contact-item">
                                    <img src={compassIcon} width={20} height={20} loading='lazy' alt="Телефон" className="footer__contact-icon"/>
                                    <div className="footer__contact-body">
                                        <span className="footer__contact-subtitle">Зона работы</span>
                                        <span className="footer__contact-title">Орловская область</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}