import { apiFetch, apiJson, readJsonBody, ApiError } from './http.js';

export async function fetchServices() {
    return apiJson('/api/v1/services/');
}

export async function createService(formData) {
    const res = await apiFetch('/api/v1/services/admin/', {
        method: 'POST',
        body: formData,
        auth: true,
    });
    const data = await readJsonBody(res);
    if (!res.ok) throw new ApiError(res.status, data);
    return data;
}

export async function updateService(id, formData) {
    const res = await apiFetch(`/api/v1/services/admin/${id}/`, {
        method: 'PATCH',
        body: formData,
        auth: true,
    });
    const data = await readJsonBody(res);
    if (!res.ok) throw new ApiError(res.status, data);
    return data;
}

export async function deleteService(id) {
    const res = await apiFetch(`/api/v1/services/admin/${id}/`, {
        method: 'DELETE',
        auth: true,
    });
    if (res.status !== 204 && !res.ok) {
        const data = await readJsonBody(res);
        throw new ApiError(res.status, data);
    }
}
