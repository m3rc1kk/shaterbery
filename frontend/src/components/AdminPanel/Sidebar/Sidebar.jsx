import ButtonLink from "../../Button/ButtonLink.jsx";
import dashboardIcon from '../../../assets/images/admin-panel/sidebar/dashboard.svg'
import dashboardActiveIcon from '../../../assets/images/admin-panel/sidebar/dashboard-active.svg'
import applicationIcon from '../../../assets/images/admin-panel/sidebar/application.svg'
import applicationActiveIcon from '../../../assets/images/admin-panel/sidebar/application-active.svg'
import servicesIcon from '../../../assets/images/admin-panel/sidebar/services.svg'
import servicesActiveIcon from '../../../assets/images/admin-panel/sidebar/services-active.svg'
import logoutIcon from '../../../assets/images/admin-panel/sidebar/log-out.svg'
import logoIcon from '../../../assets/images/Logo.svg'
import closeButton from "../../../assets/images/admin-panel/sidebar/x.svg";
import { useEffect, useRef, useState } from "react";
import burgerMenu from "../../../assets/images/header/menu.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth.js";
import { adminCreatePayloadFromForm } from "../../../api/applicationForm.js";
import { createApplicationAdmin } from "../../../api/applications.js";
import { fetchCities } from "../../../api/cities.js";
import { ApiError } from "../../../api/http.js";
import AdminApplicationFormBody from "../AdminApplicationFormBody/AdminApplicationFormBody.jsx";

function adminShortName(user) {
    if (!user) return 'Админ';
    const full = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
    if (full) return full;
    return user.username || 'Админ';
}

const PAGE_TITLES = {
    '/admin/dashboard': 'Дашборд',
    '/admin/applications': 'Заявки',
    '/admin/services': 'Товары',
};

function getPageTitle(pathname) {
    for (const [prefix, title] of Object.entries(PAGE_TITLES)) {
        if (pathname.startsWith(prefix)) return title;
    }
    return 'Дашборд';
}

