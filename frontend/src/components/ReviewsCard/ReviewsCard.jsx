import { useLayoutEffect, useRef, useState } from 'react';
import starIcon from '../../assets/images/reviews/star.svg';

const MAX_STARS = 5;

function clampStars(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return 0;
    return Math.min(MAX_STARS, Math.max(0, Math.round(n)));
}

export default function ReviewsCard({
    id,
    avatar,
    avatarAlt = '',
    username,
    date,
    stars = 5,
    content,
    benchmarkContentLength,
    benchmarkFirstId,
}) {
    const filled = clampStars(stars);
    const [expanded, setExpanded] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const textRef = useRef(null);

    const isBenchmarkFirst = benchmarkFirstId != null && id === benchmarkFirstId;

    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el) return;

        const update = () => {
            if (expanded) {
                setShowToggle(true);
                return;
            }
            const overflow = el.scrollHeight > el.clientHeight + 1;
            if (benchmarkFirstId == null || benchmarkContentLength == null) {
                setShowToggle(overflow);
                return;
            }
            if (isBenchmarkFirst) {
                setShowToggle(overflow);
                return;
            }
            setShowToggle(overflow && content.length > benchmarkContentLength);
        };

        update();

        const ro = new ResizeObserver(() => update());
        ro.observe(el);
        return () => ro.disconnect();
    }, [
        content,
        expanded,
        benchmarkContentLength,
        benchmarkFirstId,
        isBenchmarkFirst,
    ]);

    return (
        <div className="reviews-card">
            <div className="reviews-card__inner">
                <header className="reviews-card__author">
                    <img
                        src={avatar}
                        width={36}
                        height={36}
                        loading="lazy"
                        alt={avatarAlt || `Аватар: ${username}`}
                        className="reviews-card__author-avatar"
                    />
                    <div className="reviews-card__author-body">
                        <span className="reviews-card__author-username">
                            {username}
                        </span>
                        <span className="reviews-card__author-date">{date}</span>
                    </div>
                </header>

                <div
                    className="reviews-card__rating"
                    role="img"
                    aria-label={`Оценка ${filled} из ${MAX_STARS}`}
                >
                    {Array.from({ length: MAX_STARS }, (_, i) => (
                        <img
                            key={i}
                            src={starIcon}
                            width={18}
                            height={18}
                            loading="lazy"
                            alt=""
                            className={
                                i < filled
                                    ? 'reviews-card__rating-icon'
                                    : 'reviews-card__rating-icon reviews-card__rating-icon--empty'
                            }
                        />
                    ))}
                </div>

                <div className="reviews-card__content">
                    <p
                        ref={textRef}
                        className={
                            expanded
                                ? 'reviews-card__content-text'
                                : 'reviews-card__content-text reviews-card__content-text--clamped'
                        }
                    >
                        {content}
                    </p>
                    {showToggle ? (
                        <button
                            type="button"
                            className="reviews-card__toggle"
                            onClick={() => setExpanded((v) => !v)}
                            aria-expanded={expanded}
                        >
                            {expanded ? 'Свернуть' : 'Читать полностью'}
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
