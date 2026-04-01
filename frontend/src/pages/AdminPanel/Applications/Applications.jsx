import Sidebar from "../../../components/AdminPanel/Sidebar/Sidebar.jsx";

export default function Applications() {
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
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>
                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>
                            <tr className="applications__tr">
                                <td className="applications__td applications__client">
                                    <h3 className="applications__client-title">Мария С.</h3>
                                    <span className="applications__client-phone">+7 (953) 436 32 54</span>
                                </td>

                                <td className="applications__td applications__date">
                                    12 июл 2026, 15:00
                                </td>

                                <td className="applications__td applications__location">
                                    Парк Горького, луж...
                                </td>

                                <td className="applications__td applications__cost">
                                    4100₽
                                </td>

                                <td className="applications__td applications__resource">
                                    Вручную
                                </td>

                                <td className="applications__td applications__composition">
                                    1 - 3х6, 3 - 3x3, 1 -
                                </td>

                                <td>
                                    <select className="applications__input-select applications__input-select--table">
                                        <option value="new">Новый</option>
                                        <option value="inwork">В работе</option>
                                        <option value="closed">Закрыт</option>
                                    </select>
                                </td>

                            </tr>

                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </>
    )
}