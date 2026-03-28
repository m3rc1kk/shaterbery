export default function Input({
    className = '',
    classNameInput = '',
    id,
    label,
    type = 'text',
    ...inputProps
}) {
    return (
        <div className={`field ${className}`.trim()}>
            <label
                htmlFor={id}
                className="field__label"
            >{label}</label>

            <input
                type={type}
                id={id}
                className={`field__input ${classNameInput}`}
                autoComplete="off"
                {...inputProps}
            />
        </div>
    );
}
