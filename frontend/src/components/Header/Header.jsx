import logo from '../../assets/images/Logo.svg';
import ButtonLink from "../Button/ButtonLink.jsx";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import burgerMenu from "../../assets/images/header/menu.svg";
import closeButton from "../../assets/images/header/x.svg";
import { useCity } from "../../context/CityContext.jsx";

export default function Header() {
    const dialogRef = useRef(null);
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const { citySlug, cityData, cities, setCity } = useCity();

    const displayName = cityData?.name ?? (citySlug === 'orel' ? 'Орёл' : citySlug);

    const openMenu = () => {
        dialogRef.current.showModal();
    };

    const handleCitySelect = (slug) => {
        setCity(slug);
        setCityDropdownOpen(false);
    };

    return (
        <>
            <header className="header container">
                <div className="header__inner">
                    <Link to="/#hero" className="header__logo logo">
                        <img src={logo} width={95} height={30} loading='lazy' alt="Логотип" className="logo__image"/>
                    </Link>

                    <nav className="header__nav hidden-mobile">
                        <ul className="header__nav-list">
                            <li className="headear__nav-item">
                                <ButtonLink to={'/#gallery'} className="header__nav-link">
                                    Галерея
                                </ButtonLink>
                            </li>
                            <li className="headear__nav-item">
                                <ButtonLink to={'/#reviews'} className="header__nav-link">
                                    Отзывы
                                </ButtonLink>
                            </li>
                            <li className="headear__nav-item">
                                <ButtonLink to={'/#services'} className="header__nav-link">
                                    Цены
                                </ButtonLink>
                            </li>
                            <li className="headear__nav-item">
                                <ButtonLink to={'/#faq'} className="header__nav-link">
                                    FAQ
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

                    <div className="header__rating header__city">
                        <span className="header__rating-title">Город:</span>
                        <div className="header__city-selector">
                            <button
                                type="button"
                                className="header__city-btn"
                                onClick={() => setCityDropdownOpen((v) => !v)}
                            >
                                <span className="header__rating-value">{displayName}</span>
                                <span className="header__city-arrow">{cityDropdownOpen ? '▲' : '▼'}</span>
                            </button>
                            {cityDropdownOpen && cities.length > 0 && (
                                <ul className="header__city-dropdown">
                                    {cities.map((c) => (
                                        <li key={c.slug}>
                                            <button
                                                type="button"
                                                className={`header__city-option${c.slug === citySlug ? ' header__city-option--active' : ''}`}
                                                onClick={() => handleCitySelect(c.slug)}
                                            >
                                                {c.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
                            <ButtonLink to={'/#gallery'} className="mobile-overlay__link">Галерея</ButtonLink>
                        </li>
                        <li className="mobile-overlay__item">
                            <ButtonLink to={'/#reviews'} className="mobile-overlay__link">Отзывы</ButtonLink>
                        </li>
                        <li className="mobile-overlay__item">
                            <ButtonLink to={'/#services'} className="mobile-overlay__link">Цены</ButtonLink>
                        </li>
                        <li className="mobile-overlay__item">
                            <ButtonLink to={'/#services'} className="mobile-overlay__link">Товары</ButtonLink>
                        </li>
                    </ul>
                    {cities.length > 0 && (
                        <div className="mobile-overlay__city">
                            <span className="mobile-overlay__city-label">Город</span>
                            <div className="mobile-overlay__city-list">
                                {cities.map((c) => (
                                    <button
                                        key={c.slug}
                                        type="button"
                                        className={`mobile-overlay__city-btn${c.slug === citySlug ? ' mobile-overlay__city-btn--active' : ''}`}
                                        onClick={() => { setCity(c.slug); dialogRef.current?.close(); }}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </dialog>
        </>
    );
}
