---
id: 15
title: 'Créer l''endpoint GET /api/projects/{uuid}/environments/{env}/history'
status: Done
priority: high
assignees: []
labels:
  - backend
  - api
  - v1.1
subtasks: []
dependencies:
  - 9
blocked_by: []
created_date: '2025-12-09T20:15:13.324Z'
updated_date: '2025-12-09T21:19:23.353Z'
closed_date: '2025-12-09T21:19:23.353Z'
changelog:
  - timestamp: '2025-12-09T20:15:13.324Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T21:19:23.353Z'
    action: updated
    details: 'status: To Do → Done'
    user: user
acceptance_criteria: []
---
Endpoint pour l'historique des versions d'un environnement. Retourne: liste des versions avec version, checksum, comment, created_at. Trié par version décroissante. Pagination optionnelle.
