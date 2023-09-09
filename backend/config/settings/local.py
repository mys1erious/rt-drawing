from .base import *


DEBUG = True

ALLOWED_HOSTS = ['localhost']


STATICFILES_DIRS = [os.path.join(BASE_DIR, 'src', 'static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'collectedstatic')
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'src', 'media')


CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:3000',
    'https://127.0.0.1:3000',
    'http://localhost:3000',
    'https://localhost:3000'
]


INSTALLED_APPS += ['debug_toolbar']


INTERNAL_IPS = [
    'localhost',
    '127.0.0.1'
]
