import { useRef, useState } from "react";
import Sidebar from "../../../components/AdminPanel/Sidebar/Sidebar.jsx";
import closeButton from "../../../assets/images/admin-panel/sidebar/x.svg";
import ButtonLink from "../../../components/Button/ButtonLink.jsx";
import editIcon from "../../../assets/images/admin-panel/applications/edit.svg";
import deleteIcon from "../../../assets/images/admin-panel/applications/delete.svg";

const APPLICATION_DETAIL_GOODS = [
    { label: "Шатёр 3×6 м", value: "1 шт × 2 000 ₽ = 2.000 ₽" },
    { label: "Шатёр 3×3 м", value: "0 шт × 1.500 ₽ = 0 ₽" },
    { label: "Мебель", value: "1 компл. × 500 ₽ = 500 ₽" },
    { label: "Стулья", value: "6 шт × 200 ₽ = 1.200 ₽" },
    { label: "Лампочки", value: "4 шт × 100 ₽ = 400 ₽" },
];

const DEFAULT_APPLICATION = {
    clientPhone: "+7 (953) 436 32 54",
    date: "12 июл 2026, 15:00",
    locationShort: "Парк Горького, луж...",
    locationFull: "Парк Горького, лужайка у пруда",
    cost: "4100₽",
    resource: "Вручную",
    composition: "1 - 3х6, 3 - 3x3, 1 -",
    status: "new",
    fullName: "Мария Сергеевна",
    phoneDetail: "+7 (953)-542-24 43",
    dateDetail: "12 июл 2026, 15:00",
    goods: APPLICATION_DETAIL_GOODS,
    delivery: "Да",
    assembly: "Да",
    source: "Авито",
    totalPrice: "4100₽",
};

const ROW_PRESETS = [
    { clientName: "Мария С." },
    {
        clientName: "Алексей П.",
        fullName: "Алексей Петрович",
        clientPhone: "+7 (916) 112 44 09",
        phoneDetail: "+7 (916) 112-44-09",
        status: "inwork",
        source: "Сайт",
    },
    {
        clientName: "Елена К.",
        fullName: "Елена Константиновна",
        clientPhone: "+7 (903) 221 88 11",
        phoneDetail: "+7 (903) 221-88-11",
        status: "closed",
        source: "Телеграм",
    },
    { clientName: "Иван Д." },
    { clientName: "Ольга М." },
    { clientName: "Сергей В." },
    { clientName: "Анна Л." },
    { clientName: "Пётр Н." },
    { clientName: "Татьяна Р." },
    { clientName: "Мария С." },
];

const APPLICATIONS_DATA = ROW_PRESETS.map((preset, i) => ({
    id: String(i + 1),
    ...DEFAULT_APPLICATION,
    ...preset,
}));

