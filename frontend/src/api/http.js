import { API_BASE } from './config.js';
import {
    clearAuthSession,
    getAccessToken,
    getRefreshToken,
    setAuthSession,
} from './authStorage.js';

const EN_TO_RU_DETAIL = {
    'Invalid username or password': 'Неверный логин или пароль',
    'Your account is disabled': 'Учётная запись отключена',
    'Username and password are required.': 'Укажите логин и пароль',
    'Given token not valid for any token type': 'Токен недействителен или устарел',
    'Token is blacklisted': 'Токен отозван',
    'Token is invalid or expired': 'Токен недействителен или истёк',
    'Authentication credentials were not provided.': 'Требуется авторизация',
    'You do not have permission to perform this action.': 'Недостаточно прав',
    'Not found.': 'Не найдено',
    'Not Found': 'Не найдено',
    'Invalid Token': 'Недействительный токен',
    'Refresh token is required': 'Требуется refresh-токен',
};

function stripThrottleWaitSuffix(message) {
    return message.replace(/\s*Expected available in \d+ seconds\.?/gi, '').trim();
}

function translateKnownEnglish(message) {
    if (!message || typeof message !== 'string') return message;
    message = stripThrottleWaitSuffix(message);
    if (!message) return 'Слишком много запросов. Попробуйте позже.';
    if (EN_TO_RU_DETAIL[message]) return EN_TO_RU_DETAIL[message];
    if (message.includes('Request was throttled')) return 'Слишком много запросов. Попробуйте позже.';
    return message;
}

export class ApiError extends Error {
    constructor(status, body) {
        super(apiErrorMessage(body, status));
        this.name = 'ApiError';
        this.status = status;
        this.body = body;
    }
}

export function apiErrorMessage(body, status) {
    if (body && typeof body === 'object') {
        if (typeof body.detail === 'string') {
            return translateKnownEnglish(body.detail);
        }
        if (Array.isArray(body.detail) && body.detail.length) {
            const d = body.detail[0];
            const s = typeof d === 'string' ? d : String(d);
            return translateKnownEnglish(s);
        }
        if (status === 400 && !body.detail) {
            const values = Object.values(body).flat();
            const first = values.find((v) => typeof v === 'string') || values[0];
            
            function isRequiredError(msg) {
                const l = msg.toLowerCase();
                return l.includes('required') || 
                       l.includes('обязательн') || 
                       l.includes('blank') || 
                       l.includes('пустым') || 
                       l.includes('null');
            }

            if (typeof first === 'string') {
                const translated = translateKnownEnglish(first);
                if (isRequiredError(translated)) {
                    return 'Вы заполнили не все поля';
                }
                return translated;
            }
            if (Array.isArray(first) && first.length && typeof first[0] === 'string') {
                const translated = translateKnownEnglish(first[0]);
                if (isRequiredError(translated)) {
                    return 'Вы заполнили не все поля';
                }
                return translated;
            }
            return 'Вы заполнили не все поля';
        }
    }
    if (status === 401) return 'Требуется вход';
    if (status === 403) return 'Недостаточно прав';
    if (status === 404) return 'Не найдено';
    if (status === 429) return 'Слишком много запросов. Попробуйте позже.';
    if (status >= 500) return 'Ошибка сервера';
    return 'Не удалось выполнить запрос';
}

export async function readJsonBody(response) {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

let _refreshPromise = null;

async function refreshAccessToken() {
    const refresh = getRefreshToken();
    if (!refresh) return null;

    const res = await fetch(`${API_BASE}/api/v1/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    setAuthSession({
        access: data.access,
        refresh: data.refresh || refresh,
    });
    return data.access;
}

export async function apiFetch(path, { method = 'GET', body, auth = false, headers = {}, _retried = false } = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
    const h = { ...headers };
    if (body !== undefined && !(body instanceof FormData)) {
        h['Content-Type'] = 'application/json';
    }
    if (auth) {
        const token = getAccessToken();
        if (token) {
            h['Authorization'] = `Bearer ${token}`;
        }
    }
    const response = await fetch(url, {
        method,
        headers: h,
        body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && auth && !_retried) {
        if (!_refreshPromise) {
            _refreshPromise = refreshAccessToken().finally(() => { _refreshPromise = null; });
        }
        const newToken = await _refreshPromise;
        if (newToken) {
            return apiFetch(path, { method, body, auth, headers, _retried: true });
        }
        clearAuthSession();
        window.dispatchEvent(new CustomEvent('shaterbery:auth-lost'));
    }

    return response;
}

export async function apiJson(path, options = {}) {
    const res = await apiFetch(path, options);
    const data = await readJsonBody(res);
    if (!res.ok) {
        throw new ApiError(res.status, data);
    }
    return data;
}
