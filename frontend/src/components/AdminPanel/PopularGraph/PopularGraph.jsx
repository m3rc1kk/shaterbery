import { useMemo } from "react"

const defaultItems = [
    { name: "Шатёр 3х3", count: 46 },
    { name: "Шатёр 3х6", count: 32 },
    { name: "Комплект мебели", count: 56 },
    { name: "Раскладные стулья", count: 16 },
    { name: "Лампочки", count: 6 }
]

export default function PopularGraph({ items = defaultItems }) {
    const sortedItems = useMemo(
        () => [...items].sort((a, b) => b.count - a.count),
        [items]
    )
    const maxCount = Math.max(...sortedItems.map((item) => item.count), 1)

    return (
        <article className="popular-graph">
            <header className="popular-graph__header">
                <h2 className="popular-graph__title">Популярные позиции</h2>
                <span className="popular-graph__indicator" />
            </header>

            <div className="popular-graph__list">
                {sortedItems.map((item) => {
                    const fillPercentage = (item.count / maxCount) * 100

                    return (
                        <div
                            className="popular-graph__item"
                            key={item.name}
                            title={`${item.name}: ${item.count} заказов`}
                        >
                            <div className="popular-graph__meta">
                                <span className="popular-graph__name">{item.name}</span>
                                <span className="popular-graph__count">{item.count} зак.</span>
                            </div>
                            <div className="popular-graph__track">
                                <div
                                    className="popular-graph__fill"
                                    style={{ width: `${fillPercentage}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </article>
    )
}
