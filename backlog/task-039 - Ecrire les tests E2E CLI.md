---
id: 39
title: Écrire les tests E2E CLI
created_date: '2025-12-09T20:20:13.682Z'
updated_date: '2025-12-09T20:20:13.682Z'
status: To Do
priority: medium
assignees: []
labels:
  - cli
  - tests
  - v1.0
subtasks: []
dependencies:
  - 26
  - 27
  - 28
blocked_by: []
changelog:
  - timestamp: '2025-12-09T20:20:13.682Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Tests end-to-end du workflow CLI complet: init → push → pull → list → diff. Utiliser un serveur API de test. Vérifier que le fichier .env récupéré est identique à l'original après push/pull.
