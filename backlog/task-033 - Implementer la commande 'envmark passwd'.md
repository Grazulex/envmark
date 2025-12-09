---
id: 33
title: Implémenter la commande 'envmark passwd'
created_date: '2025-12-09T20:18:15.442Z'
updated_date: '2025-12-09T20:18:15.442Z'
status: To Do
priority: medium
assignees: []
labels:
  - cli
  - command
  - v1.0
subtasks: []
dependencies:
  - 23
  - 25
blocked_by: []
changelog:
  - timestamp: '2025-12-09T20:18:15.442Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Commande pour changer le mot de passe du projet. Demande: mot de passe actuel, nouveau mot de passe + confirmation. Appelle l'API PUT /password. Met à jour le cache de session.
