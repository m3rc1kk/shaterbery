import {Link} from "react-router-dom";

export default function ButtonLink({to, children, className='', onClick, type, disabled, ...rest }) {
    if (to && /^https?:\/\//i.test(to)) {
        return (
            <a
                href={to}
                className={`button__link ${className}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClick}
                {...rest}
            >
                {children}
            </a>
        );
    }

    if (to) {
        return (
            <Link to={to} className={`button__link ${className}`} onClick={onClick} {...rest}>
                {children}
            </Link>
        );
    }

    return (
        <button className={`button ${className}`} onClick={onClick} type={type} disabled={disabled} {...rest}>
            {children}
        </button>
    )
}