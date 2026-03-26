import logo from '../../assets/images/Logo.svg';
import ButtonLink from "../Button/ButtonLink.jsx";
import { useRef } from "react";
import burgerMenu from "../../assets/images/header/menu.svg";
import closeButton from "../../assets/images/header/x.svg";

export default function Header() {
    const dialogRef = useRef(null);

    const openMenu = () => {
        dialogRef.current.showModal();
    };

    return (
        <>
            <header className="header container">
                <div className="header__inner">
                    <div className="header__logo logo">
                        <img src={logo} width={95} height={30} loading='lazy' alt="Логотип" className="logo__image"/>
                    </div>

                    <nav className="header__nav hidden-mobile">
                        <ul className="header__nav-list">
                            <li className="headear__nav-item">
                                <ButtonLink to={'/'} className="header__nav-link">
                                    Галерея
                                </ButtonLink>
                            </li>
                            <li className="headear__nav-item">
                                <ButtonLink to={'/'} className="header__nav-link">
                                    Отзывы
                                </ButtonLink>
                            </li>
                            <li className="headear__nav-item">
                                <ButtonLink to={'/'} className="header__nav-link">
                                    Цены
                                </ButtonLink>
                            </li>
                            <li className="headear__nav-item">
                                <ButtonLink to={'/'} className="header__nav-link">
                                    Товары
                                </ButtonLink>
                            </li>
                        </ul>
                    </nav>

                    <ButtonLink
                        className="button__burger-menu visible-mobile"
                        onClick={openMenu}
                    >
                        <img src={burgerMenu} width={24} height={24} loading='lazy' alt="Меню" className="button__burger-menu-icon"/>
                    </ButtonLink>

                    <div className="header__rating">
                        <span className="header__rating-title">
                            Рейтинг:
                        </span>
                        <span className="header__rating-value">5.0</span>
                    </div>
                </div>
            </header>

            <dialog ref={dialogRef} className="mobile-overlay visible-mobile" id="mobileOverlay">
                <form className="mobile-overlay__close" method="dialog">
                    <ButtonLink className="mobile-overlay__close-button cross-button" type="submit">
                        <img src={closeButton} width={24} height={24} loading='lazy' alt="Закрыть" className="mobile-overlay__close-button-icon"/>
                    </ButtonLink>
                </form>

                <div className="mobile-overlay__body">
                    <ul className="mobile-overlay__list">
                        <li className="mobile-overlay__item">
                            <ButtonLink to={'/'} className="mobile-overlay__link">Галерея</ButtonLink>
                        </li>
                        <li className="mobile-overlay__item">
                            <ButtonLink to={'/'} className="mobile-overlay__link">Отзывы</ButtonLink>
                        </li>
                        <li className="mobile-overlay__item">
                            <ButtonLink to={'/'} className="mobile-overlay__link">Цены</ButtonLink>
                        </li>
                        <li className="mobile-overlay__item">
                            <ButtonLink to={'/'} className="mobile-overlay__link">Товары</ButtonLink>
                        </li>
                    </ul>
                </div>
            </dialog>
        </>
    );
}
