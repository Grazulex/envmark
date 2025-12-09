---
id: 11
title: 'Créer l''endpoint GET /api/projects/{uuid}/environments'
status: Done
priority: high
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
created_date: '2025-12-09T20:14:43.006Z'
updated_date: '2025-12-09T21:19:20.892Z'
closed_date: '2025-12-09T21:19:20.892Z'
changelog:
  - timestamp: '2025-12-09T20:14:43.006Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T21:19:20.892Z'
    action: updated
    details: 'status: To Do → Done'
    user: user
acceptance_criteria: []
---
Endpoint pour lister les environnements d'un projet. Authentification requise. Retourne la liste des environnements avec leur dernière version et date de mise à jour. Grouper par nom d'environnement.
