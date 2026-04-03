"""Русские сообщения для ответов REST API."""

import re

from rest_framework.views import exception_handler as drf_exception_handler

_THROTTLE_WAIT_SUFFIX = re.compile(
    r'\s*Expected available in \d+ seconds\.?',
    re.IGNORECASE,
)


def _strip_throttle_wait_suffix(s: str) -> str:
    return _THROTTLE_WAIT_SUFFIX.sub('', s).strip()

# Сообщения simplejwt и общие ответы DRF (англ. → рус.)
_DETAIL_MAP = {
    'Invalid username or password': 'Неверный логин или пароль.',
    'User Logged In!': 'Вход выполнен.',
    'User Logged Out!': 'Выход выполнен.',
    'Refresh token is required': 'Требуется refresh-токен.',
    'Invalid Token': 'Недействительный токен.',
    'Given token not valid for any token type': 'Токен недействителен или устарел.',
    'Token is blacklisted': 'Токен отозван.',
    'Token is invalid or expired': 'Токен недействителен или истёк.',
    'Authentication credentials were not provided.': 'Требуется авторизация.',
    'You do not have permission to perform this action.': 'Недостаточно прав для этого действия.',
    'Not found.': 'Не найдено.',
    'Invalid page.': 'Некорректная страница.',
    'Method "GET" not allowed.': 'Метод не разрешён.',
    'Method "POST" not allowed.': 'Метод не разрешён.',
    'Method "PUT" not allowed.': 'Метод не разрешён.',
    'Method "PATCH" not allowed.': 'Метод не разрешён.',
    'Method "DELETE" not allowed.': 'Метод не разрешён.',
}

_FIELD_STRING_MAP = {
    'This field is required.': 'Обязательное поле.',
    'This field may not be blank.': 'Вы заполнили не все поля',
    'This field may not be null.': 'Вы заполнили не все поля',
    'Enter a valid date.': 'Укажите корректную дату.',
    'Enter a valid time.': 'Укажите корректное время.',
    'Enter a valid URL.': 'Укажите корректный URL.',
    'Enter a valid email address.': 'Укажите корректный email.',
    'Ensure this value is greater than or equal to 0.': 'Значение не должно быть меньше 0.',
    'Ensure this value is less than or equal to 999.': 'Значение не должно быть больше 999.',
    'Ensure this value is less than or equal to 4096.': 'Слишком длинный текст (макс. 4096 символов).',
    'Ensure this value has at most 255 characters (it has ': 'Максимум 255 символов.',
    'Ensure this value has at most 32 characters (it has ': 'Максимум 32 символа.',
    'Ensure this value has at most 16 characters (it has ': 'Максимум 16 символов.',
    'Invalid pk ': 'Некорректный идентификатор.',
    'Username and password are required.': 'Укажите логин и пароль.',
    'Invalid username or password': 'Неверный логин или пароль.',
    'Your account is disabled': 'Учётная запись отключена.',
}

# Уже на русском (Django при LANGUAGE_CODE=ru) — показываем единый текст
_RU_FIELD_OVERRIDE = {
    'Это поле не может быть пустым.': 'Вы заполнили не все поля',
    'Это поле не может иметь значения NULL.': 'Вы заполнили не все поля',
    'Поле не может быть пустым.': 'Вы заполнили не все поля',
}

_JWT_CODE_MAP = {
    'token_not_valid': 'Токен недействителен или устарел.',
    'token_expired': 'Срок действия токена истёк.',
    'not_authenticated': 'Требуется авторизация.',
}


def _translate_plain_string(s: str) -> str:
    s = _strip_throttle_wait_suffix(s)
    if not s:
        return 'Слишком много запросов. Попробуйте позже.'
    if s in _RU_FIELD_OVERRIDE:
        return _RU_FIELD_OVERRIDE[s]
    if s in _DETAIL_MAP:
        return _DETAIL_MAP[s]
    if s in _FIELD_STRING_MAP:
        return _FIELD_STRING_MAP[s]
    for en, ru in _FIELD_STRING_MAP.items():
        if s.startswith(en):
            return ru
    if 'Request was throttled' in s:
        return 'Слишком много запросов. Попробуйте позже.'
    return s


def _translate_detail(detail, code=None):
    if code and code in _JWT_CODE_MAP:
        return _JWT_CODE_MAP[code]
    if isinstance(detail, str):
        return _translate_plain_string(detail)
    if isinstance(detail, list) and detail:
        return [_translate_detail(item, code) for item in detail]
    return detail


def _translate_value(val):
    if isinstance(val, str):
        return _translate_plain_string(val)
    if isinstance(val, list):
        return [_translate_value(x) for x in val]
    if isinstance(val, dict):
        return russianize_data(val)
    return val


def russianize_data(data):
    if isinstance(data, dict):
        code = data.get('code')
        out = {}
        for key, val in data.items():
            if key == 'detail':
                out[key] = _translate_detail(val, code)
            else:
                out[key] = _translate_value(val)
        return out
    if isinstance(data, list):
        return [_translate_value(x) for x in data]
    return data


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is not None:
        response.data = russianize_data(response.data)
    return response
