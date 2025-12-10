import { Command } from 'commander';
import ora from 'ora';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { loadConfig, getEnvFilePath } from '../lib/config.js';
import { GitManager, resolveEnvAlias } from '../lib/git.js';
import { colors, icons, header, success, error, info, keyValue, divider, blank, envBadge } from '../lib/ui.js';

export const pushCommand = new Command('push')
  .description('Push local .env file to the repository')
  .argument('[env]', 'Environment to push to (default: from config)')
  .option('-m, --message <msg>', 'Custom commit message')
  .option('-f, --force', 'Force push even if no changes detected')
  .action(async (env, options) => {
    try {
      await runPush(env, options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface PushOptions {
  message?: string;
  force?: boolean;
}

async function runPush(envArg: string | undefined, options: PushOptions): Promise<void> {
  // Load configuration
  const config = loadConfig();
  const env = envArg || config.defaultEnv;
  const branch = resolveEnvAlias(env);

  header(`Push to ${envBadge(env)}`);
  blank();

  // Check if .env file exists
  const envPath = join(process.cwd(), '.env');
  if (!existsSync(envPath)) {
    throw new Error(`No .env file found in current directory.\nCreate one or run ${colors.primary('envmark pull ' + env)} first.`);
  }

  // Read .env content
  const envContent = readFileSync(envPath, 'utf-8');

  // Show what we're doing
  info('Configuration:');
  keyValue('Project', config.project);
  keyValue('Environment', `${env} ${colors.muted(`(branch: ${branch})`)}`);
  keyValue('Remote', config.remote);
  blank();

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
      console.log(colors.muted(`Create it with: ${colors.primary(`envmark create ${env}`)}`));
      blank();
      process.exit(1);
    }

    await git.checkout(env);

    // Get current content to check for changes
    const envFilePath = getEnvFilePath(config.project);
    const currentContent = await git.readFile(envFilePath);

    if (currentContent === envContent && !options.force) {
      spinner.info('No changes detected');
      blank();
      console.log(colors.muted('Use --force to push anyway'));
      blank();
      return;
    }

    // Write and push
    spinner.text = 'Pushing changes...';

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const commitMessage = options.message || `Update ${config.project} .env [${timestamp}]`;

    await git.writeFileAndPush(envFilePath, envContent, commitMessage);

    spinner.succeed('Pushed successfully');
    blank();

    // Summary
    divider();
    success(`${icons.env} .env pushed to ${envBadge(env)}`);
    blank();
    keyValue('File', envFilePath);
    keyValue('Commit', commitMessage);
    blank();

  } catch (err) {
    spinner.fail('Push failed');
    throw err;
  }
}
