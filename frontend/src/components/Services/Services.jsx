import { useEffect, useState } from 'react';
import ServicesCard from '../ServicesCard/ServicesCard.jsx';
import { fetchServices } from '../../api/services.js';
import { API_BASE } from '../../api/config.js';
import { useCity } from '../../context/CityContext.jsx';

function resolveImage(img) {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${API_BASE}/${img.replace(/^\//, '')}`;
}

function formatPrice(priceValue, priceUnit) {
    const v = Number(priceValue) || 0;
    const formatted = v.toLocaleString('ru-RU');
    const unit = priceUnit === 'piece' ? '/шт' : '/сутки';
    return { price: `${formatted}₽`, postscript: unit };
}

export default function Services() {
    const [services, setServices] = useState([]);
    const { citySlug } = useCity();

    useEffect(() => {
        let cancelled = false;
        fetchServices(citySlug)
            .then((data) => {
                if (!cancelled) setServices(data);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [citySlug]);

    return (
        <div className="services">
            <div className="services__list">
                {services.map((item) => {
                    const { price, postscript } = formatPrice(item.price_value, item.price_unit);
                    return (
                        <ServicesCard
                            key={item.id}
                            image={resolveImage(item.image)}
                            imageAlt={item.title}
                            title={item.title}
                            description={item.description}
                            price={price}
                            pricePostscript={postscript}
                        />
                    );
                })}
            </div>
        </div>
    );
}
