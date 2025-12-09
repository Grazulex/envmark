---
id: 23
title: Implémenter le cache de session (mot de passe)
status: To Do
priority: high
assignees: []
labels:
  - cli
  - auth
  - v1.0
subtasks: []
dependencies:
  - 22
blocked_by:
  - 27
  - 28
  - 29
  - 31
  - 33
  - 34
created_date: '2025-12-09T20:16:45.561Z'
updated_date: '2025-12-09T20:16:45.561Z'
changelog:
  - timestamp: '2025-12-09T20:16:45.561Z'
    action: created
    details: Task created
    user: system
acceptance_criteria: []
---
Système de cache pour éviter de retaper le mot de passe. Fichier ~/.envmark/session chiffré avec la clé projet. Expiration 30 minutes. Fonctions: CachePassword(), GetCachedPassword(), ClearCache(). Renouvellement automatique à chaque utilisation.
