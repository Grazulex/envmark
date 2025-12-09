---
id: 7
title: Créer le modèle Eloquent EnvFile
created_date: '2025-12-09T20:14:10.927Z'
updated_date: '2025-12-09T20:14:10.927Z'
status: To Do
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
changelog:
  - timestamp: '2025-12-09T20:14:10.927Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Modèle Eloquent pour la table env_files. Attributs: project_id, environment, version, encrypted_content, checksum, comment. Relation belongsTo Project. Scope pour récupérer la dernière version d'un environnement.
