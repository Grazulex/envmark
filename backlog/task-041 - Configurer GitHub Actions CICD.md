---
id: 41
title: Configurer GitHub Actions CI/CD
status: To Do
priority: high
assignees: []
labels:
  - devops
  - ci
  - v1.0
subtasks: []
dependencies:
  - 37
  - 38
blocked_by: []
created_date: '2025-12-09T20:20:38.933Z'
updated_date: '2025-12-09T20:34:36.627Z'
changelog:
  - timestamp: '2025-12-09T20:20:38.933Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:34:33.577Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:34.343Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:35.089Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:35.841Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:36.627Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Workflow tests PHPUnit sur push
    checked: false
  - text: Workflow tests CLI TypeScript sur push
    checked: false
  - text: Build Docker image sur tag
    checked: false
  - text: Lint PHP et TypeScript
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Configurer GitHub Actions pour CI/CD automatisé.

  ### Étapes
  1. Créer .github/workflows/ci.yml
  2. Job tests-backend (PHPUnit)
  3. Job tests-cli (Vitest)
  4. Job lint (PHP-CS-Fixer, ESLint)
  5. Job build-docker (sur tag)

  ### Fichiers concernés
  - `.github/workflows/ci.yml`
  - `.github/workflows/release.yml`

  ### Approche technique
  ```yaml
  # .github/workflows/ci.yml
  name: CI
  on: [push, pull_request]

  jobs:
    tests-backend:
      runs-on: ubuntu-latest
      services:
        postgres:
          image: postgres:16
          env:
            POSTGRES_PASSWORD: test
      steps:
        - uses: actions/checkout@v4
        - uses: shivammathur/setup-php@v2
          with: { php-version: '8.3' }
        - run: composer install
        - run: php artisan test

    tests-cli:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: '20' }
        - run: npm ci
        - run: npm test

    lint:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - run: composer install && ./vendor/bin/php-cs-fixer fix --dry-run
        - run: npm ci && npm run lint
  ```
---
Pipeline CI/CD: tests PHPUnit sur push, tests CLI TypeScript, lint (PHP-CS-Fixer, ESLint), build Docker image, push vers registry sur tag. Séparation jobs backend et CLI.
