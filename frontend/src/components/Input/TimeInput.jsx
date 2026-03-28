import { useState } from 'react';

function formatTime24(raw) {
    let d = raw.replace(/\D/g, '').slice(0, 4);
    if (!d.length) return '';

    if (d.length === 1 && d > '2') {
        d = `0${d}`;
    }

    let h = d.slice(0, 2);
    if (h.length === 2) {
        const hn = parseInt(h, 10);
        h = String(Math.min(23, hn)).padStart(2, '0');
    }

    if (d.length <= 2) {
        return h;
    }

    let m = d.slice(2, 4);
    if (m.length >= 1 && m[0] > '5') {
        m = `5${m.slice(1)}`;
    }
    if (m.length === 2) {
        const mn = parseInt(m, 10);
        m = String(Math.min(59, mn)).padStart(2, '0');
    }

    return `${h}:${m}`;
}

function padBlur(value) {
    const match = value.match(/^(\d{2}):(\d{1,2})$/);
    if (!match) return value;
    return `${match[1]}:${match[2].padStart(2, '0')}`;
}

export default function TimeInput({
    id,
    label,
    name,
    className = '',
    required,
}) {
    const [value, setValue] = useState('');

    return (
        <div className={`field ${className}`.trim()}>
            <label htmlFor={id} className="field__label">
                {label}
            </label>
            <input
                type="text"
                id={id}
                name={name ?? id}
                className="field__input"
                inputMode="numeric"
                autoComplete="off"
                value={value}
                onChange={(e) => setValue(formatTime24(e.target.value))}
                onBlur={() => setValue((v) => (v ? padBlur(v) : v))}
                placeholder="--:--"
                pattern="^([01][0-9]|2[0-3]):[0-5][0-9]$"
                title="24 часа, формат ЧЧ:ММ"
                required={required}
            />
        </div>
    );
}
