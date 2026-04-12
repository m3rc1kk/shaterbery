import { useEffect, useState } from 'react';
import { useCity } from '../../context/CityContext.jsx';
import mapPin from '../../assets/images/hero/map-pin.svg';

const STORAGE_KEY = 'selected_city';

export default function CityDetect() {
    const { cities, setCity } = useCity();
    const [step, setStep] = useState(null); // null | 'suggest' | 'pick'
    const [suggestedCity, setSuggestedCity] = useState(null);

    useEffect(() => {
        if (localStorage.getItem(STORAGE_KEY)) return;
        if (cities.length === 0) return;

        let cancelled = false;

        fetch('https://ipapi.co/json/')
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;
                const detected = (data.city || '').toLowerCase().trim();
                const match = cities.find((c) =>
                    c.name.toLowerCase().includes(detected) ||
                    detected.includes(c.name.toLowerCase()) ||
                    detected.includes(c.slug)
                );
                if (match) {
                    setSuggestedCity(match);
                    setStep('suggest');
                } else {
                    setStep('pick');
                }
            })
            .catch(() => {
                if (!cancelled) setStep('pick');
            });

        return () => { cancelled = true; };
    }, [cities]);

    const confirm = () => {
        setCity(suggestedCity.slug);
        setStep(null);
    };

    const decline = () => {
        setStep('pick');
    };

    const pick = (slug) => {
        setCity(slug);
        setStep(null);
    };

    if (!step) return null;

    return (
        <div className="city-detect">
            <div className="city-detect__inner">
                <img src={mapPin} width={14} height={16} alt="" className="city-detect__icon" />

                {step === 'suggest' && (
                    <>
                        <span className="city-detect__text">
                            Ваш город — <strong>{suggestedCity.name}</strong>?
                        </span>
                        <div className="city-detect__actions">
                            <button
                                type="button"
                                className="city-detect__btn city-detect__btn--yes"
                                onClick={confirm}
                            >
                                Да, верно
                            </button>
                            <button
                                type="button"
                                className="city-detect__btn city-detect__btn--no"
                                onClick={decline}
                            >
                                Нет
                            </button>
                        </div>
                    </>
                )}

                {step === 'pick' && (
                    <>
                        <span className="city-detect__text">Выберите ваш город:</span>
                        <div className="city-detect__actions">
                            {cities.map((c) => (
                                <button
                                    key={c.slug}
                                    type="button"
                                    className="city-detect__btn city-detect__btn--pick"
                                    onClick={() => pick(c.slug)}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
