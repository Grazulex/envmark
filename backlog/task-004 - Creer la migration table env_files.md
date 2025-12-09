---
id: 4
title: Créer la migration table env_files
status: To Do
priority: high
assignees: []
labels:
  - backend
  - database
  - v1.0
subtasks: []
dependencies:
  - 3
blocked_by:
  - 7
created_date: '2025-12-09T20:13:49.592Z'
updated_date: '2025-12-09T20:27:04.745Z'
changelog:
  - timestamp: '2025-12-09T20:13:49.592Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:27:01.647Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:02.445Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:03.212Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:03.967Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:04.745Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Table env_files avec FK vers projects
    checked: false
  - text: 'Contrainte UNIQUE sur (project_id, environment, version)'
    checked: false
  - text: Index composite pour requêtes fréquentes
    checked: false
  - text: CASCADE sur suppression du projet
    checked: false
ai_plan: >-
  ## Plan d'implémentation


  ### Objectif

  Créer la table env_files pour stocker les fichiers .env chiffrés avec
  versioning.


  ### Étapes

  1. Générer la migration: `php artisan make:migration create_env_files_table`

  2. Définir le schéma avec FK et indexes

  3. Ajouter la contrainte UNIQUE composite

  4. Configurer ON DELETE CASCADE


  ### Fichiers concernés

  - `database/migrations/xxxx_create_env_files_table.php`


  ### Approche technique

  ```php

  Schema::create('env_files', function (Blueprint $table) {
      $table->id();
      $table->foreignId('project_id')->constrained()->cascadeOnDelete();
      $table->string('environment', 100);
      $table->integer('version')->default(1);
      $table->text('encrypted_content');
      $table->string('checksum', 64);
      $table->string('comment', 500)->nullable();
      $table->timestamps();
      
      $table->unique(['project_id', 'environment', 'version']);
      $table->index(['project_id', 'environment']);
      $table->index(['project_id', 'environment', 'version']);
  });

  ```
---
Migration pour la table env_files: id BIGSERIAL, project_id FK, environment VARCHAR(100), version INT, encrypted_content TEXT, checksum VARCHAR(64), comment VARCHAR(500), timestamps. Index composites sur (project_id, environment) et (project_id, environment, version DESC).
