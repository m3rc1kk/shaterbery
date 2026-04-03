const MONTHS_SHORT = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
];

export function truncate(s, max = 28) {
    const t = String(s ?? '');
    if (t.length <= max) return t;
    return `${t.slice(0, Math.max(0, max - 1))}…`;
}

export function shortClientName(fullName) {
    const parts = String(fullName ?? '')
        .trim()
        .split(/\s+/);
    if (!parts[0]) return '';
    if (parts.length === 1) return parts[0];
    const second = parts[1];
    return `${parts[0]} ${second[0]}.`;
}

export function formatMoneyRub(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '—';
    return `${n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₽`;
}

export function formatMoneyPart(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '—';
    return `${n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₽`;
}

export function formatDateTimeRu(eventDate, eventTime) {
    if (!eventDate) return '—';
    let time = String(eventTime ?? '').trim();
    if (time.split(':').length === 3) {
        const p = time.split(':');
        time = `${p[0]}:${p[1]}`;
    }
    const d = new Date(`${eventDate}T${time || '00:00'}:00`);
    if (Number.isNaN(d.getTime())) return `${eventDate}${time ? `, ${time}` : ''}`;
    const day = d.getDate();
    const mon = MONTHS_SHORT[d.getMonth()] ?? '';
    const year = d.getFullYear();
    const hm = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${day} ${mon} ${year}, ${hm}`;
}

export function formatGoodsLineCaption(line) {
    const qty = line.quantity ?? 0;
    const unit = formatMoneyPart(line.unit_price);
    const total = formatMoneyPart(line.line_total);
    return `${qty} шт × ${unit} = ${total}`;
}

export function stripSecondsTime(t) {
    const s = String(t ?? '').trim();
    const m = s.match(/^(\d{2}:\d{2})(?::\d{2})?/);
    return m ? m[1] : s;
}
