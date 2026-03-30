import { useLayoutEffect, useState } from 'react';
import ReviewsCard from '../ReviewsCard/ReviewsCard.jsx';

import avatarDefault from '../../assets/images/reviews/avatar.png';


const MOBILE_MEDIA = '(max-width: 767px)';

const MAX_REVIEWS_DESKTOP = 6;
const MAX_REVIEWS_MOBILE_INITIAL = 1;

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

const reviews = [
    {
        id: 'review-1',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Вадим',
        date: '13 октября 2025',
        stars: 5,
        content:
            'Заказывали шатёр на свадьбу, гостей было около 80. Ребята приехали строго в оговорённое время, всё собрали быстро и аккуратно. Шатёр выглядел очень достойно — ни одного нарекания за весь день.',
    },
    {
        id: 'review-2',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Елена',
        date: '2 ноября 2025',
        stars: 4,
        content:
            'Брали шатёр и мебель на день рождения на даче. Всё доставили в срок, помогли с установкой. Единственный момент — чуть задержались из‑за пробок, но предупредили заранее.',
    },
    {
        id: 'review-3',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Игорь',
        date: '18 сентября 2025',
        stars: 5,
        content:
            'Корпоратив на природе — шатёр спас от дождя. Качество материала отличное, монтаж профессиональный. Рекомендую.',
    },
    {
        id: 'review-4',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Анна',
        date: '5 августа 2025',
        stars: 5,
        content:
            'Очень отзывчивая команда. Подсказали по размеру шатра под наше количество гостей. Всё чисто, аккуратно, без сюрпризов по цене. Очень отзывчивая команда. Подсказали по размеру шатра под наше количество гостей. Всё чисто, аккуратно, без сюрпризов по цене.',
    },
    {
        id: 'review-5',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Дмитрий',
        date: '22 июля 2025',
        stars: 4,
        content:
            'Хорошее соотношение цены и качества. Шатёр простоял три дня подряд, ветер выдержал без проблем. Забрали тоже оперативно.',
    },
    {
        id: 'review-6',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Мария',
        date: '10 июня 2025',
        stars: 5,
        content:
            'Заказывали впервые — переживала, но всё прошло идеально. Документы, сроки, общение на высоте. Обязательно обратимся ещё.',
    },
];


const benchmarkFirstReview = reviews[0];
const benchmarkContentLength = benchmarkFirstReview.content.length;
const benchmarkFirstId = benchmarkFirstReview.id;

export default function Reviews() {
    const isMobile = useIsMobileMatch();
    const [showAllMobile, setShowAllMobile] = useState(false);
    const limit = isMobile
        ? (showAllMobile ? MAX_REVIEWS_DESKTOP : MAX_REVIEWS_MOBILE_INITIAL)
        : MAX_REVIEWS_DESKTOP;
    const visibleReviews = reviews.slice(0, limit);
    const hasMobileToggle = isMobile && reviews.length > MAX_REVIEWS_MOBILE_INITIAL;

    return (
        <div className="reviews">
            <div className="reviews__list">
                {visibleReviews.map((item) => (
                    <ReviewsCard
                        key={item.id}
                        {...item}
                        benchmarkContentLength={benchmarkContentLength}
                        benchmarkFirstId={benchmarkFirstId}
                    />
                ))}
            </div>
            {hasMobileToggle ? (
                <button
                    type="button"
                    className="reviews__more"
                    onClick={() => setShowAllMobile((v) => !v)}
                >
                    {showAllMobile ? 'Скрыть' : 'Смотреть еще'}
                </button>
            ) : null}
        </div>
    );
}
