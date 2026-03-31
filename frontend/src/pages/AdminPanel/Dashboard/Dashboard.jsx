import Sidebar from "../../../components/AdminPanel/Sidebar/Sidebar.jsx";
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

export default function Dashboard() {
    return (
        <>
            <Sidebar />
            <div className="dashboard">
                <div className="dashboard__inner">
                    <ul className="dashboard__card-list">
                        <li className="dashboard__card-item">
                            <DashboardCard
                                title={"Прибыль за месяц"}
                                value={'123.542₽'}
                                additionalValue={'+18%'}
                                hideAdditionalOnHd1440={true}
                                icon={moneyIcon}
                                chevron={chevronUpIcon} />
                        </li>

                        <li className="dashboard__card-item">
                            <DashboardCard
                                title={"Заявок за месяц"}
                                value={'356'}
                                additionalValue={'-18%'}
                                hideAdditionalOnHd1440={true}
                                icon={applicationIcon}
                                chevron={chevronDownIcon} />
                        </li>

                        <li className="dashboard__card-item">
                            <DashboardCard
                                title={"Средний чек"}
                                value={'7.123₽'}
                                additionalValue={'+18%'}
                                hideAdditionalOnHd1440={true}
                                icon={money2Icon}
                                chevron={chevronUpIcon} />
                        </li>

                        <li className="dashboard__card-item">
                            <DashboardCard
                                title={"Заявок в ожидании"}
                                value={'7'}
                                additionalValue={'+3'}
                                additionalValueColor={'accent'}
                                additionalSuffix={'за сегодня'}
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
                            periods={{
                                week: {
                                    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                                    values: [42, 47, 45, 58, 52, 61, 56]
                                },
                                month: {
                                    labels: ['1', '5', '10', '15', '20', '25', '30'],
                                    values: [38, 49, 44, 67, 50, 59, 54]
                                },
                                year: {
                                    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'],
                                    values: [45, 52, 46, 71, 49, 60, 54]
                                }
                            }}
                        />
                        <Graph
                            title="Заявки"
                            color="#3392FF"
                            fillTopColor="rgba(51, 146, 255, 0.24)"
                            fillBottomColor="rgba(51, 146, 255, 0)"
                            periods={{
                                week: {
                                    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                                    values: [45, 53, 49, 60, 55, 63, 57]
                                },
                                month: {
                                    labels: ['1', '5', '10', '15', '20', '25', '30'],
                                    values: [40, 52, 47, 70, 51, 59, 55]
                                },
                                year: {
                                    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'],
                                    values: [48, 55, 49, 73, 53, 62, 56]
                                }
                            }}
                        />
                    </div>

                    <div className="dashboard__lastline">
                        <div className="dashboard__popular">
                            <PopularGraph />
                        </div>

                        <div className="dashboard__recently-applications">

                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}