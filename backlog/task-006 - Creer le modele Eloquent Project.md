---
id: 6
title: Créer le modèle Eloquent Project
status: Done
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
updated_date: '2025-12-09T21:14:59.285Z'
closed_date: '2025-12-09T21:14:59.285Z'
changelog:
  - timestamp: '2025-12-09T20:14:05.483Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T21:13:31.095Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-09T21:14:58.486Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-09T21:14:59.285Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_notes: |
  **2025-12-09T21:14:58.486Z** - **22:14** - Modèle Project créé avec:
  - fillable: uuid, name, password_hash
  - hidden: password_hash
  - Boot: génération auto UUID avec préfixe proj_
  - Relations: hasMany envFiles, hasMany auditLogs
  - Scope: byUuid()
  - Méthode: verifyPassword()
---
Modèle Eloquent pour la table projects. Attributs fillables: uuid, name, password_hash. Relations: hasMany EnvFile, hasMany AuditLog. Mutator pour générer UUID avec préfixe 'proj_'. Scope pour recherche par UUID.
