import { useEffect, useState } from "react";
import Sidebar from "../../../components/AdminPanel/Sidebar/Sidebar.jsx";
import { fetchCities } from "../../../api/cities.js";
import DashboardCard from "../../../components/AdminPanel/DashboardCard/DashboardCard.jsx";
import Graph from "../../../components/AdminPanel/Graph/Graph.jsx";
import PopularGraph from "../../../components/AdminPanel/PopularGraph/PopularGraph.jsx";
import moneyIcon from '../../../assets/images/admin-panel/dashboard/Card/money.svg'
import chevronDownIcon from '../../../assets/images/admin-panel/dashboard/Card/chevrons-down.svg'
import chevronUpIcon from '../../../assets/images/admin-panel/dashboard/Card/chevrons-up.svg'
import applicationIcon from '../../../assets/images/admin-panel/dashboard/Card/applications.svg'
import applicationInDelayIcon from '../../../assets/images/admin-panel/dashboard/Card/application-in-delay.svg'
import money2Icon from '../../../assets/images/admin-panel/dashboard/Card/money2.svg'
import bookmarkIcon from '../../../assets/images/admin-panel/dashboard/Card/bookmark.svg'
import {
    fetchDashboardCards,
    fetchDashboardGraphs,
    fetchDashboardPopular,
    fetchDashboardRecent,
    fetchDashboardVisitors,
} from "../../../api/dashboard.js";

const STATUS_LABELS = {
    new: 'Новый',
    inwork: 'В работе',
    closed: 'Закрыт',
}

