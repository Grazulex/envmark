---
id: 10
title: Créer l'endpoint POST /api/projects/register
status: Done
priority: critical
assignees: []
labels:
  - backend
  - api
  - v1.0
subtasks: []
dependencies:
  - 6
blocked_by:
  - 19
  - 37
  - 45
created_date: '2025-12-09T20:14:39.032Z'
updated_date: '2025-12-09T21:19:20.297Z'
closed_date: '2025-12-09T21:19:20.297Z'
changelog:
  - timestamp: '2025-12-09T20:14:39.032Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:27:34.424Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:35.212Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:35.980Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:36.738Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:54.540Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-09T21:15:57.351Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-09T21:19:20.297Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria:
  - text: Endpoint POST /api/projects/register accessible sans auth
    checked: false
  - text: Validation du format UUID (préfixe proj_)
    checked: false
  - text: Mot de passe hashé avec bcrypt avant stockage
    checked: false
  - text: Retourne 201 avec uuid et created_at
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Créer l'endpoint pour enregistrer un nouveau projet EnvMark.

  ### Étapes
  1. Créer le controller: `php artisan make:controller Api/ProjectController`
  2. Créer le FormRequest: `php artisan make:request RegisterProjectRequest`
  3. Implémenter la validation (uuid format, password required)
  4. Hasher le mot de passe et créer le projet
  5. Ajouter la route dans routes/api.php

  ### Fichiers concernés
  - `app/Http/Controllers/Api/ProjectController.php`
  - `app/Http/Requests/RegisterProjectRequest.php`
  - `routes/api.php`

  ### Approche technique
  ```php
  // RegisterProjectRequest
  public function rules(): array
  {
      return [
          'uuid' => ['required', 'string', 'regex:/^proj_[a-f0-9-]{36}$/', 'unique:projects,uuid'],
          'password' => ['required', 'string', 'min:8'],
          'project_name' => ['nullable', 'string', 'max:255'],
      ];
  }

  // ProjectController@register
  public function register(RegisterProjectRequest $request)
  {
      $project = Project::create([
          'uuid' => $request->uuid,
          'name' => $request->project_name,
          'password_hash' => Hash::make($request->password),
      ]);
      
      return response()->json([
          'success' => true,
          'uuid' => $project->uuid,
          'created_at' => $project->created_at,
      ], 201);
  }
  ```
---
Endpoint pour enregistrer un nouveau projet. Reçoit: uuid, password_hash, project_name. Valide le format UUID (proj_*), hash le mot de passe avec bcrypt, crée le projet. Retourne: success, uuid, created_at.
