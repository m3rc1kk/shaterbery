import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/AdminPanel/Sidebar/Sidebar.jsx';
import closeButton from '../../../assets/images/admin-panel/sidebar/x.svg';
import ButtonLink from '../../../components/Button/ButtonLink.jsx';
import editIcon from '../../../assets/images/admin-panel/applications/edit.svg';
import deleteIcon from '../../../assets/images/admin-panel/applications/delete.svg';
import AdminApplicationFormBody from '../../../components/AdminPanel/AdminApplicationFormBody/AdminApplicationFormBody.jsx';
import {
    buildApplicationsListPath,
    deleteApplication,
    fetchApplicationsList,
    pathFromNextUrl,
    patchApplication,
} from '../../../api/applications.js';
import { adminPatchPayloadFromForm } from '../../../api/applicationForm.js';
import { ApiError } from '../../../api/http.js';
import {
    formatDateTimeRu,
    formatGoodsLineCaption,
    formatMoneyRub,
    shortClientName,
    truncate,
} from '../../../utils/format.js';

const SOURCE_LABELS = {
    site: 'Сайт',
    manual: 'Вручную',
};

function statusStClass(value) {
    return ['new', 'inwork', 'closed'].includes(value) ? value : 'new';
}

function statusToneModifier(status, blockPrefix) {
    const v = statusStClass(status);
    if (v === 'new') return '';
    return ` ${blockPrefix}--st-${v}`;
}

function ynLabel(v) {
    return v ? 'Да' : 'Нет';
}

function detailGoodsFromApi(app) {
    const lines = app.goods_lines ?? [];
    return lines.map((line) => ({
        label: line.label,
        value: formatGoodsLineCaption(line),
    }));
}

function mergeUpdated(list, id, updated) {
    return list.map((row) => (row.id === id ? { ...row, ...updated } : row));
}

