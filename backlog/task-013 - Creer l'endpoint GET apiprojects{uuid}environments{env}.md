---
id: 13
title: 'Créer l''endpoint GET /api/projects/{uuid}/environments/{env}'
status: To Do
priority: critical
assignees: []
labels:
  - backend
  - api
  - v1.0
subtasks: []
dependencies:
  - 9
blocked_by:
  - 37
  - 45
created_date: '2025-12-09T20:15:03.914Z'
updated_date: '2025-12-09T20:28:35.272Z'
changelog:
  - timestamp: '2025-12-09T20:15:03.914Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:28:29.737Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:30.491Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:31.244Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:32.015Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:35.272Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Retourne la dernière version par défaut
    checked: false
  - text: Paramètre ?version=N pour version spécifique
    checked: false
  - text: Retourne 404 si environnement inexistant
    checked: false
  - text: Action pull loggée dans audit_logs
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Créer l'endpoint Pull pour télécharger un fichier .env chiffré.

  ### Étapes
  1. Créer la méthode pull dans EnvController
  2. Récupérer la dernière version ou version spécifique
  3. Logger l'action pull
  4. Retourner le blob chiffré avec métadonnées

  ### Fichiers concernés
  - `app/Http/Controllers/Api/EnvController.php`
  - `routes/api.php`

  ### Approche technique
  ```php
  public function pull(Request $request, string $uuid, string $env)
  {
      $project = $request->attributes->get('project');
      $version = $request->query('version');
      
      $query = EnvFile::where('project_id', $project->id)
          ->where('environment', $env);
      
      if ($version) {
          $envFile = $query->where('version', $version)->first();
      } else {
          $envFile = $query->orderBy('version', 'desc')->first();
      }
      
      if (!$envFile) {
          return response()->json(['error' => 'Environment not found'], 404);
      }
      
      AuditLog::log($project, 'pull', $env, $request->ip());
      
      return response()->json([
          'environment' => $env,
          'version' => $envFile->version,
          'encrypted_content' => $envFile->encrypted_content,
          'checksum' => $envFile->checksum,
          'updated_at' => $envFile->created_at,
      ]);
  }
  ```
---
Endpoint Pull pour télécharger un .env chiffré. Paramètre optionnel ?version={n} pour récupérer une version spécifique. Par défaut retourne la dernière version. Log l'action. Retourne: environment, version, encrypted_content, checksum, updated_at.
