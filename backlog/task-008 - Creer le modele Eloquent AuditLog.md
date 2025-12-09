---
id: 8
title: Créer le modèle Eloquent AuditLog
status: Done
priority: medium
assignees: []
labels:
  - backend
  - model
  - v1.0
subtasks: []
dependencies:
  - 5
blocked_by: []
created_date: '2025-12-09T20:14:19.515Z'
updated_date: '2025-12-09T21:15:00.582Z'
closed_date: '2025-12-09T21:15:00.582Z'
changelog:
  - timestamp: '2025-12-09T20:14:19.515Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T21:15:00.582Z'
    action: updated
    details: 'status: To Do → Done'
    user: user
acceptance_criteria: []
---
Modèle Eloquent pour la table audit_logs. Attributs: project_id, action, environment, ip_address. Relation belongsTo Project. Méthode statique pour logger facilement les actions (push, pull, delete, password_change).
