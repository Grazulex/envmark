import { Command } from 'commander';
import inquirer from 'inquirer';
import { localConfigExists, loadLocalConfig } from '../lib/config.js';
import {
  generateKey,
  saveKey,
  loadKey,
  keyExists,
  deleteKey,
  getKeyFilePath,
} from '../lib/crypto.js';
import {
  colors,
  icons,
  header,
  success,
  error,
  info,
  warning,
  keyValue,
  blank,
  divider,
} from '../lib/ui.js';

export const keygenCommand = new Command('keygen')
  .description('Generate or manage encryption keys')
  .option('-s, --show', 'Show current key (if exists)')
  .option('-d, --delete', 'Delete the key')
  .option('-f, --force', 'Force regenerate without confirmation')
  .option('-p, --project <name>', 'Project name (defaults to current project)')
  .action(async (options) => {
    try {
      await runKeygen(options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface KeygenOptions {
  show?: boolean;
  delete?: boolean;
  force?: boolean;
  project?: string;
}

async function runKeygen(options: KeygenOptions): Promise<void> {
  // Determine project name
  let projectName = options.project;

  if (!projectName) {
    if (!localConfigExists()) {
      throw new Error(
        'No project specified and no .envmark.json found. Use -p <project> or run "envmark init" first.'
      );
    }
    const localConfig = loadLocalConfig();
    projectName = localConfig.project;
  }

  header('Encryption Key Management');
  blank();

  info('Project:');
  keyValue('Name', projectName);
  keyValue('Key file', getKeyFilePath(projectName));
  blank();

  const hasKey = keyExists(projectName);

  // Show current key
  if (options.show) {
    if (!hasKey) {
      warning('No encryption key found for this project');
      blank();
      console.log(colors.muted(`Generate one with: ${colors.primary('envmark keygen')}`));
      blank();
      return;
    }

    const key = loadKey(projectName);
    blank();
    console.log(colors.secondary.bold('Current Key:'));
    console.log(colors.warning(`  ${key}`));
    blank();
    warning('Keep this key secret! Anyone with this key can decrypt your .env files.');
    blank();
    return;
  }

  // Delete key
  if (options.delete) {
    if (!hasKey) {
      warning('No encryption key found for this project');
      blank();
      return;
    }

    if (!options.force) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure you want to delete the encryption key? You will not be able to decrypt existing encrypted .env files!',
          default: false,
        },
      ]);

      if (!confirm) {
        info('Deletion cancelled');
        return;
      }
    }

    deleteKey(projectName);
    success('Encryption key deleted');
    blank();
    return;
  }

  // Generate new key
  if (hasKey && !options.force) {
    warning('An encryption key already exists for this project');
    blank();

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
          { name: 'Show current key', value: 'show' },
          { name: 'Generate new key (will invalidate encrypted files!)', value: 'regenerate' },
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);

    if (action === 'cancel') {
      info('Cancelled');
      return;
    }

    if (action === 'show') {
      const key = loadKey(projectName);
      blank();
      console.log(colors.secondary.bold('Current Key:'));
      console.log(colors.warning(`  ${key}`));
      blank();
      return;
    }

    // Confirm regeneration
    const { confirmRegen } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmRegen',
        message: 'This will invalidate all encrypted .env files. Continue?',
        default: false,
      },
    ]);

    if (!confirmRegen) {
      info('Cancelled');
      return;
    }
  }

  // Generate and save new key
  const newKey = generateKey();
  saveKey(projectName, newKey);

  blank();
  divider();
  success(`${icons.key} Encryption key generated`);
  blank();

  console.log(colors.secondary.bold('Your new key:'));
  console.log(colors.warning(`  ${newKey}`));
  blank();

  warning('IMPORTANT: Save this key securely!');
  console.log(colors.muted('  - Share it with your team through a secure channel'));
  console.log(colors.muted('  - The key is stored in: ' + getKeyFilePath(projectName)));
  console.log(colors.muted('  - Never commit this key to version control'));
  blank();

  console.log(colors.muted('Enable encryption in your config:'));
  console.log(colors.muted(`  ${icons.arrow} Edit ~/.envmark/config.json and set "encrypt": true`));
  blank();
}
