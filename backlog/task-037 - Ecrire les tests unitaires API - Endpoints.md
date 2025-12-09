---
id: 37
title: Écrire les tests unitaires API - Endpoints
status: To Do
priority: high
assignees: []
labels:
  - backend
  - tests
  - v1.0
subtasks: []
dependencies:
  - 10
  - 11
  - 12
  - 13
blocked_by:
  - 41
created_date: '2025-12-09T20:20:05.741Z'
updated_date: '2025-12-09T20:34:04.561Z'
changelog:
  - timestamp: '2025-12-09T20:20:05.741Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:33:05.984Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:33:06.721Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:33:07.477Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:33:59.925Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:04.561Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Tests pour tous les endpoints CRUD
    checked: false
  - text: 'Tests d''authentification (401, UUID invalide)'
    checked: false
  - text: 'Tests de validation (formats, required)'
    checked: false
  - text: Couverture > 80%
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Écrire les tests unitaires PHPUnit pour l'API.

  ### Étapes
  1. Configurer PHPUnit avec RefreshDatabase
  2. Créer les factories (Project, EnvFile)
  3. Tester endpoint register
  4. Tester endpoints CRUD environments
  5. Tester authentification et erreurs

  ### Fichiers concernés
  - `tests/Feature/Api/ProjectTest.php`
  - `tests/Feature/Api/EnvironmentTest.php`
  - `database/factories/`

  ### Approche technique
  ```php
  class EnvironmentTest extends TestCase
  {
      use RefreshDatabase;
      
      public function test_push_creates_new_version()
      {
          $project = Project::factory()->create();
          
          $response = $this->withHeaders([
              'X-Project-UUID' => $project->uuid,
              'X-Project-Auth' => 'password123',
          ])->postJson("/api/projects/{$project->uuid}/environments/local", [
              'encrypted_content' => base64_encode('test'),
              'checksum' => hash('sha256', 'test'),
          ]);
          
          $response->assertStatus(201)
              ->assertJson(['version' => 1]);
      }
      
      public function test_pull_requires_auth()
      {
          $response = $this->getJson('/api/projects/invalid/environments/local');
          $response->assertStatus(401);
      }
  }
  ```
---
Tests PHPUnit pour tous les endpoints API: register, push, pull, list, history, diff, password, delete. Tester les cas nominaux, erreurs de validation, authentification invalide, UUID inexistant. Utiliser RefreshDatabase.
