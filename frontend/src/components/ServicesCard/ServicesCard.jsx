import { useLayoutEffect, useState } from 'react';
import arrowDownIcon from '../../assets/images/services/icons/arrow-down.svg';
import arrowUpIcon from '../../assets/images/services/icons/arrow-up.svg';

const MOBILE_MEDIA = '(max-width: 767px)';

function useIsMobileMatch() {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' &&
        window.matchMedia(MOBILE_MEDIA).matches
    );

    useLayoutEffect(() => {
        const mq = window.matchMedia(MOBILE_MEDIA);
        const handler = () => setIsMobile(mq.matches);
        handler();
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return isMobile;
}

export default function ServicesCard({
    image,
    imageAlt = '',
    title,
    description,
    price,
    pricePostscript,
}) {
    const isMobile = useIsMobileMatch();
    const [isExpandedMobile, setIsExpandedMobile] = useState(false);
    const isDescriptionExpanded = !isMobile || isExpandedMobile;

    return (
        <div className="services-card">
            <div className="services-card__inner">
                <img
                    src={image}
                    alt={imageAlt}
                    width={300}
                    height={125}
                    loading="lazy"
                    className="services-card__image"
                />

                <div className="services-card__body">
                    <header className="services-card__header">
                        <h2 className="services-card__title">{title}</h2>
                    </header>

                    <div
                        className={
                            isDescriptionExpanded
                                ? 'services-card__description services-card__description--expanded'
                                : 'services-card__description services-card__description--collapsed'
                        }
                    >
                        <p>{description}</p>
                    </div>
                    {isMobile ? (
                        <button
                            type="button"
                            className="services-card__description-toggle"
                            onClick={() => setIsExpandedMobile((v) => !v)}
                            aria-expanded={isDescriptionExpanded}
                        >
                            <span>
                                {isDescriptionExpanded ? 'Скрыть описание' : 'Показать описание'}
                            </span>
                            <img
                                src={isDescriptionExpanded ? arrowUpIcon : arrowDownIcon}
                                width={16}
                                height={16}
                                loading="lazy"
                                alt=""
                                aria-hidden="true"
                            />
                        </button>
                    ) : null}

                    <span className="services-card__cost">
                        {price}
                        {pricePostscript ? (
                            <span className="services-card__cost--postscript">
                                {pricePostscript}
                            </span>
                        ) : null}
                    </span>
                </div>
            </div>
        </div>
    );
}
