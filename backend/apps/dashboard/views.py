from datetime import timedelta
from decimal import Decimal

from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate, TruncMonth
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.applications.models import Application

WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
MONTH_LABELS = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
]


def _percent_change(current, previous):
    if not previous:
        return 100 if current else 0
    return round((current - previous) / previous * 100)


def _build_week_data(qs, aggregate_field):
    today = timezone.now().date()
    weekday = today.weekday()
    week_start = today - timedelta(days=weekday)

    week_qs = qs.filter(created_at__date__gte=week_start, created_at__date__lte=today)
    daily = (
        week_qs
        .annotate(day=TruncDate('created_at'))
        .values('day')
        .annotate(val=aggregate_field)
        .order_by('day')
    )

    day_map = {row['day']: float(row['val'] or 0) for row in daily}

    labels = []
    values = []
    for i in range(7):
        d = week_start + timedelta(days=i)
        labels.append(WEEKDAY_LABELS[i])
        values.append(day_map.get(d, 0))

    return {'labels': labels, 'values': values}


def _build_month_data(qs, aggregate_field):
    today = timezone.now().date()
    month_start = today.replace(day=1)

    month_qs = qs.filter(created_at__date__gte=month_start, created_at__date__lte=today)
    daily = (
        month_qs
        .annotate(day=TruncDate('created_at'))
        .values('day')
        .annotate(val=aggregate_field)
        .order_by('day')
    )

    day_map = {row['day']: float(row['val'] or 0) for row in daily}

    step = max(today.day // 6, 1)
    labels = []
    values = []
    for i in range(1, today.day + 1, step):
        d = today.replace(day=i)
        labels.append(str(i))
        values.append(day_map.get(d, 0))

    if today.day not in [int(l) for l in labels]:
        labels.append(str(today.day))
        values.append(day_map.get(today, 0))

    return {'labels': labels, 'values': values}


def _build_year_data(qs, aggregate_field):
    today = timezone.now().date()
    year_start = today.replace(month=1, day=1)

    year_qs = qs.filter(created_at__date__gte=year_start, created_at__date__lte=today)
    monthly = (
        year_qs
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(val=aggregate_field)
        .order_by('month')
    )

    month_map = {}
    for row in monthly:
        month_map[row['month'].month] = float(row['val'] or 0)

    labels = []
    values = []
    for m in range(1, today.month + 1):
        labels.append(MONTH_LABELS[m - 1])
        values.append(month_map.get(m, 0))

    return {'labels': labels, 'values': values}


class DashboardCardsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        now = timezone.now()
        today = now.date()

        current_month_start = today.replace(day=1)
        prev_month_end = current_month_start - timedelta(days=1)
        prev_month_start = prev_month_end.replace(day=1)

        current_qs = Application.objects.filter(
            created_at__date__gte=current_month_start,
            created_at__date__lte=today,
        )
        prev_qs = Application.objects.filter(
            created_at__date__gte=prev_month_start,
            created_at__date__lte=prev_month_end,
        )

        current_closed = current_qs.filter(status=Application.Status.CLOSED)
        prev_closed = prev_qs.filter(status=Application.Status.CLOSED)

        current_revenue = current_closed.aggregate(s=Sum('total_price'))['s'] or Decimal('0')
        prev_revenue = prev_closed.aggregate(s=Sum('total_price'))['s'] or Decimal('0')

        current_count = current_qs.count()
        prev_count = prev_qs.count()

        current_avg = current_closed.aggregate(a=Avg('total_price'))['a'] or Decimal('0')
        prev_avg = prev_closed.aggregate(a=Avg('total_price'))['a'] or Decimal('0')

        pending_total = Application.objects.filter(status=Application.Status.NEW).count()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        pending_today = Application.objects.filter(
            status=Application.Status.NEW,
            created_at__gte=today_start,
        ).count()

        revenue_change = _percent_change(float(current_revenue), float(prev_revenue))
        count_change = _percent_change(current_count, prev_count)
        avg_change = _percent_change(float(current_avg), float(prev_avg))

        def fmt_money(val):
            val = int(val)
            if val >= 1000:
                s = str(val)
                parts = []
                while s:
                    parts.append(s[-3:])
                    s = s[:-3]
                return '.'.join(reversed(parts)) + '₽'
            return str(val) + '₽'

        def fmt_change(val):
            if val > 0:
                return f'+{val}%'
            return f'{val}%'

        data = {
            'revenue': {
                'title': 'Прибыль за месяц',
                'value': fmt_money(current_revenue),
                'additional_value': fmt_change(revenue_change),
                'direction': 'up' if revenue_change >= 0 else 'down',
            },
            'applications_count': {
                'title': 'Заявок за месяц',
                'value': str(current_count),
                'additional_value': fmt_change(count_change),
                'direction': 'up' if count_change >= 0 else 'down',
            },
            'average_check': {
                'title': 'Средний чек',
                'value': fmt_money(current_avg),
                'additional_value': fmt_change(avg_change),
                'direction': 'up' if avg_change >= 0 else 'down',
            },
            'pending': {
                'title': 'Заявок в ожидании',
                'value': str(pending_total),
                'additional_value': f'+{pending_today}',
                'additional_suffix': 'за сегодня',
            },
        }

        return Response(data)


class DashboardGraphsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        qs = Application.objects.all()
        closed_qs = qs.filter(status=Application.Status.CLOSED)

        revenue = {
            'week': _build_week_data(closed_qs, Sum('total_price')),
            'month': _build_month_data(closed_qs, Sum('total_price')),
            'year': _build_year_data(closed_qs, Sum('total_price')),
        }

        applications = {
            'week': _build_week_data(qs, Count('id')),
            'month': _build_month_data(qs, Count('id')),
            'year': _build_year_data(qs, Count('id')),
        }

        return Response({
            'revenue': revenue,
            'applications': applications,
        })


class DashboardPopularView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        qs = Application.objects.all()

        agg = qs.aggregate(
            tent_3x3=Sum('tent_3x3_qty'),
            tent_3x6=Sum('tent_3x6_qty'),
            furniture=Sum('furniture_qty'),
            chairs=Sum('chairs_qty'),
            bulbs=Sum('bulb_qty'),
        )

        items = [
            {'name': 'Шатёр 3х3', 'count': agg['tent_3x3'] or 0},
            {'name': 'Шатёр 3х6', 'count': agg['tent_3x6'] or 0},
            {'name': 'Комплект мебели', 'count': agg['furniture'] or 0},
            {'name': 'Раскладные стулья', 'count': agg['chairs'] or 0},
            {'name': 'Лампочки', 'count': agg['bulbs'] or 0},
        ]

        return Response({'items': items})


class DashboardRecentView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        apps = Application.objects.order_by('-created_at', '-id')[:4]

        rows = []
        for app in apps:
            rows.append({
                'id': app.id,
                'client_name': app.full_name,
                'phone': app.phone,
                'date': app.created_at.strftime('%d %b %Y, %H:%M'),
                'price': f'{int(app.total_price)}₽',
                'status': app.status,
            })

        return Response({'applications': rows})
