function yn(val) {
    return val === 'yes';
}

function intOrZero(v) {
    const n = parseInt(String(v ?? '0'), 10);
    return Number.isFinite(n) ? n : 0;
}

export function normalizeTimeForApi(t) {
    const s = String(t ?? '').trim();
    if (!s) return s;
    if (/^\d{2}:\d{2}$/.test(s)) return `${s}:00`;
    return s;
}

function collectItems(form) {
    const fd = new FormData(form);
    const items = [];
    for (const [key, value] of fd.entries()) {
        const match = key.match(/^service_(\d+)$/);
        if (match) {
            const qty = intOrZero(value);
            if (qty > 0) {
                items.push({ service_id: Number(match[1]), quantity: qty });
            }
        }
    }
    return items;
}

export function publicSubmitPayloadFromForm(form) {
    const fd = new FormData(form);
    return {
        name: String(fd.get('name') ?? '').trim(),
        phone: String(fd.get('phone') ?? '').trim(),
        date: String(fd.get('date') ?? ''),
        time: normalizeTimeForApi(fd.get('time')),
        place: String(fd.get('place') ?? '').trim(),
        days: Math.max(1, intOrZero(fd.get('days')) || 1),
        delivery: yn(String(fd.get('delivery') ?? 'no')),
        assembly: yn(String(fd.get('assembly') ?? 'no')),
        items: collectItems(form),
    };
}

export function adminCreatePayloadFromForm(form) {
    const p = publicSubmitPayloadFromForm(form);
    return {
        full_name: p.name,
        phone: p.phone,
        event_date: p.date,
        event_time: p.time,
        location: p.place,
        rental_days: p.days,
        delivery: p.delivery,
        assembly: p.assembly,
        items_input: p.items,
        source: 'manual',
        status: 'new',
    };
}

export function adminPatchPayloadFromForm(form) {
    const p = publicSubmitPayloadFromForm(form);
    const fd = new FormData(form);
    return {
        full_name: p.name,
        phone: p.phone,
        event_date: p.date,
        event_time: p.time,
        location: p.place,
        rental_days: p.days,
        delivery: p.delivery,
        assembly: p.assembly,
        items_input: p.items,
        source: String(fd.get('source') ?? 'site'),
        status: String(fd.get('status') ?? 'new'),
    };
}
