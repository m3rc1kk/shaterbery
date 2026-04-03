const ACCESS = 'sb_access_token';
const REFRESH = 'sb_refresh_token';
const USER = 'sb_user';

export function getAccessToken() {
    return localStorage.getItem(ACCESS);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH);
}

export function getStoredUser() {
    const raw = localStorage.getItem(USER);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function setAuthSession({ access, refresh, user }) {
    localStorage.setItem(ACCESS, access);
    localStorage.setItem(REFRESH, refresh);
    if (user) {
        localStorage.setItem(USER, JSON.stringify(user));
    }
}

export function clearAuthSession() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER);
}
