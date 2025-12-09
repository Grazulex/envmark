---
id: 3
title: Créer la migration table projects
status: To Do
priority: high
assignees: []
labels:
  - backend
  - database
  - v1.0
subtasks: []
dependencies:
  - 2
blocked_by:
  - 4
  - 5
  - 6
created_date: '2025-12-09T20:13:46.136Z'
updated_date: '2025-12-09T20:26:51.313Z'
changelog:
  - timestamp: '2025-12-09T20:13:46.136Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:26:49.031Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:49.774Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:50.533Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:26:51.313Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: 'Migration créée avec les champs: id, uuid, name, password_hash, timestamps'
    checked: false
  - text: Index unique sur la colonne uuid
    checked: false
  - text: UUID au format VARCHAR(50) pour préfixe proj_
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Créer la table projects pour stocker les projets EnvMark.

  ### Étapes
  1. Générer la migration: `php artisan make:migration create_projects_table`
  2. Définir le schéma:
     - id: bigIncrements
     - uuid: string(50)->unique()
     - name: string(255)->nullable()
     - password_hash: string(255)
     - timestamps()
  3. Créer l'index sur uuid
  4. Exécuter la migration

  ### Fichiers concernés
  - `database/migrations/xxxx_create_projects_table.php`

  ### Approche technique
  ```php
  Schema::create('projects', function (Blueprint $table) {
      $table->id();
      $table->string('uuid', 50)->unique();
      $table->string('name', 255)->nullable();
      $table->string('password_hash', 255);
      $table->timestamps();
      
      $table->index('uuid');
  });
  ```
---
Migration pour la table projects selon le schéma: id BIGSERIAL, uuid VARCHAR(50) UNIQUE, name VARCHAR(255), password_hash VARCHAR(255), timestamps. Créer les index sur uuid.