export default function Sidebar() {
    const dialogRef = useRef(null);
    const newApplicationDialogRef = useRef(null);
    const newApplicationOpenTimeoutRef = useRef(null);
    const closeTimeoutRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [newAppFieldsKey, setNewAppFieldsKey] = useState(0);
    const [createError, setCreateError] = useState('');
    const [createPending, setCreatePending] = useState(false);
    const [cities, setCities] = useState([]);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const profileName = adminShortName(user);
    const isApplicationsPage = pathname.startsWith('/admin/applications');
    const isDashboardPage = pathname.startsWith('/admin/dashboard');
    const isServicesPage = pathname.startsWith('/admin/services');
    const pageTitle = getPageTitle(pathname);

    useEffect(() => {
        fetchCities().then(setCities).catch(() => {});
    }, []);

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

    const openNewApplicationDialog = () => {
        if (newApplicationOpenTimeoutRef.current) {
            clearTimeout(newApplicationOpenTimeoutRef.current);
            newApplicationOpenTimeoutRef.current = null;
        }
        if (dialogRef.current?.open) {
            closeMenu();
            newApplicationOpenTimeoutRef.current = setTimeout(() => {
                newApplicationDialogRef.current?.showModal();
                newApplicationOpenTimeoutRef.current = null;
            }, 230);
            return;
        }
        newApplicationDialogRef.current?.showModal();
    };

    const closeNewApplicationDialog = () => {
        newApplicationDialogRef.current?.close();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/admin/sign-in', { replace: true });
    };

    const handleNewApplicationSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!(form instanceof HTMLFormElement)) return;
        setCreateError('');
        setCreatePending(true);
        try {
            await createApplicationAdmin(adminCreatePayloadFromForm(form));
            form.reset();
            setNewAppFieldsKey((k) => k + 1);
            closeNewApplicationDialog();
            window.dispatchEvent(new CustomEvent('shaterbery:applications-changed'));
        } catch (err) {
            setCreateError(err instanceof ApiError ? err.message : 'Не удалось создать заявку');
        } finally {
            setCreatePending(false);
        }
    };

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            if (newApplicationOpenTimeoutRef.current) {
                clearTimeout(newApplicationOpenTimeoutRef.current);
            }
        };
    }, []);

    const navItems = [
        { to: '/admin/dashboard', label: 'Дашборд', icon: dashboardIcon, activeIcon: dashboardActiveIcon, active: isDashboardPage },
        { to: '/admin/applications', label: 'Заявки', icon: applicationIcon, activeIcon: applicationActiveIcon, active: isApplicationsPage },
        { to: '/admin/services', label: 'Товары', icon: servicesIcon, activeIcon: servicesActiveIcon, active: isServicesPage },
    ];

    return (
        <>
            <aside className="sidebar">
                <div className="sidebar__inner">
                    <header className="sidebar__header hidden-tablet">
                        <h2 className="sidebar__header-title">{pageTitle}</h2>
                        <ButtonLink
                            className="sidebar__header-button button__main"
                            onClick={openNewApplicationDialog}
                        >
                            Новая заявка
                        </ButtonLink>
                    </header>

                    <ButtonLink
                        className="button__burger-menu visible-tablet sidebar__burger-menu"
                        onClick={openMenu}
                    >
                        <img src={burgerMenu} width={24} height={24} loading='lazy' alt="Меню" className="button__burger-menu-icon" />
                    </ButtonLink>

                    <div className="sidebar__menu hidden-tablet">
                        <div className="sidebar__logo logo">
                            <img src={logoIcon} width={91} height={30} loading='lazy' alt="Логотип" className="logo__image" />
                        </div>

                        <nav className="sidebar__nav">
                            <h3 className="sidebar__nav-title">Навигация</h3>

                            <ul className="sidebar__nav-list">
                                {navItems.map((item) => (
                                    <li key={item.to} className="sidebar__nav-item">
                                        <ButtonLink
                                            to={item.to}
                                            className={`sidebar__nav-link ${item.active ? 'sidebar__nav-link--active' : ''}`}
                                        >
                                            <img
                                                src={item.active ? item.activeIcon : item.icon}
                                                width={16}
                                                height={16}
                                                loading='lazy'
                                                alt={item.label}
                                                className="sidebar__nav-icon"
                                            />
                                            <span className="sidebar__nav-text">{item.label}</span>
                                        </ButtonLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <div className="sidebar__profile">
                            <div className="sidebar__profile-info">
                                <h3 className="sidebar__username">{profileName}</h3>
                                <span className="sidebar__role">Администратор</span>
                            </div>
                            <button
                                type="button"
                                className="sidebar__logout-btn"
                                onClick={handleLogout}
                                aria-label="Выход из аккаунта"
                            >
                                <img src={logoutIcon} width={20} height={20} loading={'lazy'} alt="" className="sidebar__logout" />
                            </button>
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
                            <img src={logoIcon} width={91} height={30} loading='lazy' alt="Логотип" className="logo__image" />
                        </div>

                        <ButtonLink className="sidebar__mobile-close" onClick={closeMenu}>
                            <img src={closeButton} width={24} height={24} loading='lazy' alt="Закрыть меню" />
                        </ButtonLink>
                    </div>

                    <nav className="sidebar__nav">
                        <h3 className="sidebar__nav-title">Навигация</h3>

                        <ul className="sidebar__nav-list">
                            {navItems.map((item) => (
                                <li key={item.to} className="sidebar__nav-item">
                                    <ButtonLink
                                        to={item.to}
                                        className={`sidebar__nav-link ${item.active ? 'sidebar__nav-link--active' : ''}`}
                                        onClick={closeMenu}
                                    >
                                        <img
                                            src={item.active ? item.activeIcon : item.icon}
                                            width={16}
                                            height={16}
                                            loading='lazy'
                                            alt={item.label}
                                            className="sidebar__nav-icon"
                                        />
                                        <span className="sidebar__nav-text">{item.label}</span>
                                    </ButtonLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <ButtonLink
                        className="button__main sidebar__mobile-create"
                        onClick={openNewApplicationDialog}
                    >
                        Новая заявка
                    </ButtonLink>

                    <div className="sidebar__mobile-profile">
                        <div className="sidebar__profile-info">
                            <h3 className="sidebar__username">{profileName}</h3>
                            <span className="sidebar__role">Администратор</span>
                        </div>
                        <button
                            type="button"
                            className="sidebar__logout-btn"
                            onClick={() => { closeMenu(); handleLogout(); }}
                            aria-label="Выход из аккаунта"
                        >
                            <img src={logoutIcon} width={20} height={20} loading={'lazy'} alt="" className="sidebar__logout" />
                        </button>
                    </div>
                </div>
            </dialog>

            <dialog
                ref={newApplicationDialogRef}
                className="new-applications"
            >
                <div className="new-applications__inner">
                    <header className="new-applications__header">
                        <h3 className="new-applications__title">Создать заявку</h3>
                        <ButtonLink
                            type="button"
                            className="new-applications__close"
                            onClick={closeNewApplicationDialog}
                        >
                            <img src={closeButton} width={24} height={24} loading='lazy' alt="Закрыть" />
                        </ButtonLink>
                    </header>
                    <form className="new-applications__form" onSubmit={handleNewApplicationSubmit} noValidate>
                        <div key={newAppFieldsKey} className="new-applications__fields">
                            <AdminApplicationFormBody
                                idPrefix="new-app"
                                disabled={createPending}
                                showAdminMeta
                                cities={cities}
                            />
                        </div>

                        {createError ? (
                            <p className="new-applications__error" role="alert">{createError}</p>
                        ) : null}

                        <ButtonLink type="submit" className="button__main new-applications__form-button" disabled={createPending}>
                            Создать заявку
                        </ButtonLink>
                    </form>
                </div>
            </dialog>
        </>
    )
}