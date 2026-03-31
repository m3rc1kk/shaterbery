import Sidebar from "../../../components/AdminPanel/Sidebar/Sidebar.jsx";
import DashboardCard from "../../../components/AdminPanel/DashboardCard/DashboardCard.jsx";
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
                </div>
            </div>
        </>
    )

}