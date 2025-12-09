---
id: 17
title: 'Créer l''endpoint PUT /api/projects/{uuid}/password'
created_date: '2025-12-09T20:15:31.243Z'
updated_date: '2025-12-09T20:15:31.243Z'
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
  - timestamp: '2025-12-09T20:15:31.243Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Endpoint pour changer le mot de passe du projet. Reçoit: current_password, new_password. Vérifie l'ancien mot de passe, hash le nouveau avec bcrypt. Log l'action password_change. Retourne: success, updated_at.
