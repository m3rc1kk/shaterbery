import { apiFetch, apiJson, readJsonBody, ApiError } from './http.js';

export async function fetchCities() {
    return apiJson('/api/v1/cities/');
}

export async function createCity(data) {
    const res = await apiFetch('/api/v1/cities/admin/', {
        method: 'POST',
        body: data,
        auth: true,
    });
    const body = await readJsonBody(res);
    if (!res.ok) throw new ApiError(res.status, body);
    return body;
}

export async function deleteCity(id) {
    const res = await apiFetch(`/api/v1/cities/admin/${id}/`, {
        method: 'DELETE',
        auth: true,
    });
    if (res.status !== 204 && !res.ok) {
        const body = await readJsonBody(res);
        throw new ApiError(res.status, body);
    }
}
