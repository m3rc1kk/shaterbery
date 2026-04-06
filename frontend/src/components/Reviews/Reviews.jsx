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
        username: 'Карина',
        date: '11 июня 2025',
        stars: 5,
        content:
            'Огромное вам спасибо! Брала шатер и мебель в аренду на свой день рождения. Погода, конечно, оставляла желать лучшего, резко поднялся сильный ветер, и пошел ливень. Но всё было хорошо установлено и закреплено, и мы продолжали сидеть под дождем)',
    },
    {
        id: 'review-2',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Дмитрий',
        date: '18 марта 2025',
        stars: 5,
        content:
            'Спасибо большое за доставку, Людмиле за организацию, а Дмитрию за оперативность и общение при встрече. Нужна была очищенная вода для системы отопления и теплого пола, пошли на встречу, подождал пока перельем в свои ёмкости. Цена соответствует оговоренной ранее. Будем ещё обращаться обязательно, успехов вам в ваших делах и начинаниях.',
    },
    {
        id: 'review-3',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Вадим',
        date: '13 октября 2025',
        stars: 5,
        content:
            'Все отлично',
    },
    {
        id: 'review-4',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Алексей',
        date: '29 мая 2025',
        stars: 5,
        content:
            'Все отлично , хороший продавец 😊',
    },
    {
        id: 'review-5',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Владимир',
        date: '15 мая 2025',
        stars: 5,
        content:
            'Хороший продавец рекомендую',
    },
    {
        id: 'review-6',
        avatar: avatarDefault,
        avatarAlt: '',
        username: 'Юрий Прибылов',
        date: '12 апреля 2025',
        stars: 5,
        content:
            'Привезли все как и обещали на следующий день',
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
