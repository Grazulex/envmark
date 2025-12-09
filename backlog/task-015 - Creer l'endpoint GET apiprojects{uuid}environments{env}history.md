---
id: 15
title: 'Créer l''endpoint GET /api/projects/{uuid}/environments/{env}/history'
created_date: '2025-12-09T20:15:13.324Z'
updated_date: '2025-12-09T20:15:13.324Z'
status: To Do
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
changelog:
  - timestamp: '2025-12-09T20:15:13.324Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Endpoint pour l'historique des versions d'un environnement. Retourne: liste des versions avec version, checksum, comment, created_at. Trié par version décroissante. Pagination optionnelle.
