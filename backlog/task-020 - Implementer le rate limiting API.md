---
id: 20
title: Implémenter le rate limiting API
created_date: '2025-12-09T20:15:41.923Z'
updated_date: '2025-12-09T20:15:41.923Z'
status: To Do
priority: medium
assignees: []
labels:
  - backend
  - api
  - security
  - v1.0
subtasks: []
dependencies:
  - 9
blocked_by: []
changelog:
  - timestamp: '2025-12-09T20:15:41.923Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Configurer le rate limiting Laravel pour protéger l'API. Limites suggérées: 60 req/min pour les pulls, 30 req/min pour les pushs, 5 req/min pour register. Utiliser Redis si disponible, sinon fichier.
