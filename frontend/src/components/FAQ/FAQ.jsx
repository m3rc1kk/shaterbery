import { useState } from 'react';
import FAQCard from '../FAQCard/FAQCard.jsx';

const faqItems = [
    {
        id: 'faq-sizes',
        question: 'Какие размеры шатров есть в наличии?',
        answer:
            'У нас два размера: шатёр 3 × 3 м (до 10–12 человек) и шатёр 3 × 6 м (до 20–25 человек). Можно взять сразу несколько — они легко ставятся рядом и образуют единое пространство.',
    },
    {
        id: 'faq-booking',
        question: 'За сколько дней нужно бронировать?',
        answer:
            'Обычно достаточно за 3–5 дней. В пик сезона и на выходные лучше бронировать за 1–2 недели — так проще согласовать доставку и монтаж.',
    },
    {
        id: 'faq-rain',
        question: 'Что будет, если во время мероприятия пойдёт дождь?',
        answer:
            'Шатры и тенты рассчитаны на дождь: материал не пропускает воду. При необходимости можно добавить боковые стенки. В экстремальную погоду возможны ограничения по безопасности — обсудим при бронировании.',
    },
    {
        id: 'faq-delivery',
        question: 'Входит ли доставка в стоимость аренды?',
        answer:
            'Стоимость аренды и доставки считаются отдельно: зависит от адреса, сроков и объёма заказа. Точную сумму озвучим после уточнения деталей.',
    },
];

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
