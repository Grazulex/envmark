---
id: 22
title: Implémenter la gestion des fichiers de config
status: To Do
priority: critical
assignees: []
labels:
  - cli
  - config
  - v1.0
subtasks: []
dependencies:
  - 21
blocked_by:
  - 23
  - 26
  - 35
created_date: '2025-12-09T20:16:39.696Z'
updated_date: '2025-12-09T20:16:39.696Z'
changelog:
  - timestamp: '2025-12-09T20:16:39.696Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Gérer .envmark.json et .envmark.key. Fonctions: LoadConfig(), SaveConfig(), LoadKey(), SaveKey(). Vérifier permissions fichier key (600). Format clé: préfixe 'ek_' + base64. Validation du format JSON config.
