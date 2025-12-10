import { Command } from 'commander';
import ora from 'ora';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { loadConfig, getEnvFilePath } from '../lib/config.js';
import { GitManager, resolveEnvAlias } from '../lib/git.js';
import { decryptFromString, isEncrypted, loadKey, keyExists } from '../lib/crypto.js';
import { colors, icons, header, success, error, info, warning, keyValue, divider, blank, envBadge } from '../lib/ui.js';
import inquirer from 'inquirer';

export const pullCommand = new Command('pull')
  .description('Pull .env file from the repository')
  .argument('[env]', 'Environment to pull from (default: from config)')
  .option('-f, --force', 'Overwrite local .env without confirmation')
  .option('-o, --output <path>', 'Output to a different file')
  .action(async (env, options) => {
    try {
      await runPull(env, options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface PullOptions {
  force?: boolean;
  output?: string;
}

async function runPull(envArg: string | undefined, options: PullOptions): Promise<void> {
  // Load configuration
  const config = loadConfig();
  const env = envArg || config.defaultEnv;
  const branch = resolveEnvAlias(env);

  header(`Pull from ${envBadge(env)}`);
  blank();

  // Show what we're doing
  info('Configuration:');
  keyValue('Project', config.project);
  keyValue('Environment', `${env} ${colors.muted(`(branch: ${branch})`)}`);
  keyValue('Remote', config.remote);
  blank();

  // Determine output path
  const outputPath = options.output || join(process.cwd(), '.env');

  // Check if local .env exists
  if (existsSync(outputPath) && !options.force) {
    const localContent = readFileSync(outputPath, 'utf-8');

    warning(`Local ${options.output || '.env'} file already exists`);
    blank();

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: [
          { name: 'Overwrite local file', value: 'overwrite' },
          { name: 'Show diff first', value: 'diff' },
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);

    if (action === 'cancel') {
      info('Pull cancelled');
      return;
    }

    if (action === 'diff') {
      // We'll show diff after fetching remote content
    }
  }

  // Initialize Git manager
  const spinner = ora('Connecting to repository...').start();

  try {
    const git = new GitManager({ remote: config.remote, verbose: false });

    // Ensure repo is cloned/fetched
    spinner.text = 'Syncing repository...';
    await git.ensureRepo();

    // Checkout the environment branch
    spinner.text = `Switching to ${env} environment...`;

    // Check if branch exists
    const branchExists = await git.branchExists(env);
    if (!branchExists) {
      spinner.fail(`Environment '${env}' does not exist`);
      blank();

      // List available environments
      const branches = await git.listBranches();
      if (branches.length > 0) {
        console.log(colors.muted('Available environments:'));
        branches.forEach(b => {
          console.log(colors.muted(`  ${icons.bullet} ${b}`));
        });
        blank();
      }

      console.log(colors.muted(`Create it with: ${colors.primary(`envmark create ${env}`)}`));
      blank();
      process.exit(1);
    }

    await git.checkout(env);

    // Read .env from repo
    spinner.text = 'Fetching .env file...';
    const envFilePath = getEnvFilePath(config.project);
    const remoteContent = await git.readFile(envFilePath);

    if (remoteContent === null) {
      spinner.warn(`No .env file found for project '${config.project}' in ${env}`);
      blank();
      console.log(colors.muted('This could mean:'));
      console.log(colors.muted(`  ${icons.bullet} The project hasn't been set up in this environment yet`));
      console.log(colors.muted(`  ${icons.bullet} The project name is incorrect`));
      blank();
      console.log(colors.muted(`Push your first .env with: ${colors.primary(`envmark push ${env}`)}`));
      blank();
      return;
    }

    // Check if content is encrypted and decrypt if needed
    let finalContent = remoteContent;
    let wasEncrypted = false;

    if (isEncrypted(remoteContent)) {
      if (!keyExists(config.project)) {
        spinner.fail('File is encrypted but no key found');
        blank();
        warning('The .env file is encrypted but you don\'t have the decryption key');
        console.log(colors.muted(`Get the key from your team and save it with:`));
        console.log(colors.muted(`  ${icons.arrow} ${colors.primary('envmark keygen')}`));
        blank();
        return;
      }

      const key = loadKey(config.project);
      if (key) {
        try {
          finalContent = decryptFromString(remoteContent, key);
          wasEncrypted = true;
        } catch (err) {
          spinner.fail('Decryption failed');
          blank();
          error('Could not decrypt the .env file. The key may be incorrect.');
          blank();
          return;
        }
      }
    }

    spinner.succeed(`Fetched .env file${wasEncrypted ? ' (decrypted)' : ''}`);
    blank();

    // Show diff if local file exists and user asked for it
    if (existsSync(outputPath)) {
      const localContent = readFileSync(outputPath, 'utf-8');

      if (localContent === finalContent) {
        info('Local file is already up to date');
        blank();
        return;
      }

      // Simple diff display (just show it's different)
      console.log(colors.muted('Changes will be applied:'));
      const localLines = localContent.split('\n').length;
      const remoteLines = finalContent.split('\n').length;
      console.log(colors.muted(`  Local:  ${localLines} lines`));
      console.log(colors.muted(`  Remote: ${remoteLines} lines`));
      blank();

      if (!options.force) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Apply these changes?',
            default: true,
          },
        ]);

        if (!confirm) {
          info('Pull cancelled');
          return;
        }
      }
    }

    // Write to local file
    writeFileSync(outputPath, finalContent, 'utf-8');

    // Summary
    divider();
    success(`${icons.env} .env pulled from ${envBadge(env)}${wasEncrypted ? ' (decrypted)' : ''}`);
    blank();
    keyValue('Saved to', outputPath);
    keyValue('Lines', finalContent.split('\n').length.toString());
    if (wasEncrypted) {
      keyValue('Encryption', colors.success('decrypted'));
    }
    blank();

  } catch (err) {
    spinner.fail('Pull failed');
    throw err;
  }
}
