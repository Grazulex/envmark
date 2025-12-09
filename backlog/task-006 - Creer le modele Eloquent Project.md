---
id: 6
title: Créer le modèle Eloquent Project
status: To Do
priority: high
assignees: []
labels:
  - backend
  - model
  - v1.0
subtasks: []
dependencies:
  - 3
blocked_by:
  - 9
  - 10
created_date: '2025-12-09T20:14:05.483Z'
updated_date: '2025-12-09T20:14:05.483Z'
changelog:
  - timestamp: '2025-12-09T20:14:05.483Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Modèle Eloquent pour la table projects. Attributs fillables: uuid, name, password_hash. Relations: hasMany EnvFile, hasMany AuditLog. Mutator pour générer UUID avec préfixe 'proj_'. Scope pour recherche par UUID.
