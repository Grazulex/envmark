import { Command } from 'commander';
import ora from 'ora';
import inquirer from 'inquirer';
import { loadGlobalConfig } from '../lib/config.js';
import { GitManager } from '../lib/git.js';
import { colors, icons, header, success, error, info, keyValue, divider, blank, envBadge } from '../lib/ui.js';

export const createCommand = new Command('create')
  .description('Create a new environment (branch)')
  .argument('<env>', 'Name of the environment to create')
  .option('-b, --base <branch>', 'Base branch to create from', 'main')
  .action(async (env, options) => {
    try {
      await runCreate(env, options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface CreateOptions {
  base: string;
}

async function runCreate(env: string, options: CreateOptions): Promise<void> {
  // Validate environment name
  if (!/^[a-zA-Z0-9_-]+$/.test(env)) {
    throw new Error('Environment name can only contain letters, numbers, hyphens and underscores');
  }

  // Reserved names
  const reserved = ['main', 'master', 'HEAD'];
  if (reserved.includes(env)) {
    throw new Error(`'${env}' is a reserved name and cannot be used`);
  }

  header(`Create Environment`);
  blank();

  // Load global config
  const config = loadGlobalConfig();

  info('Configuration:');
  keyValue('Remote', config.remote);
  keyValue('New environment', env);
  keyValue('Based on', options.base);
  blank();

  // Initialize Git manager
  const spinner = ora('Connecting to repository...').start();

  try {
    const git = new GitManager({ remote: config.remote, verbose: false });

    // Ensure repo is available
    spinner.text = 'Syncing repository...';
    await git.ensureRepo();

    // Check if branch already exists
    spinner.text = 'Checking existing environments...';
    const exists = await git.branchExists(env);

    if (exists) {
      spinner.fail(`Environment '${env}' already exists`);
      blank();
      return;
    }

    // Check if base branch exists
    const baseExists = await git.branchExists(options.base);
    if (!baseExists) {
      spinner.fail(`Base environment '${options.base}' does not exist`);
      blank();

      const branches = await git.listBranches();
      if (branches.length > 0) {
        console.log(colors.muted('Available environments:'));
        branches.forEach(b => {
          console.log(colors.muted(`  ${icons.bullet} ${b}`));
        });
        blank();
      }
      return;
    }

    // Confirm creation
    spinner.stop();
    blank();

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Create environment '${env}' based on '${options.base}'?`,
        default: true,
      },
    ]);

    if (!confirm) {
      info('Creation cancelled');
      return;
    }

    // Create the branch
    const createSpinner = ora(`Creating environment '${env}'...`).start();
    await git.createBranch(env, options.base);
    createSpinner.succeed(`Environment '${env}' created`);

    blank();
    divider();
    success(`${icons.env} Environment ${envBadge(env)} created successfully`);
    blank();

    console.log(colors.muted('Next steps:'));
    console.log(colors.muted(`  ${icons.arrow} Run ${colors.primary(`envmark push ${env}`)} to push .env to this environment`));
    console.log(colors.muted(`  ${icons.arrow} Run ${colors.primary(`envmark pull ${env}`)} to pull .env from this environment`));
    blank();

  } catch (err) {
    spinner.fail('Failed to create environment');
    throw err;
  }
}
