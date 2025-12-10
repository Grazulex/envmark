import { Command } from 'commander';
import ora from 'ora';
import inquirer from 'inquirer';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { loadConfig, getEnvFilePath } from '../lib/config.js';
import { GitManager, resolveEnvAlias } from '../lib/git.js';
import { colors, icons, header, success, error, info, warning, keyValue, blank, envBadge, divider } from '../lib/ui.js';

export const rollbackCommand = new Command('rollback')
  .description('Rollback .env to a previous version')
  .argument('[env]', 'Environment to rollback')
  .option('-v, --version <hash>', 'Commit hash to rollback to')
  .option('-n, --steps <number>', 'Number of versions to go back', '1')
  .option('--local', 'Only update local .env, do not push')
  .option('-f, --force', 'Skip confirmation')
  .action(async (env, options) => {
    try {
      await runRollback(env, options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface RollbackOptions {
  version?: string;
  steps: string;
  local?: boolean;
  force?: boolean;
}

async function runRollback(envArg: string | undefined, options: RollbackOptions): Promise<void> {
  const config = loadConfig();
  const env = envArg || config.defaultEnv;
  const branch = resolveEnvAlias(env);

  header(`Rollback: ${envBadge(env)}`);
  blank();

  info('Configuration:');
  keyValue('Project', config.project);
  keyValue('Environment', `${env} (branch: ${branch})`);
  blank();

  const spinner = ora('Fetching history...').start();

  try {
    const git = new GitManager({ remote: config.remote, verbose: false });
    await git.ensureRepo();

    // Check if branch exists
    const exists = await git.branchExists(env);
    if (!exists) {
      spinner.fail(`Environment '${env}' does not exist`);
      return;
    }

    // Checkout and get history
    await git.checkout(env);
    const envFilePath = getEnvFilePath(config.project);
    const history = await git.getFileHistory(envFilePath, 20);

    if (history.length === 0) {
      spinner.fail(`No history found for project '${config.project}'`);
      return;
    }

    spinner.stop();

    // Determine target version
    let targetHash: string;
    let targetIndex: number;

    if (options.version) {
      // Find the specified version
      targetIndex = history.findIndex(h => h.hash.startsWith(options.version!));
      if (targetIndex === -1) {
        error(`Version '${options.version}' not found in history`);
        blank();
        info('Available versions:');
        history.slice(0, 5).forEach(h => {
          console.log(colors.muted(`  ${icons.bullet} ${h.hash} - ${h.message}`));
        });
        blank();
        return;
      }
      targetHash = history[targetIndex].hash;
    } else {
      // Go back N steps
      const steps = parseInt(options.steps, 10) || 1;
      if (steps >= history.length) {
        error(`Cannot go back ${steps} step(s), only ${history.length - 1} previous version(s) available`);
        return;
      }
      targetIndex = steps;
      targetHash = history[targetIndex].hash;
    }

    const targetEntry = history[targetIndex];
    const currentEntry = history[0];

    // Show what we're doing
    blank();
    console.log(colors.secondary.bold('Rollback Details'));
    blank();
    console.log(colors.muted('Current version:'));
    console.log(`  ${colors.primary(currentEntry.hash)} - ${currentEntry.message}`);
    console.log(colors.muted(`  ${new Date(currentEntry.date).toLocaleString()}`));
    blank();
    console.log(colors.muted('Target version:'));
    console.log(`  ${colors.warning(targetEntry.hash)} - ${targetEntry.message}`);
    console.log(colors.muted(`  ${new Date(targetEntry.date).toLocaleString()}`));
    blank();

    // Get the content at target version
    const rollbackSpinner = ora('Fetching target version...').start();
    const targetContent = await git.getFileAtCommit(envFilePath, targetHash);

    if (targetContent === null) {
      rollbackSpinner.fail('Failed to retrieve target version');
      return;
    }

    rollbackSpinner.stop();

    // Confirm rollback
    if (!options.force) {
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: options.local
            ? 'Apply this version to local .env?'
            : 'Rollback and push to remote?',
          default: true,
        },
      ]);

      if (!confirm) {
        info('Rollback cancelled');
        return;
      }
    }

    // Apply rollback
    const applySpinner = ora('Applying rollback...').start();

    if (options.local) {
      // Only update local file
      const localPath = join(process.cwd(), '.env');
      writeFileSync(localPath, targetContent, 'utf-8');
      applySpinner.succeed('Local .env updated');
    } else {
      // Push to remote
      await git.writeFileAndPush(
        envFilePath,
        targetContent,
        `Rollback ${config.project} to ${targetHash}`
      );
      applySpinner.succeed('Rollback pushed to remote');

      // Also update local file
      const localPath = join(process.cwd(), '.env');
      writeFileSync(localPath, targetContent, 'utf-8');
    }

    blank();
    divider();
    success(`${icons.success} Rolled back to version ${colors.primary(targetHash)}`);
    blank();

    if (options.local) {
      console.log(colors.muted('Note: Only local .env was updated. Remote is unchanged.'));
      console.log(colors.muted(`Push with: ${colors.primary(`envmark push ${env}`)}`));
      blank();
    }

  } catch (err) {
    spinner.fail('Rollback failed');
    throw err;
  }
}
