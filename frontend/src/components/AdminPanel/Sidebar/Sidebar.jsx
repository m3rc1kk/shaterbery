import ButtonLink from "../../Button/ButtonLink.jsx";
import dashboardIcon from '../../../assets/images/admin-panel/sidebar/dashboard.svg'
import dashboardActiveIcon from '../../../assets/images/admin-panel/sidebar/dashboard-active.svg'
import applicationIcon from '../../../assets/images/admin-panel/sidebar/application.svg'
import applicationActiveIcon from '../../../assets/images/admin-panel/sidebar/application-active.svg'
import logoutIcon from '../../../assets/images/admin-panel/sidebar/log-out.svg'
import logoIcon from '../../../assets/images/Logo.svg'
import closeButton from "../../../assets/images/header/x.svg";
import {useEffect, useRef, useState} from "react";
import burgerMenu from "../../../assets/images/header/menu.svg";
import {useLocation} from "react-router-dom";

export default function Sidebar() {
    const dialogRef = useRef(null);
    const closeTimeoutRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const { pathname } = useLocation();
    const isApplicationsPage = pathname.startsWith('/admin/applications');
    const isDashboardPage = pathname.startsWith('/admin/dashboard');
    const pageTitle = isApplicationsPage ? 'Заявки' : 'Дашборд';

    const openMenu = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }

        setIsClosing(false);
        dialogRef.current.showModal();
        requestAnimationFrame(() => setIsMenuOpen(true));
    };

    const closeMenu = () => {
        if (!dialogRef.current?.open || isClosing) {
            return;
        }

        setIsMenuOpen(false);
        setIsClosing(true);
        closeTimeoutRef.current = setTimeout(() => {
            dialogRef.current.close();
            setIsClosing(false);
            closeTimeoutRef.current = null;
        }, 220);
    };

    const onOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            closeMenu();
        }
    };

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar__inner">
                    <header className="sidebar__header hidden-tablet">
                        <h2 className="sidebar__header-title">{pageTitle}</h2>
                        <ButtonLink to={'/'} className="sidebar__header-button button__main">Новая заявка</ButtonLink>
                    </header>

                    <ButtonLink
                        className="button__burger-menu visible-tablet sidebar__burger-menu"
                        onClick={openMenu}
                    >
                        <img src={burgerMenu} width={24} height={24} loading='lazy' alt="Меню" className="button__burger-menu-icon"/>
                    </ButtonLink>

                    <div className="sidebar__menu hidden-tablet">
                        <div className="sidebar__logo logo">
                            <img src={logoIcon} width={91} height={30} loading='lazy' alt="Логотип" className="logo__image"/>
                        </div>

                        <nav className="sidebar__nav">
                            <h3 className="sidebar__nav-title">Навигация</h3>

                            <ul className="sidebar__nav-list">
                                <li className="sidebar__nav-item">
                                    <ButtonLink
                                        to={'/admin/dashboard'}
                                        className={`sidebar__nav-link ${isDashboardPage ? 'sidebar__nav-link--active' : ''}`}
                                    >
                                        <img
                                            src={isDashboardPage ? dashboardActiveIcon : dashboardIcon}
                                            width={16}
                                            height={16}
                                            loading='lazy'
                                            alt="Дашборд"
                                            className="sidebar__nav-icon"
                                        />
                                        <span className="sidebar__nav-text">Дашборд</span>
                                    </ButtonLink>
                                </li>
                                <li className="sidebar__nav-item">
                                    <ButtonLink
                                        to={'/admin/applications'}
                                        className={`sidebar__nav-link ${isApplicationsPage ? 'sidebar__nav-link--active' : ''}`}
                                    >
                                        <img
                                            src={isApplicationsPage ? applicationActiveIcon : applicationIcon}
                                            width={16}
                                            height={16}
                                            loading='lazy'
                                            alt="Заявки"
                                            className="sidebar__nav-icon"
                                        />
                                        <span className="sidebar__nav-text">Заявки</span>
                                    </ButtonLink>
                                </li>
                            </ul>
                        </nav>

                        <div className="sidebar__profile">
                            <div className="sidebar__profile-info">
                                <h3 className="sidebar__username">Максим М.</h3>
                                <span className="sidebar__role">Администратор</span>
                            </div>
                            <img src={logoutIcon} width={20} height={20} loading={'lazy'} alt="Выход из аккаунта" className="sidebar__logout"/>
                        </div>
                    </div>
                </div>
            </aside>

            <dialog
                ref={dialogRef}
                className={`mobile-overlay sidebar__mobile-overlay visible-tablet ${isMenuOpen ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''}`}
                id="mobileOverlay"
                onClick={onOverlayClick}
            >
                <div className="sidebar__mobile-menu">
                    <div className="sidebar__mobile-header">
                        <div className="sidebar__logo logo">
                            <img src={logoIcon} width={91} height={30} loading='lazy' alt="Логотип" className="logo__image"/>
                        </div>

                        <ButtonLink className="sidebar__mobile-close" onClick={closeMenu}>
                            <img src={closeButton} width={24} height={24} loading='lazy' alt="Закрыть меню"/>
                        </ButtonLink>
                    </div>

                    <nav className="sidebar__nav">
                        <h3 className="sidebar__nav-title">Навигация</h3>

                        <ul className="sidebar__nav-list">
                            <li className="sidebar__nav-item">
                                <ButtonLink
                                    to={'/admin/dashboard'}
                                    className={`sidebar__nav-link ${isDashboardPage ? 'sidebar__nav-link--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    <img
                                        src={isDashboardPage ? dashboardActiveIcon : dashboardIcon}
                                        width={16}
                                        height={16}
                                        loading='lazy'
                                        alt="Дашборд"
                                        className="sidebar__nav-icon"
                                    />
                                    <span className="sidebar__nav-text">Дашборд</span>
                                </ButtonLink>
                            </li>
                            <li className="sidebar__nav-item">
                                <ButtonLink
                                    to={'/admin/applications'}
                                    className={`sidebar__nav-link ${isApplicationsPage ? 'sidebar__nav-link--active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    <img
                                        src={isApplicationsPage ? applicationActiveIcon : applicationIcon}
                                        width={16}
                                        height={16}
                                        loading='lazy'
                                        alt="Заявки"
                                        className="sidebar__nav-icon"
                                    />
                                    <span className="sidebar__nav-text">Заявки</span>
                                </ButtonLink>
                            </li>
                        </ul>
                    </nav>

                    <ButtonLink to={'/'} className="button__main sidebar__mobile-create" onClick={closeMenu}>
                        Новая заявка
                    </ButtonLink>

                    <div className="sidebar__mobile-profile">
                        <div className="sidebar__profile-info">
                            <h3 className="sidebar__username">Максим М.</h3>
                            <span className="sidebar__role">Администратор</span>
                        </div>
                        <img src={logoutIcon} width={20} height={20} loading={'lazy'} alt="Выход из аккаунта" className="sidebar__logout"/>
                    </div>
                </div>
            </dialog>
        </>
    )
}