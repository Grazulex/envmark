---
id: 32
title: Implémenter la commande 'envmark rollback'
created_date: '2025-12-09T20:18:10.542Z'
updated_date: '2025-12-09T20:18:10.542Z'
status: To Do
priority: medium
assignees: []
labels:
  - cli
  - command
  - v1.1
subtasks: []
dependencies:
  - 27
  - 28
blocked_by: []
changelog:
  - timestamp: '2025-12-09T20:18:10.542Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Commande pour restaurer une version précédente. Syntaxe: envmark rollback [environment] --version N. Récupère la version spécifiée, crée une nouvelle version avec le même contenu (ne modifie pas l'historique). Demande confirmation.
