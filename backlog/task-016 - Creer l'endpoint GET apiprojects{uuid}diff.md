---
id: 16
title: 'Créer l''endpoint GET /api/projects/{uuid}/diff'
created_date: '2025-12-09T20:15:16.390Z'
updated_date: '2025-12-09T20:15:16.390Z'
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
  - timestamp: '2025-12-09T20:15:16.390Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Endpoint pour comparer deux environnements. Paramètres: ?from={env1}&to={env2}. Compare les checksums et retourne les métadonnées des deux versions. Le diff réel est fait côté client (zero-knowledge). Retourne: from{}, to{}, same_checksum.
