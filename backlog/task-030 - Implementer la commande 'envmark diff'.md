---
id: 30
title: Implémenter la commande 'envmark diff'
created_date: '2025-12-09T20:17:50.300Z'
updated_date: '2025-12-09T20:17:50.300Z'
status: To Do
priority: high
assignees: []
labels:
  - cli
  - command
  - v1.1
subtasks: []
dependencies:
  - 21
  - 25
blocked_by: []
changelog:
  - timestamp: '2025-12-09T20:17:50.300Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Commande pour comparer deux environnements. Syntaxe: envmark diff env1 env2. Télécharge et déchiffre les deux .env, compare ligne par ligne, affiche les différences avec coloration (ajouts en vert, suppressions en rouge, modifications en jaune).
