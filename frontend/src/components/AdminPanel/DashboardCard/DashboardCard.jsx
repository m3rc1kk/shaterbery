export default function DashboardCard({
    title,
    value,
    additionalValue,
    icon,
    chevron,
    additionalSuffix = 'к прошлому месяцу',
    hideAdditionalOnHd1440 = false,
    additionalValueColor = 'auto'
}) {
    const trimmedAdditionalValue = String(additionalValue).trim()
    const isPositive = trimmedAdditionalValue.startsWith('+')
    const isNegative = trimmedAdditionalValue.startsWith('-')

    const additionalValueClassName = [
        'dashboard-card__additional-value-number',
        additionalValueColor === 'accent' ? 'dashboard-card__additional-value--accent' : '',
        isPositive ? 'dashboard-card__additional-value--positive' : '',
        isNegative ? 'dashboard-card__additional-value--negative' : ''
    ].filter(Boolean).join(' ')

    return (
        <>
            <div className="dashboard-card">
                <div className="dashboard-card__inner">
                    <span className="dashboard-card__title">{title}</span>
                    <h1 className="dashboard-card__value">{value}</h1>
                    <div className="dashboard-card__additional-value-wrapper">
                        <img src={chevron} width={16} height={16} loading='lazy' alt="Стрелка" className="dashboard-card__additional-value-icon"/>
                        <span className={additionalValueClassName}>{additionalValue}</span>
                        <span className={`dashboard-card__additional-value-suffix ${hideAdditionalOnHd1440 ? 'dashboard-card__additional-value-suffix--hide-hd1440' : ''}`}>{additionalSuffix}</span>
                    </div>
                    <img src={icon} width={36} height={36} loading={'lazy'} alt="Иконка" className="dashboard-card__icon"/>
                </div>
            </div>
        </>
    )

}