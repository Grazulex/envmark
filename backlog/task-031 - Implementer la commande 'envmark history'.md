---
id: 31
title: Implémenter la commande 'envmark history'
created_date: '2025-12-09T20:18:06.900Z'
updated_date: '2025-12-09T20:18:06.900Z'
status: To Do
priority: high
assignees: []
labels:
  - cli
  - command
  - v1.1
subtasks: []
dependencies:
  - 23
  - 25
blocked_by: []
changelog:
  - timestamp: '2025-12-09T20:18:06.900Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Commande pour voir l'historique d'un environnement. Syntaxe: envmark history [environment]. Affiche: version, date, commentaire, checksum tronqué. Format tableau avec pagination si > 20 versions.
