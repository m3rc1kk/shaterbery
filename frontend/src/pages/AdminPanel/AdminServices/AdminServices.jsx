import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/AdminPanel/Sidebar/Sidebar.jsx';
import ButtonLink from '../../../components/Button/ButtonLink.jsx';
import closeButton from '../../../assets/images/admin-panel/sidebar/x.svg';
import editIcon from '../../../assets/images/admin-panel/applications/edit.svg';
import deleteIcon from '../../../assets/images/admin-panel/applications/delete.svg';
import Input from '../../../components/Input/Input.jsx';
import { fetchServices, createService, updateService, deleteService } from '../../../api/services.js';
import { ApiError } from '../../../api/http.js';
import { API_BASE } from '../../../api/config.js';

function resolveImage(img) {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${API_BASE}/${img.replace(/^\//, '')}`;
}

function formatPriceDisplay(val) {
    const n = Number(val) || 0;
    return n.toLocaleString('ru-RU');
}


export default function AdminServices() {
    const navigate = useNavigate();
    const createDialogRef = useRef(null);
    const editDialogRef = useRef(null);
    const confirmDialogRef = useRef(null);
    const confirmResolveRef = useRef(null);

    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listError, setListError] = useState('');

    const [createError, setCreateError] = useState('');
    const [createPending, setCreatePending] = useState(false);
    const [createKey, setCreateKey] = useState(0);

    const [editItem, setEditItem] = useState(null);
    const [editError, setEditError] = useState('');
    const [editPending, setEditPending] = useState(false);
    const [editKey, setEditKey] = useState(0);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const loadList = useCallback(async () => {
        setListError('');
        setLoading(true);
        try {
            const data = await fetchServices();
            setList(data);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                navigate('/admin/sign-in', { replace: true });
                return;
            }
            setListError(err instanceof ApiError ? err.message : 'Не удалось загрузить товары');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { loadList(); }, [loadList]);

    const openCreate = () => {
        setCreateError('');
        setCreateKey((k) => k + 1);
        createDialogRef.current?.showModal();
    };

    const closeCreate = () => {
        createDialogRef.current?.close();
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const checkbox = form.querySelector('#svc-create-discount');
        fd.set('half_price_next_days', checkbox?.checked ? 'true' : 'false');
        setCreateError('');
        setCreatePending(true);
        try {
            await createService(fd);
            closeCreate();
            loadList();
        } catch (err) {
            setCreateError(err instanceof ApiError ? err.message : 'Не удалось создать товар');
        } finally {
            setCreatePending(false);
        }
    };

    const openEdit = (item) => {
        setEditItem(item);
        setEditError('');
        setEditKey((k) => k + 1);
        setTimeout(() => editDialogRef.current?.showModal(), 0);
    };

    const closeEdit = () => {
        editDialogRef.current?.close();
        setEditItem(null);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editItem) return;
        const form = e.currentTarget;
        const fd = new FormData(form);
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length === 0) {
            fd.delete('image');
        }
        const checkbox = form.querySelector('#svc-edit-discount');
        fd.set('half_price_next_days', checkbox?.checked ? 'true' : 'false');
        setEditError('');
        setEditPending(true);
        try {
            await updateService(editItem.id, fd);
            closeEdit();
            loadList();
        } catch (err) {
            setEditError(err instanceof ApiError ? err.message : 'Не удалось сохранить');
        } finally {
            setEditPending(false);
        }
    };

    function showConfirm(item) {
        setDeleteTarget(item);
        return new Promise((resolve) => {
            confirmResolveRef.current = resolve;
            confirmDialogRef.current?.showModal();
        });
    }

    const closeConfirm = (result) => {
        confirmDialogRef.current?.close();
        confirmResolveRef.current?.(result);
        confirmResolveRef.current = null;
        setDeleteTarget(null);
    };

    const onDelete = async (item) => {
        const confirmed = await showConfirm(item);
        if (!confirmed) return;
        try {
            await deleteService(item.id);
            loadList();
        } catch (err) {
            setListError(err instanceof ApiError ? err.message : 'Не удалось удалить');
        }
    };

    return (
        <>
            <Sidebar />
            <div className="admin-services">
                <div className="admin-services__inner">
                    <div className="admin-services__header">
                        <button
                            type="button"
                            className="admin-services__add-btn"
                            onClick={openCreate}
                        >
                            + Добавить товар
                        </button>
                    </div>

                    {listError ? (
                        <p className="admin-services__error" role="alert">{listError}</p>
                    ) : null}

                    {loading ? (
                        <p className="admin-services__loading">Загрузка…</p>
                    ) : list.length === 0 ? (
                        <p className="admin-services__empty">Товаров пока нет</p>
                    ) : (
                        <div className="admin-services__grid">
                            {list.map((item) => (
                                <div key={item.id} className="admin-services__card">
                                    {item.image ? (
                                        <img
                                            src={resolveImage(item.image)}
                                            alt={item.title}
                                            className="admin-services__card-image"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="admin-services__card-image admin-services__card-image--empty" />
                                    )}
                                    <div className="admin-services__card-body">
                                        <h3 className="admin-services__card-title">{item.title}</h3>
                                        <p className="admin-services__card-desc">{item.description}</p>
                                        <span className="admin-services__card-price">
                                            {formatPriceDisplay(item.price_value)}₽
                                            <span className="admin-services__card-price-unit">
                                                /сутки
                                            </span>
                                        </span>
                                        {item.assembly_price > 0 ? (
                                            <span className="admin-services__card-assembly">
                                                Сборка: {formatPriceDisplay(item.assembly_price)}₽
                                            </span>
                                        ) : null}
                                        {item.half_price_next_days ? (
                                            <span className="admin-services__card-discount">
                                                Скидка 50% на след. сутки
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="admin-services__card-actions">
                                        <button
                                            type="button"
                                            className="admin-services__card-btn"
                                            onClick={() => openEdit(item)}
                                            aria-label="Изменить"
                                        >
                                            <img src={editIcon} width={16} height={16} alt="" />
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-services__card-btn admin-services__card-btn--danger"
                                            onClick={() => onDelete(item)}
                                            aria-label="Удалить"
                                        >
                                            <img src={deleteIcon} width={16} height={16} alt="" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <dialog ref={createDialogRef} className="new-applications">
                <div className="new-applications__inner">
                    <header className="new-applications__header">
                        <h3 className="new-applications__title">Добавить товар</h3>
                        <ButtonLink type="button" className="new-applications__close" onClick={closeCreate}>
                            <img src={closeButton} width={24} height={24} loading="lazy" alt="Закрыть" />
                        </ButtonLink>
                    </header>
                    <form key={createKey} className="new-applications__form" onSubmit={handleCreate} noValidate>
                        <Input id="svc-create-title" name="title" label="Название" placeholder="Шатёр 3×6" required disabled={createPending} />
                        <div className="field">
                            <label htmlFor="svc-create-desc" className="field__label">Описание</label>
                            <textarea
                                id="svc-create-desc"
                                name="description"
                                className="field__input field__textarea"
                                rows={3}
                                disabled={createPending}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="svc-create-image" className="field__label">Картинка</label>
                            <input
                                type="file"
                                id="svc-create-image"
                                name="image"
                                accept="image/*"
                                className="field__input"
                                disabled={createPending}
                            />
                        </div>
                        <Input id="svc-create-price" name="price_value" label="Цена (в сутки)" type="number" placeholder="3000" required disabled={createPending} />
                        <input type="hidden" name="price_unit" value="day" />
                        <div className="new-applications__form-contact">
                            <Input id="svc-create-assembly" name="assembly_price" label="Цена сборки" type="number" placeholder="0" className="field__input--half" disabled={createPending} defaultValue="0" />
                            <Input id="svc-create-sort" name="sort_order" label="Порядок" type="number" placeholder="0" className="field__input--half" disabled={createPending} defaultValue="0" />
                        </div>

                        <label className="admin-services__checkbox-field">
                            <input
                                type="checkbox"
                                id="svc-create-discount"
                                className="admin-services__checkbox-input"
                                disabled={createPending}
                            />
                            <span className="admin-services__checkbox-label">Скидка 50% на каждые следующие сутки</span>
                        </label>

                        {createError ? (
                            <p className="new-applications__error" role="alert">{createError}</p>
                        ) : null}

                        <ButtonLink type="submit" className="button__main new-applications__form-button" disabled={createPending}>
                            Добавить
                        </ButtonLink>
                    </form>
                </div>
            </dialog>

            <dialog ref={editDialogRef} className="new-applications" onClose={() => { setEditItem(null); setEditError(''); }}>
                {editItem ? (
                    <div className="new-applications__inner">
                        <header className="new-applications__header">
                            <h3 className="new-applications__title">Изменить товар</h3>
                            <ButtonLink type="button" className="new-applications__close" onClick={closeEdit}>
                                <img src={closeButton} width={24} height={24} loading="lazy" alt="Закрыть" />
                            </ButtonLink>
                        </header>
                        <form key={editKey} className="new-applications__form" onSubmit={handleEdit} noValidate>
                            <Input id="svc-edit-title" name="title" label="Название" defaultValue={editItem.title} required disabled={editPending} />
                            <div className="field">
                                <label htmlFor="svc-edit-desc" className="field__label">Описание</label>
                                <textarea
                                    id="svc-edit-desc"
                                    name="description"
                                    className="field__input field__textarea"
                                    rows={3}
                                    defaultValue={editItem.description}
                                    disabled={editPending}
                                />
                            </div>
                            <div className="field">
                                <label className="field__label">Текущая картинка</label>
                                {editItem.image ? (
                                    <img
                                        src={resolveImage(editItem.image)}
                                        alt=""
                                        className="admin-services__edit-preview"
                                    />
                                ) : (
                                    <span className="admin-services__no-image">Нет</span>
                                )}
                            </div>
                            <div className="field">
                                <label htmlFor="svc-edit-image" className="field__label">Заменить картинку</label>
                                <input type="file" id="svc-edit-image" name="image" accept="image/*" className="field__input" disabled={editPending} />
                            </div>
                            <Input id="svc-edit-price" name="price_value" label="Цена (в сутки)" type="number" defaultValue={editItem.price_value} required disabled={editPending} />
                            <input type="hidden" name="price_unit" value="day" />
                            <div className="new-applications__form-contact">
                                <Input id="svc-edit-assembly" name="assembly_price" label="Цена сборки" type="number" defaultValue={editItem.assembly_price} className="field__input--half" disabled={editPending} />
                                <Input id="svc-edit-sort" name="sort_order" label="Порядок" type="number" defaultValue={editItem.sort_order} className="field__input--half" disabled={editPending} />
                            </div>

                            <label className="admin-services__checkbox-field">
                                <input
                                    type="checkbox"
                                    id="svc-edit-discount"
                                    className="admin-services__checkbox-input"
                                    defaultChecked={editItem.half_price_next_days}
                                    disabled={editPending}
                                />
                                <span className="admin-services__checkbox-label">Скидка 50% на каждые следующие сутки</span>
                            </label>

                            {editError ? (
                                <p className="new-applications__error" role="alert">{editError}</p>
                            ) : null}

                            <ButtonLink type="submit" className="button__main new-applications__form-button" disabled={editPending}>
                                Сохранить изменения
                            </ButtonLink>
                        </form>
                    </div>
                ) : null}
            </dialog>

            <dialog ref={confirmDialogRef} className="confirm-dialog" onClose={() => closeConfirm(false)}>
                <div className="confirm-dialog__inner">
                    <h3 className="confirm-dialog__title">Удаление товара</h3>
                    <p className="confirm-dialog__text">
                        Вы уверены, что хотите удалить{deleteTarget ? ` «${deleteTarget.title}»` : ''}? Это действие необратимо.
                    </p>
                    <div className="confirm-dialog__buttons">
                        <button type="button" className="confirm-dialog__btn" onClick={() => closeConfirm(false)}>Отмена</button>
                        <button type="button" className="confirm-dialog__btn confirm-dialog__btn--danger" onClick={() => closeConfirm(true)}>Удалить</button>
                    </div>
                </div>
            </dialog>
        </>
    );
}