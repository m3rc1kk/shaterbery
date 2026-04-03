import { apiFetch, readJsonBody, ApiError } from './http.js';
import { clearAuthSession, getRefreshToken, setAuthSession } from './authStorage.js';

export async function loginRequest(username, password) {
    const res = await apiFetch('/api/v1/auth/sign-in/', {
        method: 'POST',
        body: { username, password },
    });
    const data = await readJsonBody(res);
    if (!res.ok) {
        throw new ApiError(res.status, data);
    }
    setAuthSession({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
    });
    return data;
}

export async function logoutRequest() {
    const refresh = getRefreshToken();
    if (refresh) {
        const res = await apiFetch('/api/v1/auth/logout/', {
            method: 'POST',
            body: { refresh },
            auth: true,
        });
        if (!res.ok && res.status !== 205) {
            await readJsonBody(res);
        }
    }
    clearAuthSession();
}
