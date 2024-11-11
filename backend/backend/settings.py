from pathlib import Path
import re

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# CORS configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # El puerto de React
    "http://localhost:8000",  # El puerto de Django (si no es el puerto por defecto)
]

# Usar una expresión regular para permitir otros puertos dinámicamente en localhost
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://localhost:\d+$",  # Permite cualquier puerto en localhost
]

# Permitir todos los orígenes solo para desarrollo (no recomendado para producción)
CORS_ALLOW_ALL_ORIGINS = True

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-iw#kk+3k&ltbh%^3retzc&=do#l677xnxs5u3ngg=8rc4rktf7'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']  # Asegúrate de permitir localhost en desarrollo


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # Asegúrate de que corsheaders está instalado
    'rest_framework',
    'odomed',  # Tu app principal
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # El middleware de CORS debe ir al principio
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Email configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'alvarofredgonza2020@gmail.com'  # Cambia esto a tu correo de Gmail
EMAIL_HOST_PASSWORD = 'wird ojpx auhg ohui'  # Usa una contraseña de aplicaciones


APPEND_SLASH = False

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'clinicaodontologica',  # Cambia a tu base de datos
        'USER': 'root',  # Usuario predeterminado de Laragon
        'PASSWORD': '',  # Contraseña predeterminada (vacía en Laragon)
        'HOST': '127.0.0.1',  # Laragon usa localhost
        'PORT': '3306',  # Puerto predeterminado de MySQL en Laragon
    }
}


# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Localization settings
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
