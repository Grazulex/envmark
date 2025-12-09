---
id: 2
title: Configurer PostgreSQL et les migrations
status: To Do
priority: critical
assignees: []
labels:
  - backend
  - database
  - v1.0
subtasks: []
dependencies:
  - 1
blocked_by:
  - 3
created_date: '2025-12-09T20:13:42.057Z'
updated_date: '2025-12-09T20:26:37.579Z'
changelog:
  - timestamp: '2025-12-09T20:13:42.057Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:26:35.285Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:36.059Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:36.828Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:37.579Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Connexion PostgreSQL fonctionnelle
    checked: false
  - text: Variables DB_* documentées dans .env.example
    checked: false
  - text: Commande php artisan migrate fonctionne sans erreur
    checked: false
ai_plan: >-
  ## Plan d'implémentation


  ### Objectif

  Configurer PostgreSQL comme base de données principale.


  ### Étapes

  1. Installer le driver PostgreSQL: `php extension pdo_pgsql`

  2. Modifier `config/database.php` pour utiliser pgsql par défaut

  3. Configurer les variables dans `.env.example`:
     - DB_CONNECTION=pgsql
     - DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
  4. Créer la base de données PostgreSQL

  5. Tester la connexion avec `php artisan db:show`

  6. Supprimer les migrations Laravel par défaut (users, etc.)


  ### Fichiers concernés

  - `config/database.php`

  - `.env.example`

  - `database/migrations/` (supprimer les fichiers par défaut)


  ### Approche technique

  PostgreSQL pour les types INET (audit_logs.ip_address) et les performances sur
  les requêtes avec index.
---
Configurer la connexion PostgreSQL dans Laravel. Créer le fichier database.php adapté, configurer les variables d'environnement DB_*, tester la connexion. Préparer la structure de base pour les migrations.
