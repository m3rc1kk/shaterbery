export default function ServicesCard({
    image,
    imageAlt = '',
    title,
    icon,
    iconAlt = '',
    description,
    price,
    pricePostscript,
}) {
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
                        <img
                            src={icon}
                            alt={iconAlt}
                            width={18}
                            height={18}
                            loading="lazy"
                            className="services-card__header-icon"
                        />
                        <h2 className="services-card__title">{title}</h2>
                    </header>

                    <div className="services-card__description">
                        <p>{description}</p>
                    </div>

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
