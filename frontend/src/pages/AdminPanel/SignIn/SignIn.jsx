import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Input from '../../../components/Input/Input.jsx';
import ButtonLink from '../../../components/Button/ButtonLink.jsx';
import { useAuth } from '../../../auth/useAuth.js';
import { ApiError } from '../../../api/http.js';

export default function SignIn() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/admin/dashboard';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [pending, setPending] = useState(false);

    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setPending(true);
        try {
            await login(username.trim(), password);
            navigate(from, { replace: true });
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Не удалось войти';
            setError(message);
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="sign-in">
            <form className="sign-in__form container" onSubmit={handleSubmit} noValidate>
                <h2 className="sign-in__title">Админ Панель</h2>
                {error ? (
                    <p className="sign-in__error" role="alert">
                        {error}
                    </p>
                ) : null}
                <div className="sign-in__inputs">
                    <Input
                        id="login"
                        name="username"
                        label="Логин"
                        placeholder="Имя пользователя"
                        value={username}
                        onChange={(ev) => setUsername(ev.target.value)}
                        autoComplete="username"
                        required
                        disabled={pending}
                    />

                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Пароль"
                        placeholder="••••••••"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        autoComplete="current-password"
                        required
                        disabled={pending}
                    />
                </div>

                <ButtonLink
                    type="submit"
                    className="sign-in__button button__main"
                    disabled={pending}
                >
                    Вход
                </ButtonLink>
            </form>
        </div>
    );
}
