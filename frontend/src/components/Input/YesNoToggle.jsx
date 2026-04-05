import { useId, useState } from 'react';

function IconCheck() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
                d="M3 8.2L6.6 11.8L13 5.4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function IconCross() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function YesNoToggle({
    label,
    name,
    className = '',
    iconYes,
    iconNo,
    defaultYes = false,
    disabled = false,
    onToggle,
}) {
    const baseId = useId();
    const [yes, setYes] = useState(defaultYes);
    const icon = yes ? iconYes : iconNo;

    const toggle = (v) => {
        setYes(v);
        onToggle?.(v);
    };

    return (
        <div className={`field toggle-field ${className}`.trim()}>
            <span id={`${baseId}-label`} className="field__label">
                {label}
            </span>
            <div
                className="toggle-field__control"
                role="group"
                aria-labelledby={`${baseId}-label`}
            >
                <span className="toggle-field__icon-wrap" aria-hidden>
                    <img src={icon} width={16} height={16} alt="" className="toggle-field__icon" />
                </span>
                <div className="toggle-field__segmented">
                    <button
                        type="button"
                        className={`toggle-field__seg${yes ? ' toggle-field__seg--active' : ''}`}
                        onClick={() => toggle(true)}
                        aria-label="Да"
                        disabled={disabled}
                    >
                        <IconCheck />
                    </button>
                    <button
                        type="button"
                        className={`toggle-field__seg${!yes ? ' toggle-field__seg--active' : ''}`}
                        onClick={() => toggle(false)}
                        aria-label="Нет"
                        disabled={disabled}
                    >
                        <IconCross />
                    </button>
                </div>
            </div>
            <input type="hidden" name={name} value={yes ? 'yes' : 'no'} />
        </div>
    );
}
