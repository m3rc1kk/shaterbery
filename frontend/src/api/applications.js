import { apiFetch, apiJson, readJsonBody, ApiError } from './http.js';

export async function submitPublicApplication(payload) {
    return apiJson('/api/v1/applications/submit/', {
        method: 'POST',
        body: payload,
    });
}

export function buildApplicationsListPath({ search = '', status = 'all', city = 'all' } = {}) {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (status && status !== 'all') params.set('status', status);
    if (city && city !== 'all') params.set('city', city);
    const q = params.toString();
    return `/api/v1/applications/${q ? `?${q}` : ''}`;
}

export function pathFromNextUrl(nextUrl) {
    if (!nextUrl) return null;
    try {
        const u = new URL(nextUrl);
        return u.pathname + u.search;
    } catch {
        return null;
    }
}

export async function fetchApplicationsList(path) {
    return apiJson(path, { auth: true });
}

export async function createApplicationAdmin(payload) {
    return apiJson('/api/v1/applications/', {
        method: 'POST',
        body: payload,
        auth: true,
    });
}

export async function patchApplication(id, payload) {
    return apiJson(`/api/v1/applications/${id}/`, {
        method: 'PATCH',
        body: payload,
        auth: true,
    });
}

export async function deleteApplication(id) {
    const res = await apiFetch(`/api/v1/applications/${id}/`, {
        method: 'DELETE',
        auth: true,
    });
    if (res.status !== 204 && !res.ok) {
        const data = await readJsonBody(res);
        throw new ApiError(res.status, data);
    }
}
