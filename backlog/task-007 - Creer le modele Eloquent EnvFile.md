---
id: 7
title: Créer le modèle Eloquent EnvFile
status: Done
priority: high
assignees: []
labels:
  - backend
  - model
  - v1.0
subtasks: []
dependencies:
  - 4
blocked_by: []
created_date: '2025-12-09T20:14:10.927Z'
updated_date: '2025-12-09T21:14:59.907Z'
closed_date: '2025-12-09T21:14:59.907Z'
changelog:
  - timestamp: '2025-12-09T20:14:10.927Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T21:14:59.907Z'
    action: updated
    details: 'status: To Do → Done'
    user: user
acceptance_criteria: []
---
Modèle Eloquent pour la table env_files. Attributs: project_id, environment, version, encrypted_content, checksum, comment. Relation belongsTo Project. Scope pour récupérer la dernière version d'un environnement.
