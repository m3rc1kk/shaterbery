import { useState } from 'react';
import FAQCard from '../FAQCard/FAQCard.jsx';
import { faqItems } from '../../data/siteContent.js';

export default function FAQ() {
    const [openId, setOpenId] = useState(null);

    const handleToggle = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="faq">
            <div className="faq__inner">
                <ul className="faq__list">
                    {faqItems.map((item) => (
                        <FAQCard
                            key={item.id}
                            id={item.id}
                            idPrefix="main-"
                            question={item.question}
                            answer={item.answer}
                            isOpen={openId === item.id}
                            onToggle={() => handleToggle(item.id)}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}
