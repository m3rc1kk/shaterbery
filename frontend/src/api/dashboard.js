import { apiJson } from './http.js';

export async function fetchDashboardCards() {
    return apiJson('/api/v1/dashboard/cards/', { auth: true });
}

export async function fetchDashboardGraphs() {
    return apiJson('/api/v1/dashboard/graphs/', { auth: true });
}

export async function fetchDashboardPopular() {
    return apiJson('/api/v1/dashboard/popular/', { auth: true });
}

export async function fetchDashboardRecent() {
    return apiJson('/api/v1/dashboard/recent/', { auth: true });
}
