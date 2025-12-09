---
id: 28
title: Implémenter la commande 'envmark pull'
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
created_date: '2025-12-09T20:17:38.359Z'
updated_date: '2025-12-09T20:32:25.484Z'
changelog:
  - timestamp: '2025-12-09T20:17:38.359Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:31:58.943Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:31:59.765Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:32:00.540Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:32:01.309Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:32:02.084Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:32:25.484Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Télécharge le .env chiffré depuis l'API
    checked: false
  - text: Déchiffre avec la clé projet
    checked: false
  - text: Vérifie le checksum SHA-256
    checked: false
  - text: Écrit le fichier .env local
    checked: false
  - text: Option --version pour version spécifique
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Créer la commande `envmark pull` pour télécharger un .env.

  ### Étapes
  1. Créer `src/commands/pull.ts`
  2. Appeler l'API pour récupérer le blob chiffré
  3. Déchiffrer avec la clé projet
  4. Vérifier le checksum
  5. Écrire le fichier .env

  ### Fichiers concernés
  - `src/commands/pull.ts`

  ### Approche technique
  ```typescript
  import { Command } from 'commander';
  import { writeFileSync } from 'fs';
  import { createHash } from 'crypto';
  import { decrypt } from '../lib/crypto';
  import { loadConfig, loadKey, getCachedPassword } from '../lib/config';
  import { ApiClient } from '../lib/api';
  import ora from 'ora';
  import chalk from 'chalk';

  export const pullCommand = new Command('pull')
    .argument('[environment]', 'Source environment', 'local')
    .option('-v, --version <n>', 'Specific version')
    .option('-o, --output <path>', 'Output file', '.env')
    .action(async (environment, options) => {
      const config = loadConfig();
      const key = loadKey();
      const password = await getCachedPassword();
      
      const spinner = ora('Downloading...').start();
      
      const result = await ApiClient.pull(
        config.uuid, password, environment, options.version
      );
      
      spinner.text = 'Decrypting...';
      const content = decrypt(result.encrypted_content, key);
      
      // Verify checksum
      const checksum = createHash('sha256').update(content).digest('hex');
      if (checksum !== result.checksum) {
        spinner.fail(chalk.red('Checksum mismatch! Data may be corrupted.'));
        process.exit(1);
      }
      
      writeFileSync(options.output, content);
      spinner.succeed(`Pulled ${environment} (v${result.version}) → ${options.output}`);
    });
  ```
---
Commande pour télécharger un .env chiffré. Syntaxe: envmark pull [environment] [--version N]. Télécharge depuis l'API, déchiffre avec la clé projet, vérifie le checksum, écrit dans .env. Option --output pour spécifier le fichier destination.
