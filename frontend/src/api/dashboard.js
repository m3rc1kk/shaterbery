import { apiJson } from './http.js';

function cityParam(citySlug) {
    return citySlug && citySlug !== 'all' ? `?city=${encodeURIComponent(citySlug)}` : '';
}

export async function fetchDashboardCards(citySlug) {
    return apiJson(`/api/v1/dashboard/cards/${cityParam(citySlug)}`, { auth: true });
}

export async function fetchDashboardGraphs(citySlug) {
    return apiJson(`/api/v1/dashboard/graphs/${cityParam(citySlug)}`, { auth: true });
}

export async function fetchDashboardPopular(citySlug) {
    return apiJson(`/api/v1/dashboard/popular/${cityParam(citySlug)}`, { auth: true });
}

export async function fetchDashboardRecent(citySlug) {
    return apiJson(`/api/v1/dashboard/recent/${cityParam(citySlug)}`, { auth: true });
}

export async function fetchDashboardVisitors() {
    return apiJson('/api/v1/dashboard/visitors/', { auth: true });
}

export async function trackPageVisit() {
    const KEY = 'shaterberry_sid';
    let sessionKey = localStorage.getItem(KEY);
    if (!sessionKey) {
        sessionKey = crypto.randomUUID();
        localStorage.setItem(KEY, sessionKey);
    }
    try {
        await apiJson('/api/v1/visitors/track/', {
            method: 'POST',
            body: { session_key: sessionKey },
        });
    } catch {
        // не критично
    }
}
