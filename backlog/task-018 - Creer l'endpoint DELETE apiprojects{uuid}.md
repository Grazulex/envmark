---
id: 18
title: 'Créer l''endpoint DELETE /api/projects/{uuid}'
created_date: '2025-12-09T20:15:35.732Z'
updated_date: '2025-12-09T20:15:35.732Z'
status: To Do
priority: low
assignees: []
labels:
  - backend
  - api
  - v1.0
subtasks: []
dependencies:
  - 9
blocked_by: []
changelog:
  - timestamp: '2025-12-09T20:15:35.732Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Endpoint pour supprimer complètement un projet. Supprime le projet, tous les env_files et audit_logs associés (CASCADE). Requiert header X-Confirm-Delete: DELETE-PROJECT. Retourne: success, deleted_at.
