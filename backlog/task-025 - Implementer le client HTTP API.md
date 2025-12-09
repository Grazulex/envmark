---
id: 25
title: Implémenter le client HTTP API
status: To Do
priority: critical
assignees: []
labels:
  - cli
  - api
  - v1.0
subtasks: []
dependencies:
  - 24
blocked_by:
  - 26
  - 27
  - 28
  - 29
  - 30
  - 31
  - 33
created_date: '2025-12-09T20:17:14.205Z'
updated_date: '2025-12-09T20:17:14.205Z'
changelog:
  - timestamp: '2025-12-09T20:17:14.205Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Client HTTP TypeScript pour communiquer avec l'API EnvMark. Classe ApiClient avec méthodes: register(), push(), pull(), list(), history(), diff(), changePassword(), deleteProject(). Gestion des headers X-Project-UUID et X-Project-Auth. Retry automatique sur erreurs réseau.
