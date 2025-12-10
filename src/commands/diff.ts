import { Command } from 'commander';
import ora from 'ora';
import { loadConfig, getEnvFilePath } from '../lib/config.js';
import { GitManager, resolveEnvAlias } from '../lib/git.js';
import { colors, icons, header, error, info, warning, keyValue, blank, envBadge, divider } from '../lib/ui.js';

export const diffCommand = new Command('diff')
  .description('Compare .env files between two environments')
  .argument('<env1>', 'First environment')
  .argument('<env2>', 'Second environment')
  .option('-k, --keys-only', 'Only show key differences, not values')
  .action(async (env1, env2, options) => {
    try {
      await runDiff(env1, env2, options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface DiffOptions {
  keysOnly?: boolean;
}

interface EnvVars {
  [key: string]: string;
}

function parseEnvFile(content: string): EnvVars {
  const vars: EnvVars = {};
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim();
    vars[key] = value;
  }

  return vars;
}

async function runDiff(env1: string, env2: string, options: DiffOptions): Promise<void> {
  const config = loadConfig();
  const branch1 = resolveEnvAlias(env1);
  const branch2 = resolveEnvAlias(env2);

  header(`Diff: ${envBadge(env1)} vs ${envBadge(env2)}`);
  blank();

  info('Configuration:');
  keyValue('Project', config.project);
  keyValue('Comparing', `${env1} (${branch1}) ↔ ${env2} (${branch2})`);
  blank();

  const spinner = ora('Fetching environments...').start();

  try {
    const git = new GitManager({ remote: config.remote, verbose: false });
    await git.ensureRepo();

    const envFilePath = getEnvFilePath(config.project);

    // Check if branches exist
    const exists1 = await git.branchExists(env1);
    const exists2 = await git.branchExists(env2);

    if (!exists1) {
      spinner.fail(`Environment '${env1}' does not exist`);
      return;
    }
    if (!exists2) {
      spinner.fail(`Environment '${env2}' does not exist`);
      return;
    }

    // Get content from both branches
    spinner.text = `Reading ${env1}...`;
    await git.checkout(env1);
    const content1 = await git.readFile(envFilePath);

    spinner.text = `Reading ${env2}...`;
    await git.checkout(env2);
    const content2 = await git.readFile(envFilePath);

    spinner.stop();

    if (content1 === null && content2 === null) {
      warning(`No .env file found in either environment for project '${config.project}'`);
      blank();
      return;
    }

    const vars1 = content1 ? parseEnvFile(content1) : {};
    const vars2 = content2 ? parseEnvFile(content2) : {};

    const allKeys = new Set([...Object.keys(vars1), ...Object.keys(vars2)]);
    const sortedKeys = Array.from(allKeys).sort();

    // Categorize differences
    const onlyIn1: string[] = [];
    const onlyIn2: string[] = [];
    const different: string[] = [];
    const same: string[] = [];

    for (const key of sortedKeys) {
      const in1 = key in vars1;
      const in2 = key in vars2;

      if (in1 && !in2) {
        onlyIn1.push(key);
      } else if (!in1 && in2) {
        onlyIn2.push(key);
      } else if (vars1[key] !== vars2[key]) {
        different.push(key);
      } else {
        same.push(key);
      }
    }

    // Display results
    divider();
    blank();

    if (onlyIn1.length === 0 && onlyIn2.length === 0 && different.length === 0) {
      console.log(colors.success(`${icons.success} Environments are identical`));
      console.log(colors.muted(`  ${same.length} key(s) with same values`));
      blank();
      return;
    }

    // Keys only in env1
    if (onlyIn1.length > 0) {
      console.log(colors.error(`${icons.removed} Only in ${env1}:`));
      for (const key of onlyIn1) {
        if (options.keysOnly) {
          console.log(colors.error(`  - ${key}`));
        } else {
          console.log(colors.error(`  - ${key}=${maskValue(vars1[key])}`));
        }
      }
      blank();
    }

    // Keys only in env2
    if (onlyIn2.length > 0) {
      console.log(colors.success(`${icons.added} Only in ${env2}:`));
      for (const key of onlyIn2) {
        if (options.keysOnly) {
          console.log(colors.success(`  + ${key}`));
        } else {
          console.log(colors.success(`  + ${key}=${maskValue(vars2[key])}`));
        }
      }
      blank();
    }

    // Keys with different values
    if (different.length > 0) {
      console.log(colors.warning(`${icons.modified} Different values:`));
      for (const key of different) {
        console.log(colors.warning(`  ~ ${key}`));
        if (!options.keysOnly) {
          console.log(colors.error(`    ${env1}: ${maskValue(vars1[key])}`));
          console.log(colors.success(`    ${env2}: ${maskValue(vars2[key])}`));
        }
      }
      blank();
    }

    // Summary
    divider();
    console.log(colors.muted('Summary:'));
    console.log(colors.muted(`  ${icons.bullet} Only in ${env1}: ${onlyIn1.length}`));
    console.log(colors.muted(`  ${icons.bullet} Only in ${env2}: ${onlyIn2.length}`));
    console.log(colors.muted(`  ${icons.bullet} Different values: ${different.length}`));
    console.log(colors.muted(`  ${icons.bullet} Same: ${same.length}`));
    blank();

  } catch (err) {
    spinner.fail('Diff failed');
    throw err;
  }
}

function maskValue(value: string): string {
  if (value.length <= 4) {
    return '****';
  }
  return value.substring(0, 2) + '****' + value.substring(value.length - 2);
}