export default function Applications() {
    const navigate = useNavigate();
    const detailDialogRef = useRef(null);
    const editDialogRef = useRef(null);
    const confirmDialogRef = useRef(null);
    const confirmResolveRef = useRef(null);
    const tableWrapRef = useRef(null);
    const sentinelRef = useRef(null);
    const nextPathRef = useRef(null);
    const loadingMoreRef = useRef(false);

    const [list, setList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [editApp, setEditApp] = useState(null);
    const [editFormKey, setEditFormKey] = useState(0);
    const [editError, setEditError] = useState('');
    const [editSaving, setEditSaving] = useState(false);

    const [editingPrice, setEditingPrice] = useState(false);
    const [priceInput, setPriceInput] = useState('');
    const [priceSaving, setPriceSaving] = useState(false);

    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [listError, setListError] = useState('');
    const [actionError, setActionError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 350);
        return () => clearTimeout(t);
    }, [searchInput]);

    const loadFirstPage = useCallback(async () => {
        setListError('');
        setLoadingInitial(true);
        nextPathRef.current = null;
        loadingMoreRef.current = false;
        try {
            const path = buildApplicationsListPath({ search, status: statusFilter });
            const data = await fetchApplicationsList(path);
            setList(data.results ?? []);
            nextPathRef.current = pathFromNextUrl(data.next);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                navigate('/admin/sign-in', { replace: true, state: { from: '/admin/applications' } });
                return;
            }
            setListError(
                err instanceof ApiError ? err.message : 'Не удалось загрузить заявки',
            );
            setList([]);
        } finally {
            setLoadingInitial(false);
        }
    }, [search, statusFilter, navigate]);

    useEffect(() => {
        loadFirstPage();
    }, [loadFirstPage]);

    const loadMore = useCallback(async () => {
        const path = nextPathRef.current;
        if (!path || loadingMoreRef.current || loadingInitial) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
        try {
            const data = await fetchApplicationsList(path);
            setList((prev) => [...prev, ...(data.results ?? [])]);
            nextPathRef.current = pathFromNextUrl(data.next);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                navigate('/admin/sign-in', { replace: true, state: { from: '/admin/applications' } });
                return;
            }
            setListError(err instanceof ApiError ? err.message : 'Не удалось догрузить заявки');
        } finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [loadingInitial, navigate]);

    useEffect(() => {
        const onRefresh = () => {
            loadFirstPage();
        };
        window.addEventListener('shaterbery:applications-changed', onRefresh);
        return () => window.removeEventListener('shaterbery:applications-changed', onRefresh);
    }, [loadFirstPage]);

    useEffect(() => {
        const root = tableWrapRef.current;
        const target = sentinelRef.current;
        if (!root || !target) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    nextPathRef.current &&
                    !loadingMoreRef.current &&
                    !loadingInitial
                ) {
                    loadMore();
                }
            },
            { root, rootMargin: '120px', threshold: 0 },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [loadMore, loadingInitial, list.length, search, statusFilter]);

    const openDetailDialog = (app) => {
        setActionError('');
        setSelected(app);
        setEditingPrice(false);
        setPriceInput('');
        setTimeout(() => detailDialogRef.current?.showModal(), 0);
    };

    const closeDetailDialog = () => {
        detailDialogRef.current?.close();
        setSelected(null);
        setActionError('');
        setEditingPrice(false);
    };

    const startPriceEdit = () => {
        if (!selected) return;
        setPriceInput(String(Math.round(Number(selected.total_price) || 0)));
        setEditingPrice(true);
    };

    const cancelPriceEdit = () => {
        setEditingPrice(false);
        setPriceInput('');
    };

    const savePriceEdit = async () => {
        if (!selected) return;
        const num = Number(priceInput);
        if (!Number.isFinite(num) || num < 0) {
            setActionError('Введите корректную сумму');
            return;
        }
        setPriceSaving(true);
        setActionError('');
        try {
            const updated = await patchApplication(selected.id, { total_price: num });
            setList((prev) => mergeUpdated(prev, selected.id, updated));
            setSelected((s) => (s && s.id === selected.id ? { ...s, ...updated } : s));
            setEditingPrice(false);
        } catch (err) {
            setActionError(
                err instanceof ApiError ? err.message : 'Не удалось сохранить цену',
            );
        } finally {
            setPriceSaving(false);
        }
    };

    const closeEditDialog = () => {
        editDialogRef.current?.close();
        setEditApp(null);
        setEditError('');
    };

    const startEdit = () => {
        if (!selected) return;
        setEditApp(selected);
        setEditFormKey((k) => k + 1);
        setEditError('');
        detailDialogRef.current?.close();
        setSelected(null);
        setTimeout(() => editDialogRef.current?.showModal(), 0);
    };

    const stopRowClick = (event) => {
        event.stopPropagation();
    };

    async function handleEditSubmit(e) {
        e.preventDefault();
        if (!editApp) return;
        const form = e.currentTarget;
        if (!(form instanceof HTMLFormElement)) return;
        setEditSaving(true);
        setEditError('');
        try {
            const payload = adminPatchPayloadFromForm(form);
            const updated = await patchApplication(editApp.id, payload);
            setList((prev) => mergeUpdated(prev, editApp.id, updated));
            closeEditDialog();
            window.dispatchEvent(new CustomEvent('shaterbery:applications-changed'));
        } catch (err) {
            setEditError(err instanceof ApiError ? err.message : 'Не удалось сохранить изменения');
        } finally {
            setEditSaving(false);
        }
    }

    const onStatusChange = async (id, status) => {
        setActionError('');
        try {
            const updated = await patchApplication(id, { status });
            setList((prev) => mergeUpdated(prev, id, updated));
            setSelected((s) => (s && s.id === id ? { ...s, ...updated } : s));
        } catch (err) {
            setActionError(
                err instanceof ApiError ? err.message : 'Не удалось обновить статус',
            );
        }
    };

    function showConfirm() {
        return new Promise((resolve) => {
            confirmResolveRef.current = resolve;
            confirmDialogRef.current?.showModal();
        });
    }

    const closeConfirm = (result) => {
        confirmDialogRef.current?.close();
        confirmResolveRef.current?.(result);
        confirmResolveRef.current = null;
    };

    const onDelete = async () => {
        if (!selected) return;
        const confirmed = await showConfirm();
        if (!confirmed) return;
        setSaving(true);
        setActionError('');
        try {
            await deleteApplication(selected.id);
            setList((prev) => prev.filter((r) => r.id !== selected.id));
            closeDetailDialog();
            window.dispatchEvent(new CustomEvent('shaterbery:applications-changed'));
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : 'Не удалось удалить заявку');
        } finally {
            setSaving(false);
        }
    };

    const goodsForDetail = selected ? detailGoodsFromApi(selected) : [];

    return (
        <>
            <Sidebar />
            <div className="applications">
                <div className="applications__inner">
                    <header className="applications__header">
                        <input
                            type="text"
                            placeholder="Поиск…"
                            className="applications__input-search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            autoComplete="off"
                        />
                        <select
                            className="applications__input-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Все статусы</option>
                            <option value="new">Новый</option>
                            <option value="inwork">В работе</option>
                            <option value="closed">Закрыт</option>
                        </select>
                    </header>
                    {listError ? (
                        <p className="applications__list-error" role="alert">
                            {listError}
                        </p>
                    ) : null}

                    <div
                        ref={tableWrapRef}
                        className="applications__table-wrap"
                        role="region"
                        aria-label="Таблица заявок, при узком экране прокрутка по горизонтали"
                    >
                        <table className="applications__table">
                            <thead>
                                <tr className="applications__tr">
                                    <th className="applications__th">Клиент</th>
                                    <th className="applications__th">Дата</th>
                                    <th className="applications__th">Место</th>
                                    <th className="applications__th">Цена</th>
                                    <th className="applications__th applications__resource">Откуда</th>
                                    <th className="applications__th applications__composition">Состав</th>
                                    <th className="applications__th">Статус</th>
                                </tr>
                            </thead>

                            <tbody className="applications__tbody">
                                {loadingInitial && list.length === 0 ? (
                                    <tr className="applications__tr applications__tr--data">
                                        <td className="applications__td" colSpan={7}>
                                            Загрузка…
                                        </td>
                                    </tr>
                                ) : null}
                                {!loadingInitial && list.length === 0 ? (
                                    <tr className="applications__tr applications__tr--data">
                                        <td className="applications__td" colSpan={7}>
                                            Заявок нет
                                        </td>
                                    </tr>
                                ) : null}
                                {list.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="applications__tr applications__tr--data"
                                        onClick={() => openDetailDialog(app)}
                                    >
                                        <td className="applications__td applications__client">
                                            <h3 className="applications__client-title">
                                                {shortClientName(app.full_name)}
                                            </h3>
                                            <span className="applications__client-phone">{app.phone}</span>
                                        </td>

                                        <td className="applications__td applications__date">
                                            {formatDateTimeRu(app.event_date, app.event_time)}
                                        </td>

                                        <td className="applications__td applications__location">
                                            {truncate(app.location, 26)}
                                        </td>

                                        <td className="applications__td applications__cost">
                                            {formatMoneyRub(app.total_price)}
                                        </td>

                                        <td className="applications__td applications__resource">
                                            {SOURCE_LABELS[app.source] ?? app.source}
                                        </td>

                                        <td className="applications__td applications__composition">
                                            {app.composition_summary ?? '—'}
                                        </td>

                                        <td
                                            className="applications__td applications__td--status"
                                            onClick={stopRowClick}
                                            onMouseDown={stopRowClick}
                                        >
                                            <select
                                                className={`applications__input-select applications__input-select--table${statusToneModifier(app.status, 'applications__input-select')}`}
                                                value={app.status}
                                                onClick={stopRowClick}
                                                onMouseDown={stopRowClick}
                                                onChange={(e) =>
                                                    onStatusChange(app.id, e.target.value)
                                                }
                                                aria-label={`Статус заявки ${app.full_name}`}
                                            >
                                                <option value="new">Новый</option>
                                                <option value="inwork">В работе</option>
                                                <option value="closed">Закрыт</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {loadingMore ? (
                                    <tr className="applications__tr applications__tr--data">
                                        <td className="applications__td applications__td--loading-more" colSpan={7}>
                                            Загрузка ещё…
                                        </td>
                                    </tr>
                                ) : null}
                                <tr className="applications__tr applications__sentinel-row" aria-hidden="true">
                                    <td ref={sentinelRef} className="applications__sentinel" colSpan={7} />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <dialog ref={detailDialogRef} className="detail-applications">
                {selected && (
                    <div className="detail-applications__inner">
                        <header className="detail-applications__header">
                            <h3 className="detail-applications__title">Заявка №{selected.id}</h3>

                            <ButtonLink
                                type="button"
                                className="detail-applications__close"
                                onClick={closeDetailDialog}
                            >
                                <img
                                    src={closeButton}
                                    width={24}
                                    height={24}
                                    loading="lazy"
                                    alt="Закрыть"
                                />
                            </ButtonLink>
                        </header>

                        {actionError ? (
                            <p className="detail-applications__error" role="alert">
                                {actionError}
                            </p>
                        ) : null}

                        <div className="detail-applications__body">
                            <div className="detail-applications__customer">
                                <h3 className="detail-applications__customer-title">Заказчик</h3>
                                <ul className="detail-applications__customer-list">
                                    <li className="detail-applications__customer-item">
                                        <span className="detail-applications__customer-label">Имя</span>
                                        <span className="detail-applications__customer-value">
                                            {selected.full_name}
                                        </span>
                                    </li>
                                    <li className="detail-applications__customer-item">
                                        <span className="detail-applications__customer-label">Телефон</span>
                                        <span className="detail-applications__customer-value">
                                            {selected.phone}
                                        </span>
                                    </li>
                                    <li className="detail-applications__customer-item">
                                        <span className="detail-applications__customer-label">
                                            Дата и время
                                        </span>
                                        <span className="detail-applications__customer-value">
                                            {formatDateTimeRu(
                                                selected.event_date,
                                                selected.event_time,
                                            )}
                                        </span>
                                    </li>
                                    <li className="detail-applications__customer-item">
                                        <span className="detail-applications__customer-label">Место</span>
                                        <span className="detail-applications__customer-value">
                                            {selected.location}
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="detail-applications__goods">
                                <h3 className="detail-applications__goods-title">Товары</h3>
                                {goodsForDetail.length === 0 ? (
                                    <p className="detail-applications__goods-empty">Нет позиций</p>
                                ) : (
                                    <ul className="detail-applications__goods-list">
                                        {goodsForDetail.map((item) => (
                                            <li
                                                key={item.label}
                                                className="detail-applications__goods-item"
                                            >
                                                <span className="detail-applications__goods-label">
                                                    {item.label}
                                                </span>
                                                <span className="detail-applications__goods-value">
                                                    {item.value}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="detail-applications__services">
                                <h3 className="detail-applications__services-title">Услуги</h3>
                                <ul className="detail-applications__services-list">
                                    <li className="detail-applications__services-item">
                                        <span className="detail-applications__services-label">Доставка</span>
                                        <span className="detail-applications__services-value">
                                            {ynLabel(selected.delivery)}
                                        </span>
                                    </li>
                                    <li className="detail-applications__services-item">
                                        <span className="detail-applications__services-label">Сборка</span>
                                        <span className="detail-applications__services-value">
                                            {ynLabel(selected.assembly)}
                                        </span>
                                    </li>
                                    <li className="detail-applications__services-item">
                                        <span className="detail-applications__services-label">Источник</span>
                                        <span className="detail-applications__services-value">
                                            {SOURCE_LABELS[selected.source] ?? selected.source}
                                        </span>
                                    </li>
                                    <li className="detail-applications__services-item">
                                        <span className="detail-applications__services-label">Статус</span>
                                        <select
                                            className={`detail-applications__input-select detail-applications__input-select--table${statusToneModifier(selected.status, 'detail-applications__input-select')}`}
                                            value={selected.status}
                                            onChange={(e) =>
                                                onStatusChange(selected.id, e.target.value)
                                            }
                                        >
                                            <option value="new">Новый</option>
                                            <option value="inwork">В работе</option>
                                            <option value="closed">Закрыт</option>
                                        </select>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <footer className="detail-applications__footer">
                            <div className="detail-applications__price-wrapper">
                                <span className="detail-applications__price-label">Стоимость</span>
                                {editingPrice ? (
                                    <div className="detail-applications__price-edit">
                                        <input
                                            type="number"
                                            className="detail-applications__price-input"
                                            value={priceInput}
                                            onChange={(e) => setPriceInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') savePriceEdit();
                                                if (e.key === 'Escape') cancelPriceEdit();
                                            }}
                                            min="0"
                                            autoFocus
                                            disabled={priceSaving}
                                        />
                                        <span className="detail-applications__price-currency">₽</span>
                                        <button
                                            type="button"
                                            className="detail-applications__price-save"
                                            onClick={savePriceEdit}
                                            disabled={priceSaving}
                                            aria-label="Сохранить цену"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            type="button"
                                            className="detail-applications__price-cancel"
                                            onClick={cancelPriceEdit}
                                            disabled={priceSaving}
                                            aria-label="Отменить"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <div className="detail-applications__price-display">
                                        <h2 className="detail-applications__price">
                                            {formatMoneyRub(selected.total_price)}
                                        </h2>
                                        <button
                                            type="button"
                                            className="detail-applications__price-edit-btn"
                                            onClick={startPriceEdit}
                                            aria-label="Изменить цену"
                                        >
                                            <img
                                                src={editIcon}
                                                width={16}
                                                height={16}
                                                loading="lazy"
                                                alt="Изменить цену"
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="detail-applications__footer-buttons">
                                <ButtonLink
                                    type="button"
                                    className="detail-applications__footer-edit detail-applications__footer-button"
                                    onClick={startEdit}
                                    disabled={saving}
                                >
                                    <img
                                        src={editIcon}
                                        width={20}
                                        height={20}
                                        loading="lazy"
                                        alt="Изменить"
                                        className="detail-applications__footer-button-icon"
                                    />
                                </ButtonLink>

                                <ButtonLink
                                    type="button"
                                    className="detail-applications__footer-edit detail-applications__footer-button"
                                    onClick={onDelete}
                                    disabled={saving}
                                >
                                    <img
                                        src={deleteIcon}
                                        width={20}
                                        height={20}
                                        loading="lazy"
                                        alt="Удалить"
                                        className="detail-applications__footer-button-icon"
                                    />
                                </ButtonLink>
                            </div>
                        </footer>
                    </div>
                )}
            </dialog>

            <dialog
                ref={editDialogRef}
                className="new-applications"
                onClose={() => {
                    setEditApp(null);
                    setEditError('');
                }}
            >
                {editApp ? (
                    <div className="new-applications__inner">
                        <header className="new-applications__header">
                            <h3 className="new-applications__title">
                                Изменить заявку №{editApp.id}
                            </h3>
                            <ButtonLink
                                type="button"
                                className="new-applications__close"
                                onClick={closeEditDialog}
                            >
                                <img
                                    src={closeButton}
                                    width={24}
                                    height={24}
                                    loading="lazy"
                                    alt="Закрыть"
                                />
                            </ButtonLink>
                        </header>
                        <form
                            className="new-applications__form"
                            onSubmit={handleEditSubmit}
                            noValidate
                        >
                            <div key={editFormKey} className="new-applications__fields">
                                <AdminApplicationFormBody
                                    idPrefix={`edit-app-${editApp.id}`}
                                    disabled={editSaving}
                                    defaults={editApp}
                                    showAdminMeta
                                />
                            </div>

                            {editError ? (
                                <p className="new-applications__error" role="alert">
                                    {editError}
                                </p>
                            ) : null}

                            <ButtonLink
                                type="submit"
                                className="button__main new-applications__form-button"
                                disabled={editSaving}
                            >
                                Сохранить изменения
                            </ButtonLink>
                        </form>
                    </div>
                ) : null}
            </dialog>

            <dialog
                ref={confirmDialogRef}
                className="confirm-dialog"
                onClose={() => closeConfirm(false)}
            >
                <div className="confirm-dialog__inner">
                    <h3 className="confirm-dialog__title">Удаление заявки</h3>
                    <p className="confirm-dialog__text">
                        Вы уверены, что хотите удалить заявку{selected ? ` №${selected.id}` : ''}? Это действие необратимо.
                    </p>
                    <div className="confirm-dialog__buttons">
                        <button
                            type="button"
                            className="confirm-dialog__btn"
                            onClick={() => closeConfirm(false)}
                        >
                            Отмена
                        </button>
                        <button
                            type="button"
                            className="confirm-dialog__btn confirm-dialog__btn--danger"
                            onClick={() => closeConfirm(true)}
                        >
                            Удалить
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
