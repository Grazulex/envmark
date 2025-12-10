import { Command } from 'commander';
import ora from 'ora';
import inquirer from 'inquirer';
import { loadGlobalConfig, loadLocalConfig, localConfigExists, getEnvFilePath } from '../lib/config.js';
import { GitManager, resolveEnvAlias } from '../lib/git.js';
import { colors, icons, header, success, error, info, warning, keyValue, blank, envBadge, divider } from '../lib/ui.js';

export const deleteCommand = new Command('delete')
  .alias('rm')
  .description('Delete an environment or project .env file')
  .argument('<target>', 'Environment name or "project" to delete project .env')
  .option('--env', 'Delete the environment (branch)')
  .option('--project-env <env>', 'Delete project .env from specific environment')
  .option('-f, --force', 'Skip confirmation')
  .action(async (target, options) => {
    try {
      await runDelete(target, options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface DeleteOptions {
  env?: boolean;
  projectEnv?: string;
  force?: boolean;
}

async function runDelete(target: string, options: DeleteOptions): Promise<void> {
  const config = loadGlobalConfig();

  // Determine what to delete
  if (options.env) {
    await deleteEnvironment(target, config.remote, options.force);
  } else if (options.projectEnv || target === 'project') {
    if (!localConfigExists()) {
      throw new Error('No project configuration found. Run "envmark init" first.');
    }
    const localConfig = loadLocalConfig();
    const env = options.projectEnv || 'all';
    await deleteProjectEnv(localConfig.project, env, config.remote, options.force);
  } else {
    // Default: try to delete environment
    await deleteEnvironment(target, config.remote, options.force);
  }
}

async function deleteEnvironment(env: string, remote: string, force?: boolean): Promise<void> {
  const branch = resolveEnvAlias(env);

  // Prevent deleting main/master
  if (branch === 'main' || branch === 'master') {
    throw new Error('Cannot delete the main/master branch (production environment)');
  }

  header(`Delete Environment`);
  blank();

  info('Configuration:');
  keyValue('Environment', envBadge(env));
  keyValue('Branch', branch);
  blank();

  const spinner = ora('Checking environment...').start();

  try {
    const git = new GitManager({ remote, verbose: false });
    await git.ensureRepo();

    // Check if branch exists
    const exists = await git.branchExists(env);
    if (!exists) {
      spinner.fail(`Environment '${env}' does not exist`);
      blank();
      return;
    }

    spinner.stop();

    // Confirm deletion
    if (!force) {
      blank();
      warning('This will permanently delete the environment and all its .env files!');
      blank();

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: `Are you sure you want to delete '${env}'?`,
          default: false,
        },
      ]);

      if (!confirm) {
        info('Deletion cancelled');
        return;
      }
    }

    // Delete the branch
    const deleteSpinner = ora(`Deleting environment '${env}'...`).start();
    await git.deleteBranch(env);
    deleteSpinner.succeed(`Environment '${env}' deleted`);

    blank();
    divider();
    success(`${icons.removed} Environment ${envBadge(env)} deleted`);
    blank();

  } catch (err) {
    spinner.fail('Failed to delete environment');
    throw err;
  }
}

async function deleteProjectEnv(project: string, env: string, remote: string, force?: boolean): Promise<void> {
  header(`Delete Project .env`);
  blank();

  info('Configuration:');
  keyValue('Project', project);
  keyValue('Environment', env === 'all' ? 'all environments' : envBadge(env));
  blank();

  const spinner = ora('Connecting to repository...').start();

  try {
    const git = new GitManager({ remote, verbose: false });
    await git.ensureRepo();

    const branches = await git.listBranches();
    const targetBranches = env === 'all' ? branches : [resolveEnvAlias(env)];

    // Check which branches have the project
    const branchesWithProject: string[] = [];
    for (const branch of targetBranches) {
      if (!branches.includes(branch)) continue;
      await git.checkout(branch);
      const content = await git.readFile(getEnvFilePath(project));
      if (content !== null) {
        branchesWithProject.push(branch);
      }
    }

    spinner.stop();

    if (branchesWithProject.length === 0) {
      warning(`No .env files found for project '${project}'`);
      blank();
      return;
    }

    // Confirm deletion
    if (!force) {
      blank();
      warning(`This will delete .env for '${project}' from:`);
      for (const b of branchesWithProject) {
        console.log(colors.warning(`  ${icons.bullet} ${b}`));
      }
      blank();

      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: 'Are you sure?',
          default: false,
        },
      ]);

      if (!confirm) {
        info('Deletion cancelled');
        return;
      }
    }

    // Delete from each branch
    const deleteSpinner = ora('Deleting...').start();
    for (const branch of branchesWithProject) {
      deleteSpinner.text = `Deleting from ${branch}...`;
      await git.checkout(branch);
      await git.deleteFileAndPush(
        getEnvFilePath(project),
        `Delete ${project} .env`
      );
    }
    deleteSpinner.succeed(`Deleted from ${branchesWithProject.length} environment(s)`);

    blank();
    divider();
    success(`${icons.removed} Project '${project}' .env deleted`);
    blank();

  } catch (err) {
    spinner.fail('Failed to delete');
    throw err;
  }
}
