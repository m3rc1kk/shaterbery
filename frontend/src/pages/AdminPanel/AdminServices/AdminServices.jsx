import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/AdminPanel/Sidebar/Sidebar.jsx';
import ButtonLink from '../../../components/Button/ButtonLink.jsx';
import closeButton from '../../../assets/images/admin-panel/sidebar/x.svg';
import editIcon from '../../../assets/images/admin-panel/applications/edit.svg';
import deleteIcon from '../../../assets/images/admin-panel/applications/delete.svg';
import Input from '../../../components/Input/Input.jsx';
import { fetchServices, createService, updateService, deleteService } from '../../../api/services.js';
import { fetchCities, createCity, deleteCity } from '../../../api/cities.js';
import { ApiError } from '../../../api/http.js';
import { API_BASE } from '../../../api/config.js';

const TRANSLIT = {
    а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',
    к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
    х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
};

function toSlug(name) {
    return name
        .toLowerCase()
        .split('')
        .map((c) => TRANSLIT[c] ?? (/[a-z0-9]/.test(c) ? c : '-'))
        .join('')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

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
    const confirmCityDialogRef = useRef(null);
    const confirmCityResolveRef = useRef(null);
    const addCityDialogRef = useRef(null);

    // Cities
    const [cities, setCities] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState(null);
    const [citiesLoading, setCitiesLoading] = useState(true);
    const [addCityError, setAddCityError] = useState('');
    const [addCityPending, setAddCityPending] = useState(false);

    // Services
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listError, setListError] = useState('');

    const [createError, setCreateError] = useState('');
    const [createPending, setCreatePending] = useState(false);
    const [createKey, setCreateKey] = useState(0);

    const [editItem, setEditItem] = useState(null);
    const [editError, setEditError] = useState('');
    const [editPending, setEditPending] = useState(false);
    const [editKey, setEditKey] = useState(0);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteCityTarget, setDeleteCityTarget] = useState(null);

    const loadCities = useCallback(async () => {
        setCitiesLoading(true);
        try {
            const data = await fetchCities();
            setCities(data);
            if (data.length > 0) {
                setSelectedCityId((prev) => prev ?? data[0].id);
            }
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                navigate('/admin/sign-in', { replace: true });
            }
        } finally {
            setCitiesLoading(false);
        }
    }, [navigate]);

    useEffect(() => { loadCities(); }, [loadCities]);

    const selectedCity = cities.find((c) => c.id === selectedCityId) ?? null;

    const loadList = useCallback(async () => {
        if (!selectedCity) return;
        setListError('');
        setLoading(true);
        try {
            const data = await fetchServices(selectedCity.slug);
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
    }, [navigate, selectedCity]);

    useEffect(() => { loadList(); }, [loadList]);

    // --- City management ---
    const openAddCity = () => {
        setAddCityError('');
        addCityDialogRef.current?.showModal();
    };

    const closeAddCity = () => {
        addCityDialogRef.current?.close();
    };

    const handleAddCity = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const name = fd.get('name')?.toString().trim();
        const region_label = fd.get('region_label')?.toString().trim();
        const slug = toSlug(name ?? '');
        if (!name) {
            setAddCityError('Укажите название города');
            return;
        }
        setAddCityError('');
        setAddCityPending(true);
        try {
            const created = await createCity({ name, slug, region_label });
            closeAddCity();
            form.reset();
            await loadCities();
            setSelectedCityId(created.id);
        } catch (err) {
            setAddCityError(err instanceof ApiError ? err.message : 'Не удалось создать город');
        } finally {
            setAddCityPending(false);
        }
    };

    function showConfirmCity(city) {
        setDeleteCityTarget(city);
        return new Promise((resolve) => {
            confirmCityResolveRef.current = resolve;
            confirmCityDialogRef.current?.showModal();
        });
    }

    const closeConfirmCity = (result) => {
        confirmCityDialogRef.current?.close();
        confirmCityResolveRef.current?.(result);
        confirmCityResolveRef.current = null;
        setDeleteCityTarget(null);
    };

    const handleDeleteCity = async (city) => {
        const confirmed = await showConfirmCity(city);
        if (!confirmed) return;
        try {
            await deleteCity(city.id);
            await loadCities();
            setSelectedCityId(null);
        } catch (err) {
            setListError(err instanceof ApiError ? err.message : 'Не удалось удалить город');
        }
    };

    // --- Service CRUD ---
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
        if (selectedCity) fd.set('city', selectedCity.id);
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

                    {/* City tabs */}
                    <div className="admin-services__cities">
                        {citiesLoading ? (
                            <span className="admin-services__loading">Загрузка городов…</span>
                        ) : (
                            <>
                                <div className="admin-services__city-tabs">
                                    {cities.map((city) => (
                                        <div key={city.id} className="admin-services__city-tab-wrap">
                                            <button
                                                type="button"
                                                className={`admin-services__city-tab${city.id === selectedCityId ? ' admin-services__city-tab--active' : ''}`}
                                                onClick={() => setSelectedCityId(city.id)}
                                            >
                                                {city.name}
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-services__city-tab-delete"
                                                onClick={() => handleDeleteCity(city)}
                                                aria-label={`Удалить город ${city.name}`}
                                                title="Удалить город"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="admin-services__city-add"
                                        onClick={openAddCity}
                                    >
                                        + Город
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="admin-services__header">
                        <button
                            type="button"
                            className="admin-services__add-btn"
                            onClick={openCreate}
                            disabled={!selectedCity}
                        >
                            + Добавить товар
                        </button>
                        {selectedCity && (
                            <span className="admin-services__city-hint">
                                Город: <strong>{selectedCity.name}</strong>
                                {selectedCity.region_label ? ` (${selectedCity.region_label})` : ''}
                            </span>
                        )}
                    </div>

                    {listError ? (
                        <p className="admin-services__error" role="alert">{listError}</p>
                    ) : null}

                    {!selectedCity && !citiesLoading ? (
                        <p className="admin-services__empty">Добавьте город, чтобы начать добавлять товары</p>
                    ) : loading ? (
                        <p className="admin-services__loading">Загрузка…</p>
                    ) : list.length === 0 ? (
                        <p className="admin-services__empty">Товаров для этого города пока нет</p>
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
                                        <p className={`admin-services__card-desc${!item.description ? ' admin-services__card-desc--empty' : ''}`}>
                                            {item.description || 'Нет описания'}
                                        </p>
                                        <span className="admin-services__card-price">
                                            {formatPriceDisplay(item.price_value)}₽
                                            <span className="admin-services__card-price-unit">
                                                /{item.price_unit === 'day' ? 'сутки' : 'шт'}
                                            </span>
                                        </span>
                                        <span className={`admin-services__card-assembly${!item.assembly_price ? ' admin-services__card-assembly--zero' : ''}`}>
                                            Сборка: {formatPriceDisplay(item.assembly_price)}₽
                                        </span>
                                        <span className={`admin-services__card-discount${!item.half_price_next_days ? ' admin-services__card-discount--none' : ''}`}>
                                            {item.half_price_next_days ? 'Скидка 50% на след. сутки' : 'Без скидки на след. сутки'}
                                        </span>
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

            {/* Add city dialog */}
            <dialog ref={addCityDialogRef} className="new-applications new-applications--compact">
                <div className="new-applications__inner">
                    <header className="new-applications__header">
                        <h3 className="new-applications__title">Добавить город</h3>
                        <ButtonLink type="button" className="new-applications__close" onClick={closeAddCity}>
                            <img src={closeButton} width={24} height={24} loading="lazy" alt="Закрыть" />
                        </ButtonLink>
                    </header>
                    <form className="new-applications__form" onSubmit={handleAddCity} noValidate>
                        <Input id="city-name" name="name" label="Название" placeholder="Орёл" required disabled={addCityPending} />
                        <Input id="city-region" name="region_label" label="Регион / подпись" placeholder="Орловская область" disabled={addCityPending} />
                        {addCityError ? (
                            <p className="new-applications__error" role="alert">{addCityError}</p>
                        ) : null}
                        <ButtonLink type="submit" className="button__main new-applications__form-button" disabled={addCityPending}>
                            Добавить
                        </ButtonLink>
                    </form>
                </div>
            </dialog>

            {/* Create service dialog */}
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

            {/* Edit service dialog */}
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

            {/* Confirm delete service dialog */}
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

            {/* Confirm delete city dialog */}
            <dialog ref={confirmCityDialogRef} className="confirm-dialog" onClose={() => closeConfirmCity(false)}>
                <div className="confirm-dialog__inner">
                    <h3 className="confirm-dialog__title">Удаление города</h3>
                    <p className="confirm-dialog__text">
                        Вы уверены, что хотите удалить город{deleteCityTarget ? ` «${deleteCityTarget.name}»` : ''}? Все товары этого города останутся без города.
                    </p>
                    <div className="confirm-dialog__buttons">
                        <button type="button" className="confirm-dialog__btn" onClick={() => closeConfirmCity(false)}>Отмена</button>
                        <button type="button" className="confirm-dialog__btn confirm-dialog__btn--danger" onClick={() => closeConfirmCity(true)}>Удалить</button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
