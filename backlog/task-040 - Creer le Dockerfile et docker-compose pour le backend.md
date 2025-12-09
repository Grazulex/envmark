---
id: 40
title: Créer le Dockerfile et docker-compose pour le backend
status: To Do
priority: high
assignees: []
labels:
  - devops
  - docker
  - v1.0
subtasks: []
dependencies:
  - 1
blocked_by:
  - 42
created_date: '2025-12-09T20:20:35.386Z'
updated_date: '2025-12-09T20:32:52.773Z'
changelog:
  - timestamp: '2025-12-09T20:20:35.386Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:32:49.764Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:32:50.507Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:32:51.277Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:32:52.030Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:32:52.773Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Dockerfile multi-stage fonctionnel
    checked: false
  - text: docker-compose.yml avec services app et postgres
    checked: false
  - text: Healthcheck configuré
    checked: false
  - text: 'docker-compose up démarre l''API sur localhost:8000'
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Containeriser l'API Laravel avec Docker.

  ### Étapes
  1. Créer Dockerfile multi-stage (composer, php-fpm)
  2. Créer docker-compose.yml avec services
  3. Configurer nginx dans le container
  4. Ajouter healthcheck
  5. Configurer volumes pour dev

  ### Fichiers concernés
  - `Dockerfile`
  - `docker-compose.yml`
  - `docker/nginx.conf`
  - `docker/php.ini`

  ### Approche technique
  ```dockerfile
  # Dockerfile
  FROM composer:2 AS deps
  WORKDIR /app
  COPY composer.* ./
  RUN composer install --no-dev --no-scripts

  FROM php:8.3-fpm-alpine
  RUN apk add --no-cache postgresql-dev \
      && docker-php-ext-install pdo_pgsql
  COPY --from=deps /app/vendor /var/www/vendor
  COPY . /var/www
  WORKDIR /var/www
  RUN php artisan config:cache
  EXPOSE 9000
  ```

  ```yaml
  # docker-compose.yml
  services:
    app:
      build: .
      ports: ['8000:80']
      depends_on: [postgres]
      environment:
        DB_HOST: postgres
    postgres:
      image: postgres:16-alpine
      environment:
        POSTGRES_DB: envmark
        POSTGRES_PASSWORD: secret
      volumes:
        - pgdata:/var/lib/postgresql/data
  volumes:
    pgdata:
  ```
---
Dockerfile multi-stage pour l'API Laravel (PHP 8.3-fpm, nginx). docker-compose.yml avec services: app, postgres, redis (optionnel). Configurer les volumes pour le développement local. Health checks.