export default function Dashboard() {
    const [cards, setCards] = useState(null);
    const [graphs, setGraphs] = useState(null);
    const [popular, setPopular] = useState(null);
    const [recent, setRecent] = useState(null);
    const [visitors, setVisitors] = useState(null);
    const [cities, setCities] = useState([]);
    const [cityFilter, setCityFilter] = useState('all');

    useEffect(() => {
        fetchCities().then(setCities).catch(() => {});
        fetchDashboardVisitors().then(setVisitors).catch(() => {});
    }, []);

    useEffect(() => {
        setCards(null);
        setGraphs(null);
        setPopular(null);
        setRecent(null);
        fetchDashboardCards(cityFilter).then(setCards).catch(() => {});
        fetchDashboardGraphs(cityFilter).then(setGraphs).catch(() => {});
        fetchDashboardPopular(cityFilter).then(setPopular).catch(() => {});
        fetchDashboardRecent(cityFilter).then(setRecent).catch(() => {});
    }, [cityFilter]);

    const revenue = cards?.revenue;
    const appCount = cards?.applications_count;
    const avgCheck = cards?.average_check;
    const pending = cards?.pending;

    return (
        <>
            <Sidebar />
            <div className="dashboard">
                <div className="dashboard__inner">
                    {cities.length > 0 && (
                        <div className="dashboard__city-filter">
                            <button
                                type="button"
                                className={`dashboard__city-btn${cityFilter === 'all' ? ' dashboard__city-btn--active' : ''}`}
                                onClick={() => setCityFilter('all')}
                            >
                                Все
                            </button>
                            {cities.map((c) => (
                                <button
                                    key={c.slug}
                                    type="button"
                                    className={`dashboard__city-btn${cityFilter === c.slug ? ' dashboard__city-btn--active' : ''}`}
                                    onClick={() => setCityFilter(c.slug)}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    )}
                    <ul className="dashboard__card-list">
                        <li className="dashboard__card-item">
                            <DashboardCard
                                title={revenue?.title ?? 'Прибыль за месяц'}
                                value={revenue?.value ?? '—'}
                                additionalValue={revenue?.additional_value ?? '—'}
                                hideAdditionalOnHd1440={true}
                                icon={moneyIcon}
                                chevron={revenue?.direction === 'down' ? chevronDownIcon : chevronUpIcon} />
                        </li>

                        <li className="dashboard__card-item">
                            <DashboardCard
                                title={appCount?.title ?? 'Заявок за месяц'}
                                value={appCount?.value ?? '—'}
                                additionalValue={appCount?.additional_value ?? '—'}
                                hideAdditionalOnHd1440={true}
                                icon={applicationIcon}
                                chevron={appCount?.direction === 'down' ? chevronDownIcon : chevronUpIcon} />
                        </li>

                        <li className="dashboard__card-item">
                            <DashboardCard
                                title={avgCheck?.title ?? 'Средний чек'}
                                value={avgCheck?.value ?? '—'}
                                additionalValue={avgCheck?.additional_value ?? '—'}
                                hideAdditionalOnHd1440={true}
                                icon={money2Icon}
                                chevron={avgCheck?.direction === 'down' ? chevronDownIcon : chevronUpIcon} />
                        </li>

                        <li className="dashboard__card-item">
                            <DashboardCard
                                title={pending?.title ?? 'Заявок в ожидании'}
                                value={pending?.value ?? '—'}
                                additionalValue={pending?.additional_value ?? '—'}
                                additionalValueColor={'accent'}
                                additionalSuffix={pending?.additional_suffix ?? 'за сегодня'}
                                hideAdditionalOnHd1440={true}
                                icon={applicationInDelayIcon}
                                chevron={bookmarkIcon} />
                        </li>
                    </ul>

                    <div className="dashboard__graphs">
                        <Graph
                            title="Прибыль"
                            color="#30BE0C"
                            fillTopColor="rgba(48, 190, 12, 0.24)"
                            fillBottomColor="rgba(48, 190, 12, 0)"
                            periods={graphs?.revenue ?? {
                                week: { labels: [], values: [] },
                                month: { labels: [], values: [] },
                                year: { labels: [], values: [] },
                            }}
                        />
                        <Graph
                            title="Заявки"
                            color="#3392FF"
                            fillTopColor="rgba(51, 146, 255, 0.24)"
                            fillBottomColor="rgba(51, 146, 255, 0)"
                            periods={graphs?.applications ?? {
                                week: { labels: [], values: [] },
                                month: { labels: [], values: [] },
                                year: { labels: [], values: [] },
                            }}
                        />
                    </div>

                    <div className="dashboard__visitors">
                        <article className="visitors-block">
                            <header className="visitors-block__header">
                                <h2 className="visitors-block__title">Посетители сайта</h2>
                                <span className="visitors-block__indicator" aria-hidden />
                            </header>
                            <div className="visitors-block__stats">
                                {[
                                    { label: 'Сегодня', key: 'today' },
                                    { label: 'Неделя', key: 'week' },
                                    { label: 'Месяц', key: 'month' },
                                    { label: 'Год', key: 'year' },
                                    { label: 'Всего', key: 'total' },
                                ].map(({ label, key }) => (
                                    <div className="visitors-block__stat" key={key}>
                                        <span className="visitors-block__stat-label">{label}</span>
                                        <span className="visitors-block__stat-value">
                                            {visitors ? (visitors[key] ?? '—') : '—'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </div>

                    <div className="dashboard__lastline">
                        <div className="dashboard__popular">
                            <PopularGraph items={popular?.items} />
                        </div>

                        <div className="dashboard__recently-applications">
                            <article className="recent-apps">
                                <header className="recent-apps__header">
                                    <h2 className="recent-apps__title">Недавние заявки</h2>
                                    <span className="recent-apps__indicator" aria-hidden />
                                </header>

                                <div
                                    className="recent-apps__table-wrap"
                                    role="region"
                                    aria-label="Последние заявки"
                                >
                                    <table className="recent-apps__table">
                                        <thead>
                                            <tr className="recent-apps__tr recent-apps__tr--head">
                                                <th className="recent-apps__th">Клиент</th>
                                                <th className="recent-apps__th">Дата</th>
                                                <th className="recent-apps__th">Цена</th>
                                                <th className="recent-apps__th">Город</th>
                                                <th className="recent-apps__th">Статус</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(recent?.applications ?? []).map((row) => (
                                                <tr className="recent-apps__tr" key={row.id}>
                                                    <td className="recent-apps__td recent-apps__client">
                                                        <span className="recent-apps__client-name">
                                                            {row.client_name}
                                                        </span>
                                                        <span className="recent-apps__client-phone">
                                                            {row.phone}
                                                        </span>
                                                    </td>
                                                    <td className="recent-apps__td recent-apps__date">
                                                        {row.date}
                                                    </td>
                                                    <td className="recent-apps__td recent-apps__price">
                                                        {row.price}
                                                    </td>
                                                    <td className="recent-apps__td recent-apps__city">
                                                        {row.city_name ?? '—'}
                                                    </td>
                                                    <td className="recent-apps__td recent-apps__status-cell">
                                                        <span
                                                            className={`recent-apps__status recent-apps__status--${row.status}`}
                                                        >
                                                            {STATUS_LABELS[row.status]}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )

}