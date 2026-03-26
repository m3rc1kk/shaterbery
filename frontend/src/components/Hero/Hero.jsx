import ButtonLink from "../Button/ButtonLink.jsx";
import arrowRight from "../../assets/images/hero/arrow-right.svg";
import mapPin from "../../assets/images/hero/map-pin.svg";
import heroImage from "../../assets/images/hero/Illustration.png";

export default function Hero() {
    return (
        <>
            <div className="hero container">
                <div className="hero__inner">
                    <div className="hero__body">
                        <div className="hero__location">
                            <img src={mapPin} width={12} height={14} loading='lazy' alt="Локация" className="hero__location-icon"/>
                            <span className="hero__location-text">Орловская область</span>
                        </div>

                        <h1 className="hero__title">АРЕНДА ШАТРОВ ДЛЯ ВАШЕГО МЕРОПРИЯТИЯ</h1>

                        <div className="hero__description">
                            <p>Работаем быстро и надёжно: доставляем точно в срок, устанавливаем
                                безопасно и предлагаем решения под ваш бюджет - от компактных шатров
                                до больших конструкций для массовых мероприятий
                            </p>
                        </div>

                        <div className="hero__buttons">
                            <ButtonLink to={'/'} className={'hero__button button__main'}>Заказать</ButtonLink>
                            <ButtonLink to={'/'} className={'hero__button hero__button--transparent button__main button--transparent'}>Авито <img src={arrowRight} width={7} height={10}
                                                                                                           loading='lazy' alt="Стрелка" className="hero__button-icon"/>
                            </ButtonLink>
                        </div>
                    </div>

                    <img src={heroImage} width={1093} height={815} loading='lazy' alt="Декоративная картинка" className="hero__image"/>
                </div>
            </div>
        </>
    );
}