export default function Applications() {
    const detailDialogRef = useRef(null);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const openDetailDialog = (app) => {
        setSelectedApplication(app);
        setTimeout(() => {
            detailDialogRef.current?.showModal();
        }, 0);
    };

    const closeDetailDialog = () => {
        detailDialogRef.current?.close();
        setSelectedApplication(null);
    };

    const stopRowClick = (event) => {
        event.stopPropagation();
    };

    return (
        <>
            <Sidebar />
            <div className="applications">
                <div className="applications__inner">
                    <header className="applications__header">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className="applications__input-search"
                        />
                        <select className="applications__input-select">
                            <option value="all">Все статусы</option>
                            <option value="new">Новый</option>
                            <option value="inwork">В работе</option>
                            <option value="closed">Закрыт</option>
                        </select>
                    </header>

                    <div
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
                                    <th className="applications__th">Откуда</th>
                                    <th className="applications__th">Состав</th>
                                    <th className="applications__th">Статус</th>
                                </tr>
                            </thead>

                            <tbody className="applications__tbody">
                                {APPLICATIONS_DATA.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="applications__tr applications__tr--data"
                                        onClick={() => openDetailDialog(app)}
                                    >
                                        <td className="applications__td applications__client">
                                            <h3 className="applications__client-title">{app.clientName}</h3>
                                            <span className="applications__client-phone">{app.clientPhone}</span>
                                        </td>

                                        <td className="applications__td applications__date">{app.date}</td>

                                        <td className="applications__td applications__location">{app.locationShort}</td>

                                        <td className="applications__td applications__cost">{app.cost}</td>

                                        <td className="applications__td applications__resource">{app.resource}</td>

                                        <td className="applications__td applications__composition">{app.composition}</td>

                                        <td
                                            className="applications__td applications__td--status"
                                            onClick={stopRowClick}
                                            onMouseDown={stopRowClick}
                                        >
                                            <select
                                                className="applications__input-select applications__input-select--table"
                                                defaultValue={app.status}
                                                onClick={stopRowClick}
                                                onMouseDown={stopRowClick}
                                                aria-label={`Статус заявки ${app.clientName}`}
                                            >
                                                <option value="new">Новый</option>
                                                <option value="inwork">В работе</option>
                                                <option value="closed">Закрыт</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <dialog
                ref={detailDialogRef}
                className="detail-applications"
            >
                {selectedApplication && (
                    <div className="detail-applications__inner">
                        <header className="detail-applications__header">
                            <h3 className="detail-applications__title">
                                Заявка №{selectedApplication.id}
                            </h3>

                            <ButtonLink
                                type="button"
                                className="detail-applications__close"
                                onClick={closeDetailDialog}
                            >
                                <img src={closeButton} width={24} height={24} loading="lazy" alt="Закрыть" />
                            </ButtonLink>
                        </header>

                        <div className="detail-applications__body">
                            <div className="detail-applications__customer">
                                <h3 className="detail-applications__customer-title">Заказчик</h3>
                                <ul className="detail-applications__customer-list">
                                    <li className="detail-applications__customer-item">
                                        <span className="detail-applications__customer-label">Имя</span>
                                        <span className="detail-applications__customer-value">
                                            {selectedApplication.fullName}
                                        </span>
                                    </li>

                                    <li className="detail-applications__customer-item">
                                        <span className="detail-applications__customer-label">Телефон</span>
                                        <span className="detail-applications__customer-value">
                                            {selectedApplication.phoneDetail}
                                        </span>
                                    </li>

                                    <li className="detail-applications__customer-item">
                                        <span className="detail-applications__customer-label">Дата и время</span>
                                        <span className="detail-applications__customer-value">
                                            {selectedApplication.dateDetail}
                                        </span>
                                    </li>

                                    <li className="detail-applications__customer-item">
                                        <span className="detail-applications__customer-label">Место</span>
                                        <span className="detail-applications__customer-value">
                                            {selectedApplication.locationFull}
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="detail-applications__goods">
                                <h3 className="detail-applications__goods-title">Товары</h3>
                                <ul className="detail-applications__goods-list">
                                    {selectedApplication.goods.map((item) => (
                                        <li key={item.label} className="detail-applications__goods-item">
                                            <span className="detail-applications__goods-label">{item.label}</span>
                                            <span className="detail-applications__goods-value">{item.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="detail-applications__services">
                                <h3 className="detail-applications__services-title">Услуги</h3>
                                <ul className="detail-applications__services-list">
                                    <li className="detail-applications__services-item">
                                        <span className="detail-applications__services-label">Доставка</span>
                                        <span className="detail-applications__services-value">
                                            {selectedApplication.delivery}
                                        </span>
                                    </li>

                                    <li className="detail-applications__services-item">
                                        <span className="detail-applications__services-label">Сборка</span>
                                        <span className="detail-applications__services-value">
                                            {selectedApplication.assembly}
                                        </span>
                                    </li>

                                    <li className="detail-applications__services-item">
                                        <span className="detail-applications__services-label">Источник</span>
                                        <span className="detail-applications__services-value">
                                            {selectedApplication.source}
                                        </span>
                                    </li>

                                    <li className="detail-applications__services-item">
                                        <span className="detail-applications__services-label">Статус</span>
                                        <select
                                            key={selectedApplication.id}
                                            className="detail-applications__input-select detail-applications__input-select--table"
                                            defaultValue={selectedApplication.status}
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
                                <h2 className="detail-applications__price">{selectedApplication.totalPrice}</h2>
                            </div>

                            <div className="detail-applications__footer-buttons">
                                <ButtonLink
                                    type="button"
                                    className="detail-applications__footer-edit detail-applications__footer-button"
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
        </>
    );
}
