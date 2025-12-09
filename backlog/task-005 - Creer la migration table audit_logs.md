---
id: 5
title: Créer la migration table audit_logs
status: To Do
priority: medium
assignees: []
labels:
  - backend
  - database
  - v1.0
subtasks: []
dependencies:
  - 3
blocked_by:
  - 8
created_date: '2025-12-09T20:13:53.024Z'
updated_date: '2025-12-09T20:13:53.024Z'
changelog:
  - timestamp: '2025-12-09T20:13:53.024Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Migration pour la table audit_logs: id BIGSERIAL, project_id FK, action VARCHAR(100), environment VARCHAR(100), ip_address INET, created_at. Actions: push, pull, delete, password_change.
