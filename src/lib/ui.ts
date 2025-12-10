import chalk from 'chalk';

// Brand colors for EnvMark
export const colors = {
  primary: chalk.hex('#10B981'),      // Emerald green
  secondary: chalk.hex('#6366F1'),    // Indigo
  success: chalk.hex('#22C55E'),      // Green
  warning: chalk.hex('#F59E0B'),      // Amber
  error: chalk.hex('#EF4444'),        // Red
  info: chalk.hex('#3B82F6'),         // Blue
  muted: chalk.hex('#6B7280'),        // Gray
  highlight: chalk.hex('#FBBF24'),    // Yellow
};

// Icons
export const icons = {
  success: colors.success('✔'),
  error: colors.error('✖'),
  warning: colors.warning('⚠'),
  info: colors.info('ℹ'),
  arrow: colors.primary('→'),
  bullet: colors.muted('•'),
  env: '🌍',
  lock: '🔒',
  unlock: '🔓',
  git: '📦',
  file: '📄',
  folder: '📁',
  key: '🔑',
  sync: '🔄',
  check: '✓',
  cross: '✗',
  added: colors.success('+'),
  removed: colors.error('-'),
  modified: colors.warning('~'),
};

// Box drawing
export const box = {
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',
  teeRight: '├',
  teeLeft: '┤',
};

// Formatted output helpers
export function header(text: string): void {
  const line = colors.muted(box.horizontal.repeat(70));
  console.log(line);
  console.log(colors.primary.bold(text));
  console.log(line);
}

export function subheader(text: string): void {
  console.log(colors.secondary.bold(`\n${text}`));
}

export function success(message: string): void {
  console.log(`${icons.success} ${message}`);
}

export function error(message: string): void {
  console.log(`${icons.error} ${colors.error(message)}`);
}

export function warning(message: string): void {
  console.log(`${icons.warning} ${colors.warning(message)}`);
}

export function info(message: string): void {
  console.log(`${icons.info} ${colors.info(message)}`);
}

export function log(message: string): void {
  console.log(message);
}

export function dim(message: string): void {
  console.log(colors.muted(message));
}

export function keyValue(key: string, value: string): void {
  console.log(`  ${colors.muted(key + ':')} ${value}`);
}

export function listItem(text: string, indent = 0): void {
  const prefix = '  '.repeat(indent);
  console.log(`${prefix}${icons.bullet} ${text}`);
}

export function divider(): void {
  console.log(colors.muted(box.horizontal.repeat(70)));
}

export function blank(): void {
  console.log('');
}

// Environment badge
export function envBadge(env: string): string {
  const envColors: Record<string, typeof chalk> = {
    production: colors.error,
    prod: colors.error,
    main: colors.error,
    staging: colors.warning,
    development: colors.success,
    dev: colors.success,
    qa: colors.info,
    test: colors.info,
  };

  const color = envColors[env.toLowerCase()] || colors.muted;
  return color(`[${env}]`);
}

// Banner for CLI startup
export function banner(): void {
  console.log(colors.primary(`
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║   ${colors.primary.bold('EnvMark')} ${colors.muted('- Manage .env files with Git')}                  ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝
`));
}

// Spinner text helpers
export function spinnerText(action: string, target?: string): string {
  if (target) {
    return `${action} ${colors.primary(target)}...`;
  }
  return `${action}...`;
}
