import { useState } from 'react';

function formatRuPhone(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 0) return '';

    let body = digits;
    if (body.startsWith('8')) body = '7' + body.slice(1);
    if (body.startsWith('7')) body = body.slice(1);
    body = body.slice(0, 10);

    let out = '+7';
    if (body.length === 0) return out;
    out += ' (' + body.slice(0, 3);
    if (body.length <= 3) return out;
    out += ') ' + body.slice(3, 6);
    if (body.length <= 6) return out;
    out += ' ' + body.slice(6, 8);
    if (body.length <= 8) return out;
    out += ' ' + body.slice(8, 10);
    return out;
}

export default function PhoneInput({
    id,
    label,
    name,
    className = '',
    required,
    disabled = false,
    initialPhone = '',
}) {
    const [value, setValue] = useState(() => formatRuPhone(initialPhone ?? ''));

    return (
        <div className={`field ${className}`.trim()}>
            <label htmlFor={id} className="field__label">
                {label}
            </label>
            <input
                type="tel"
                id={id}
                name={name ?? id}
                className="field__input"
                inputMode="numeric"
                autoComplete="tel"
                value={value}
                onChange={(e) => setValue(formatRuPhone(e.target.value))}
                placeholder="+7 (___) ___ __ __"
                pattern="\\+7 \\(\\d{3}\\) \\d{3} \\d{2} \\d{2}"
                title="+7 (XXX) XXX XX XX"
                required={required}
                disabled={disabled}
            />
        </div>
    );
}
