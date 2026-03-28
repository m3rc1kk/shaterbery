import arrowDown from '../../assets/images/faq/arrow-down.svg';

export default function FAQCard({ id, question, answer, isOpen, onToggle }) {
    const panelId = `faq-panel-${id}`;
    const triggerId = `faq-trigger-${id}`;

    return (
        <li className="faq-card">
            <button
                type="button"
                className="faq-card__trigger"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={onToggle}
            >
                <span className="faq-card__title">{question}</span>
                <img
                    src={arrowDown}
                    width={24}
                    height={24}
                    loading="lazy"
                    alt=""
                    className={
                        isOpen
                            ? 'faq-card__arrow faq-card__arrow--open'
                            : 'faq-card__arrow'
                    }
                />
            </button>
            <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                className={
                    isOpen
                        ? 'faq-card__panel faq-card__panel--open'
                        : 'faq-card__panel'
                }
            >
                <div className="faq-card__panel-inner">
                    <p className="faq-card__answer">{answer}</p>
                </div>
            </div>
        </li>
    );
}
