---
id: 14
title: 'Créer l''endpoint DELETE /api/projects/{uuid}/environments/{env}'
created_date: '2025-12-09T20:15:07.546Z'
updated_date: '2025-12-09T20:15:07.546Z'
status: To Do
priority: medium
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
  - timestamp: '2025-12-09T20:15:07.546Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Endpoint pour supprimer un environnement et toutes ses versions. Demande confirmation via header X-Confirm-Delete: true. Log l'action dans audit_logs. Retourne: success, deleted_versions_count.
