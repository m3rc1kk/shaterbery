import { useCallback, useEffect, useMemo, useState } from 'react';
import { loginRequest, logoutRequest } from '../api/auth.js';
import { getAccessToken, getStoredUser } from '../api/authStorage.js';
import { AuthContext } from './authContext.js';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getStoredUser());
    const [token, setToken] = useState(() => getAccessToken());

    useEffect(() => {
        const onLost = () => {
            setUser(null);
            setToken(null);
        };
        window.addEventListener('shaterbery:auth-lost', onLost);
        return () => {
            window.removeEventListener('shaterbery:auth-lost', onLost);
        };
    }, []);

    const login = useCallback(async (username, password) => {
        const data = await loginRequest(username, password);
        setUser(data.user ?? null);
        setToken(data.access ?? null);
        return data;
    }, []);

    const logout = useCallback(async () => {
        await logoutRequest();
        setUser(null);
        setToken(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: Boolean(token),
            login,
            logout,
        }),
        [user, token, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
