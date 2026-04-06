import ServicesCard from '../ServicesCard/ServicesCard.jsx';

import tent3x6 from '../../assets/images/services/3x6.png';
import tent3x3 from '../../assets/images/services/3x3.png';
import furniture from '../../assets/images/services/furniture.png';
import chairs from '../../assets/images/services/chairs.png';
import bulb from '../../assets/images/services/bulb.png';

import homeIcon from '../../assets/images/services/icons/home.svg';
import sunIcon from '../../assets/images/services/icons/sun.svg';
import chairIcon from '../../assets/images/services/icons/chair.svg';
import sofaIcon from '../../assets/images/services/icons/mynaui_sofa.svg';
import boxIcon from '../../assets/images/services/icons/box.svg';

const services = [
    {
        id: 'tent-3x6',
        image: tent3x6,
        imageAlt: 'Шатёр 3×6',
        title: 'Шатёр 3×6',
        icon: homeIcon,
        iconAlt: 'Шатёр',
        description:
            'Вместимость до 20–25 человек. Подходит для небольших мероприятий, дачных праздников, дней рождения.',
        price: '2.000₽',
        pricePostscript: '/сутки',
    },
    {
        id: 'tent-3x3',
        image: tent3x3,
        imageAlt: 'Шатёр 3x3',
        title: 'Шатёр 3x3',
        icon: boxIcon,
        iconAlt: 'Коробка',
        description:
            'Компактный шатёр для небольшой компании, торговой точки или зоны отдыха на мероприятии.',
        price: '1.500₽',
        pricePostscript: '/сутки',
    },
    {
        id: 'furniture',
        image: furniture,
        imageAlt: 'Мебель',
        title: 'Комплект Мебели',
        icon: sofaIcon,
        iconAlt: 'Столы и стулья',
        description:
            '1 стол + 2 лавки. Рассчитан примерно на 20-22 ы. Добротная складная мебель для выездных мероприятий.',
        price: '500₽',
        pricePostscript: '/сутки',
    },
    {
        id: 'chairs',
        image: chairs,
        imageAlt: 'Стулья',
        title: 'Раскладные стулья',
        icon: chairIcon,
        iconAlt: 'Стулья',
        description:
            'Лёгкие складные стулья. Удобно докупить к комплекту мебели или  использовать отдельно. Подойдут для любого покрытия',
        price: '200₽',
        pricePostscript: '/шт',
    },
    {
        id: 'bulb',
        image: bulb,
        imageAlt: 'Лампочка к шатру',
        title: 'Лампочка к шатру',
        icon: sunIcon,
        iconAlt: 'Лампочка',
        description:
            'Декоративные лампочки для подвески внутри шатра. Создают уютную атмосферу на вечерних мероприятиях.',
        price: '100₽',
        pricePostscript: '/шт',
    },
];

export default function Services() {
    return (
        <div className="services">
            <div className="services__list">
                {services.map((item) => (
                    <ServicesCard key={item.id} {...item} />
                ))}
            </div>
        </div>
    );
}
