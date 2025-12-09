---
id: 1
title: Initialiser le projet Laravel 11
status: To Do
priority: critical
assignees: []
labels:
  - backend
  - setup
  - v1.0
subtasks: []
dependencies:
  - 47
blocked_by:
  - 2
  - 40
created_date: '2025-12-09T20:13:26.138Z'
updated_date: '2025-12-09T20:26:24.634Z'
changelog:
  - timestamp: '2025-12-09T20:13:26.138Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:26:13.549Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:14.290Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:15.036Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:15.777Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:24.634Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Projet Laravel 11 créé avec composer create-project
    checked: false
  - text: Configuration CORS activée pour les requêtes API
    checked: false
  - text: Fichier .env.example configuré avec les variables nécessaires
    checked: false
  - text: Routes API préfixées avec /api
    checked: false
ai_plan: >-
  ## Plan d'implémentation


  ### Objectif

  Initialiser le projet Laravel 11 avec la configuration de base pour une API
  REST.


  ### Étapes

  1. Exécuter `composer create-project laravel/laravel envmark-api`

  2. Configurer le fichier `.env.example` avec les variables DB, APP_URL, etc.

  3. Activer et configurer CORS dans `config/cors.php`

  4. Supprimer les routes web inutiles, garder uniquement les routes API

  5. Configurer le rate limiting dans `RouteServiceProvider`

  6. Ajouter les headers de sécurité (X-Content-Type-Options, etc.)


  ### Fichiers concernés

  - `composer.json`

  - `.env.example`

  - `config/cors.php`

  - `routes/api.php`

  - `app/Providers/RouteServiceProvider.php`


  ### Approche technique

  Utiliser la configuration Laravel standard avec sanctum désactivé (auth custom
  par UUID/password).
---
Créer un nouveau projet Laravel 11 avec la configuration de base. Inclut: composer create-project, configuration .env.example, setup des providers, configuration CORS pour l'API REST.
