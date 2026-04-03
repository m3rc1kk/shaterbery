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

export function publicSubmitPayloadFromForm(form) {
    const fd = new FormData(form);
    return {
        name: String(fd.get('name') ?? '').trim(),
        phone: String(fd.get('phone') ?? '').trim(),
        date: String(fd.get('date') ?? ''),
        time: normalizeTimeForApi(fd.get('time')),
        place: String(fd.get('place') ?? '').trim(),
        tent3x6: intOrZero(fd.get('tent3x6')),
        tent3x3: intOrZero(fd.get('tent3x3')),
        furniture: intOrZero(fd.get('furniture')),
        chairs: intOrZero(fd.get('chairs')),
        bulb: intOrZero(fd.get('bulb')),
        delivery: yn(String(fd.get('delivery') ?? 'no')),
        assembly: yn(String(fd.get('assembly') ?? 'no')),
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
        tent_3x6_qty: p.tent3x6,
        tent_3x3_qty: p.tent3x3,
        furniture_qty: p.furniture,
        chairs_qty: p.chairs,
        bulb_qty: p.bulb,
        delivery: p.delivery,
        assembly: p.assembly,
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
        tent_3x6_qty: p.tent3x6,
        tent_3x3_qty: p.tent3x3,
        furniture_qty: p.furniture,
        chairs_qty: p.chairs,
        bulb_qty: p.bulb,
        delivery: p.delivery,
        assembly: p.assembly,
        source: String(fd.get('source') ?? 'site'),
        status: String(fd.get('status') ?? 'new'),
    };
}
