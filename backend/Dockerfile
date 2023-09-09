FROM python:3.11.4-slim-buster

WORKDIR /src

RUN apt-get update && \
    apt-get install -y gcc libpq-dev && \
    apt clean && \
    rm -rf /var/cache/apt/*

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8

COPY ./requirements /src/requirements

# For prod get name from env or just different Dockerfiles ?
RUN pip install -U pip && \
    pip install --no-cache-dir -r /src/requirements/local.txt

COPY . /src

#CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "config.asgi:application"]
