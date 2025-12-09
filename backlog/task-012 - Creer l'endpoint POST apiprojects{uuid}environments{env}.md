---
id: 12
title: 'Créer l''endpoint POST /api/projects/{uuid}/environments/{env}'
status: Done
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
created_date: '2025-12-09T20:14:49.966Z'
updated_date: '2025-12-09T21:19:21.483Z'
closed_date: '2025-12-09T21:19:21.483Z'
changelog:
  - timestamp: '2025-12-09T20:14:49.966Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:28:08.309Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:09.092Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:09.818Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:10.580Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:13.736Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-09T21:19:21.483Z'
    action: updated
    details: 'status: To Do → Done'
    user: user
acceptance_criteria:
  - text: Endpoint POST protégé par middleware auth
    checked: false
  - text: Version auto-incrémentée pour chaque push
    checked: false
  - text: Checksum SHA-256 validé
    checked: false
  - text: Action loggée dans audit_logs
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Créer l'endpoint Push pour uploader un fichier .env chiffré.

  ### Étapes
  1. Créer la méthode push dans EnvController
  2. Créer PushEnvRequest pour validation
  3. Calculer la prochaine version (max + 1)
  4. Stocker le blob chiffré avec checksum
  5. Logger l'action dans audit_logs
  6. Retourner la version créée

  ### Fichiers concernés
  - `app/Http/Controllers/Api/EnvController.php`
  - `app/Http/Requests/PushEnvRequest.php`
  - `routes/api.php`

  ### Approche technique
  ```php
  // PushEnvRequest
  public function rules(): array
  {
      return [
          'encrypted_content' => ['required', 'string'],
          'checksum' => ['required', 'string', 'size:64', 'regex:/^[a-f0-9]+$/'],
          'comment' => ['nullable', 'string', 'max:500'],
      ];
  }

  // EnvController@push
  public function push(PushEnvRequest $request, string $uuid, string $env)
  {
      $project = $request->attributes->get('project');
      
      $lastVersion = EnvFile::where('project_id', $project->id)
          ->where('environment', $env)
          ->max('version') ?? 0;
      
      $envFile = EnvFile::create([
          'project_id' => $project->id,
          'environment' => $env,
          'version' => $lastVersion + 1,
          'encrypted_content' => $request->encrypted_content,
          'checksum' => $request->checksum,
          'comment' => $request->comment,
      ]);
      
      AuditLog::log($project, 'push', $env, $request->ip());
      
      return response()->json([
          'success' => true,
          'version' => $envFile->version,
          'environment' => $env,
          'created_at' => $envFile->created_at,
      ], 201);
  }
  ```
---
Endpoint Push pour uploader un .env chiffré. Reçoit: encrypted_content (blob base64), checksum (SHA-256), comment (optionnel). Incrémente automatiquement la version. Log l'action dans audit_logs. Retourne: success, version, environment, created_at.
