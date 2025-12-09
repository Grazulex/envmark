---
id: 27
title: Implémenter la commande 'envmark push'
status: To Do
priority: critical
assignees: []
labels:
  - cli
  - command
  - v1.0
subtasks: []
dependencies:
  - 21
  - 23
  - 25
blocked_by:
  - 32
  - 39
created_date: '2025-12-09T20:17:34.876Z'
updated_date: '2025-12-09T20:31:45.651Z'
changelog:
  - timestamp: '2025-12-09T20:17:34.876Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:29:58.349Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:59.108Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:59.901Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:30:00.682Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:31:45.651Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Lit le fichier .env local
    checked: false
  - text: Chiffre le contenu avec AES-256-GCM
    checked: false
  - text: Calcule checksum SHA-256
    checked: false
  - text: Envoie à l'API et affiche la version créée
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Créer la commande `envmark push` pour uploader un .env chiffré.

  ### Étapes
  1. Créer `src/commands/push.ts`
  2. Lire le fichier .env
  3. Chiffrer avec la clé projet
  4. Calculer le checksum SHA-256
  5. Envoyer à l'API
  6. Afficher confirmation

  ### Fichiers concernés
  - `src/commands/push.ts`

  ### Approche technique
  ```typescript
  import { Command } from 'commander';
  import { readFileSync } from 'fs';
  import { createHash } from 'crypto';
  import { encrypt } from '../lib/crypto';
  import { loadConfig, loadKey, getCachedPassword } from '../lib/config';
  import { ApiClient } from '../lib/api';
  import ora from 'ora';

  export const pushCommand = new Command('push')
    .argument('[environment]', 'Target environment', 'local')
    .option('-c, --comment <comment>', 'Version comment')
    .option('-f, --file <path>', 'Source file', '.env')
    .action(async (environment, options) => {
      const config = loadConfig();
      const key = loadKey();
      const password = await getCachedPassword();
      
      const spinner = ora('Reading .env file...').start();
      
      const content = readFileSync(options.file, 'utf8');
      const encrypted = encrypt(content, key);
      const checksum = createHash('sha256').update(content).digest('hex');
      
      spinner.text = 'Uploading...';
      
      const result = await ApiClient.push(
        config.uuid, password, environment,
        encrypted, checksum, options.comment
      );
      
      spinner.succeed(`Pushed to ${environment} (v${result.version})`);
    });
  ```
---
Commande pour uploader un .env chiffré. Syntaxe: envmark push [environment] [--comment 'msg']. Lit le fichier .env, le chiffre avec AES-256-GCM, calcule le checksum SHA-256, envoie à l'API. Affiche la version créée.
