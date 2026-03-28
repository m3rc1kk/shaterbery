import applicationIcon from '../../assets/images/how-it-works/application.svg'
import phoneIcon from '../../assets/images/how-it-works/phone.svg'
import checkIcon from '../../assets/images/how-it-works/check-circle.svg'
import boxIcon from '../../assets/images/how-it-works/box.svg'
import packageIcon from '../../assets/images/how-it-works/package.svg'


export default function HowItWorks() {
    return (
        <>
            <div className="how-it-works">
                <div className="how-it-works__inner">
                    <ul className="how-it-works__list">
                        <li className="how-it-works__item">
                            <header className="how-it-works__header">
                                <span className="how-it-works__stage">1 этап</span>
                                <h2 className="how-it-works__title">
                                    <img src={applicationIcon} width={18} height={18} loading='lazy' alt="Заявка" className="how-it-works__title-icon"/>
                                    Заявка
                                </h2>
                            </header>

                            <div className="how-it-works__body">
                                <p>Оставляете заявку на сайте
                                    или пишите на авито -
                                    отвечаем быстро.</p>
                            </div>
                        </li>
                        <li className="how-it-works__item">
                            <header className="how-it-works__header">
                                <span className="how-it-works__stage">2 этап</span>
                                <h2 className="how-it-works__title">
                                    <img src={phoneIcon} width={18} height={18} loading='lazy' alt="Телефон" className="how-it-works__title-icon"/>
                                    Созвон
                                </h2>
                            </header>

                            <div className="how-it-works__body">
                                <p>Уточняем детали: время, дата, место, дополнительное оборудование.</p>
                            </div>
                        </li>
                        <li className="how-it-works__item">
                            <header className="how-it-works__header">
                                <span className="how-it-works__stage">3 этап</span>
                                <h2 className="how-it-works__title">
                                    <img src={checkIcon} width={18} height={18} loading='lazy' alt="Подтверждение" className="how-it-works__title-icon"/>
                                    Подтверждение
                                </h2>
                            </header>

                            <div className="how-it-works__body">
                                <p>Перезваниваем, ещё раз согласовываем условия и фиксируем заказ</p>
                            </div>
                        </li>
                        <li className="how-it-works__item">
                            <header className="how-it-works__header">
                                <span className="how-it-works__stage">4 этап</span>
                                <h2 className="how-it-works__title">
                                    <img src={boxIcon} width={18} height={18} loading='lazy' alt="Установка" className="how-it-works__title-icon"/>
                                    Установка
                                </h2>
                            </header>

                            <div className="how-it-works__body">
                                <p>Приезжаем и монтируем шатёр точно в срок. Производится оплата за работу.</p>
                            </div>
                        </li>
                        <li className="how-it-works__item">
                            <header className="how-it-works__header">
                                <span className="how-it-works__stage">5 этап</span>
                                <h2 className="how-it-works__title">
                                    <img src={packageIcon} width={18} height={18} loading='lazy' alt="Демонтаж" className="how-it-works__title-icon"/>
                                    Демонтаж
                                </h2>
                            </header>

                            <div className="how-it-works__body">
                                <p>
                                    Забираем всё обратно в оговорённое время. Площадка остается чистой
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}