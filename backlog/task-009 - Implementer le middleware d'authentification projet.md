---
id: 9
title: Implémenter le middleware d'authentification projet
status: To Do
priority: critical
assignees: []
labels:
  - backend
  - auth
  - security
  - v1.0
subtasks: []
dependencies:
  - 6
blocked_by:
  - 11
  - 12
  - 13
  - 14
  - 15
  - 16
  - 17
  - 18
  - 20
created_date: '2025-12-09T20:14:35.432Z'
updated_date: '2025-12-09T20:27:22.297Z'
changelog:
  - timestamp: '2025-12-09T20:14:35.432Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:27:19.200Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:19.966Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:20.752Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:21.530Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:27:22.297Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Middleware vérifie les headers X-Project-UUID et X-Project-Auth
    checked: false
  - text: Retourne 401 si UUID inexistant ou password invalide
    checked: false
  - text: Projet injecté dans la requête pour les controllers
    checked: false
  - text: Validation bcrypt du mot de passe
    checked: false
ai_plan: >-
  ## Plan d'implémentation


  ### Objectif

  Créer le middleware d'authentification par UUID + mot de passe pour sécuriser
  l'API.


  ### Étapes

  1. Créer le middleware: `php artisan make:middleware AuthenticateProject`

  2. Extraire les headers X-Project-UUID et X-Project-Auth

  3. Rechercher le projet par UUID

  4. Valider le mot de passe avec Hash::check()

  5. Injecter le projet dans $request->attributes

  6. Enregistrer le middleware dans Kernel.php

  7. Appliquer aux routes protégées


  ### Fichiers concernés

  - `app/Http/Middleware/AuthenticateProject.php`

  - `app/Http/Kernel.php`

  - `routes/api.php`


  ### Approche technique

  ```php

  public function handle($request, Closure $next)

  {
      $uuid = $request->header('X-Project-UUID');
      $password = $request->header('X-Project-Auth');
      
      if (\!$uuid || \!$password) {
          return response()->json(['error' => 'Missing credentials'], 401);
      }
      
      $project = Project::where('uuid', $uuid)->first();
      
      if (\!$project || \!Hash::check($password, $project->password_hash)) {
          return response()->json(['error' => 'Invalid credentials'], 401);
      }
      
      $request->attributes->set('project', $project);
      return $next($request);
  }

  ```
---
Créer un middleware Laravel pour authentifier les requêtes API via X-Project-UUID et X-Project-Auth. Vérifier l'UUID existe, valider le mot de passe avec bcrypt, injecter le projet dans la requête. Retourner 401 si invalide.
