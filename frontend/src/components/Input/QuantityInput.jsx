import { useCallback, useState } from 'react';

export default function QuantityInput({
    id,
    label,
    name,
    className = '',
    min = 0,
    max,
    defaultValue = 0,
    disabled = false,
}) {
    const [value, setValue] = useState(() =>
        Math.max(min, Number(defaultValue) || 0),
    );

    const clamp = useCallback(
        (n) => {
            let v = Math.max(min, Number.isFinite(n) ? n : min);
            if (max !== undefined) v = Math.min(max, v);
            return v;
        },
        [min, max],
    );

    const dec = () => setValue((v) => clamp(v - 1));
    const inc = () => setValue((v) => clamp(v + 1));

    const onChange = (e) => {
        const raw = e.target.value;
        if (raw === '') {
            setValue(0);
            return;
        }
        const n = parseInt(raw, 10);
        if (Number.isNaN(n)) return;
        setValue(clamp(n));
    };

    return (
        <div className={`field quantity-field ${className}`.trim()}>
            <label htmlFor={id} className="field__label">
                {label}
            </label>
            <div className="quantity-field__control">
                <button
                    type="button"
                    className="quantity-field__btn quantity-field__btn--minus"
                    onClick={dec}
                    aria-label="Уменьшить количество"
                    disabled={disabled}
                >
                    −
                </button>
                <input
                    type="number"
                    id={id}
                    name={name ?? id}
                    className="quantity-field__input"
                    value={value}
                    onChange={onChange}
                    min={min}
                    max={max}
                    inputMode="numeric"
                    autoComplete="off"
                    disabled={disabled}
                />
                <button
                    type="button"
                    className="quantity-field__btn quantity-field__btn--plus"
                    onClick={inc}
                    aria-label="Увеличить количество"
                    disabled={disabled}
                >
                    +
                </button>
            </div>
        </div>
    );
}
