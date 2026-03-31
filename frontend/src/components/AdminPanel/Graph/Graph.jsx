import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function Graph({
    title,
    color = '#3392FF',
    fillTopColor = 'rgba(51, 146, 255, 0.25)',
    fillBottomColor = 'rgba(51, 146, 255, 0.0)',
    values = [],
    periods
}) {
    const canvasRef = useRef(null)
    const chartRef = useRef(null)
    const [activePeriod, setActivePeriod] = useState('week')

    const activeDataset = useMemo(() => {
        if (periods?.[activePeriod]) {
            return periods[activePeriod]
        }

        return {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл'],
            values
        }
    }, [activePeriod, periods, values])

    const chartValues = activeDataset.values || []
    const chartLabels = activeDataset.labels || []

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const gradient = ctx.createLinearGradient(0, 0, 0, 300)
        gradient.addColorStop(0, fillTopColor)
        gradient.addColorStop(1, fillBottomColor)

        if (chartRef.current) {
            chartRef.current.destroy()
        }

        const pointRadius = Array.from({ length: chartValues.length }, () => 0)
        if (pointRadius.length > 0) {
            pointRadius[pointRadius.length - 1] = 6.5
        }

        const minValue = chartValues.length ? Math.min(...chartValues) : 0
        const maxValue = chartValues.length ? Math.max(...chartValues) : 100
        const valueRange = Math.max(maxValue - minValue, 1)
        const stepBase = valueRange / 4
        const power = 10 ** Math.floor(Math.log10(stepBase))
        const stepSize = Math.max(Math.ceil(stepBase / power) * power, 1)
        const yMin = Math.floor((minValue - stepSize) / stepSize) * stepSize
        const yMax = Math.ceil((maxValue + stepSize) / stepSize) * stepSize

        const points = chartValues.map((value, index) => ({ x: index, y: value }))

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: title,
                        data: points,
                        borderColor: color,
                        borderWidth: 3,
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        pointRadius,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: color,
                        pointBorderWidth: 3,
                        pointHoverRadius: 7,
                        pointHoverBorderWidth: 3,
                        pointHoverBackgroundColor: '#ffffff',
                        pointHitRadius: 20
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                layout: {
                    padding: {
                        left: 0,
                        right: 0
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        displayColors: false,
                        backgroundColor: '#050925',
                        titleColor: '#FFFFFF',
                        bodyColor: '#FFFFFF',
                        padding: 10,
                        cornerRadius: 6,
                        callbacks: {
                            title: (items) => {
                                const index = items[0]?.dataIndex ?? 0
                                return chartLabels[index] || ''
                            },
                            label: (context) => `${title}: ${context.parsed.y}`
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        min: 0,
                        max: Math.max(chartLabels.length - 1, 0),
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(5, 9, 37, .35)',
                            font: {
                                size: 14
                            },
                            padding: 10,
                            autoSkip: false,
                            stepSize: 1,
                            callback: (value) => chartLabels[value] || ''
                        }
                    },
                    y: {
                        afterFit: (scale) => {
                            scale.width = 0
                        },
                        grid: {
                            color: 'rgba(5, 9, 37, .1)',
                            borderDash: [5, 5],
                            drawBorder: false,
                            drawTicks: false
                        },
                        border: {
                            display: false
                        },
                        ticks: {
                            display: false,
                            count: 5,
                            stepSize
                        },
                        min: yMin,
                        max: yMax
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest',
                    axis: 'x'
                }
            }
        })

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
                chartRef.current = null
            }
        }
    }, [chartLabels, chartValues, color, fillBottomColor, fillTopColor, title])

    return (
        <article className="graph">
            <header className="graph__header">
                <div className="graph__title-wrapper">
                    <h2 className="graph__title">{title}</h2>
                    <span className="graph__indicator" style={{ backgroundColor: color }} />
                </div>
                <div className="graph__tabs">
                    <button
                        type="button"
                        className={`graph__tab ${activePeriod === 'week' ? 'graph__tab--active' : ''}`}
                        onClick={() => setActivePeriod('week')}
                    >
                        Неделя
                    </button>
                    <button
                        type="button"
                        className={`graph__tab ${activePeriod === 'month' ? 'graph__tab--active' : ''}`}
                        onClick={() => setActivePeriod('month')}
                    >
                        Месяц
                    </button>
                    <button
                        type="button"
                        className={`graph__tab ${activePeriod === 'year' ? 'graph__tab--active' : ''}`}
                        onClick={() => setActivePeriod('year')}
                    >
                        Год
                    </button>
                </div>
            </header>

            <div className="graph__chart">
                <canvas ref={canvasRef} aria-label={title} />
            </div>
        </article>
    )
}
