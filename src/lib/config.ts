import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { colors } from './ui.js';

// Config file names
export const GLOBAL_CONFIG_FILE = 'config.json';
export const LOCAL_CONFIG_FILE = '.envmark.json';
export const KEY_FILE = '.envmark.key';

/**
 * Global EnvMark configuration (stored in ~/.envmark/config.json)
 * Shared across all projects
 */
export interface GlobalConfig {
  /** Git remote URL for the secrets repository */
  remote: string;

  /** Default environment to use when none specified */
  defaultEnv?: string;

  /** Enable encryption by default */
  encrypt?: boolean;

  /** Custom environment aliases */
  envAliases?: Record<string, string>;
}

/**
 * Local project configuration (stored in .envmark.json in project root)
 * Project-specific settings
 */
export interface LocalConfig {
  /** Project name (used as folder name in the repo) */
  project: string;

  /** Override default environment for this project */
  defaultEnv?: string;

  /** Override encryption setting for this project */
  encrypt?: boolean;
}

/**
 * Merged configuration (global + local)
 */
export interface EnvMarkConfig {
  remote: string;
  project: string;
  defaultEnv: string;
  encrypt: boolean;
  envAliases: Record<string, string>;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Get the global .envmark directory path
 */
export function getEnvmarkDir(): string {
  return join(homedir(), '.envmark');
}

/**
 * Ensure the global .envmark directory exists
 */
export function ensureEnvmarkDir(): void {
  const dir = getEnvmarkDir();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Get global config file path
 */
export function getGlobalConfigPath(): string {
  return join(getEnvmarkDir(), GLOBAL_CONFIG_FILE);
}

/**
 * Get local config file path
 */
export function getLocalConfigPath(dir: string = process.cwd()): string {
  return join(dir, LOCAL_CONFIG_FILE);
}

/**
 * Get key file path (global)
 */
export function getKeyPath(): string {
  return join(getEnvmarkDir(), KEY_FILE);
}

/**
 * Check if global config exists
 */
export function globalConfigExists(): boolean {
  return existsSync(getGlobalConfigPath());
}

/**
 * Check if local config exists
 */
export function localConfigExists(dir: string = process.cwd()): boolean {
  return existsSync(getLocalConfigPath(dir));
}

/**
 * Check if encryption key exists
 */
export function keyExists(): boolean {
  return existsSync(getKeyPath());
}

/**
 * Check if a string is a valid Git URL
 */
function isValidGitUrl(url: string): boolean {
  // SSH format: git@github.com:user/repo.git
  const sshPattern = /^git@[\w.-]+:[\w./-]+\.git$/;
  // HTTPS format: https://github.com/user/repo.git
  const httpsPattern = /^https?:\/\/[\w.-]+\/[\w./-]+(\.git)?$/;

  return sshPattern.test(url) || httpsPattern.test(url);
}

/**
 * Validate global configuration
 */
export function validateGlobalConfig(config: unknown): ValidationResult {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Configuration must be an object'] };
  }

  const cfg = config as Record<string, unknown>;

  // Required fields
  if (!cfg.remote || typeof cfg.remote !== 'string') {
    errors.push('Missing or invalid "remote" field (Git repository URL)');
  } else if (!isValidGitUrl(cfg.remote)) {
    errors.push('Invalid Git URL format for "remote" field');
  }

  // Optional fields validation
  if (cfg.defaultEnv !== undefined && typeof cfg.defaultEnv !== 'string') {
    errors.push('"defaultEnv" must be a string');
  }

  if (cfg.encrypt !== undefined && typeof cfg.encrypt !== 'boolean') {
    errors.push('"encrypt" must be a boolean');
  }

  if (cfg.envAliases !== undefined) {
    if (typeof cfg.envAliases !== 'object' || cfg.envAliases === null) {
      errors.push('"envAliases" must be an object');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate local configuration
 */
export function validateLocalConfig(config: unknown): ValidationResult {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Configuration must be an object'] };
  }

  const cfg = config as Record<string, unknown>;

  // Required fields
  if (!cfg.project || typeof cfg.project !== 'string') {
    errors.push('Missing or invalid "project" field (project name)');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(cfg.project)) {
    errors.push('Project name can only contain letters, numbers, hyphens and underscores');
  }

  // Optional fields
  if (cfg.defaultEnv !== undefined && typeof cfg.defaultEnv !== 'string') {
    errors.push('"defaultEnv" must be a string');
  }

  if (cfg.encrypt !== undefined && typeof cfg.encrypt !== 'boolean') {
    errors.push('"encrypt" must be a boolean');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Load global configuration
 */
export function loadGlobalConfig(): GlobalConfig {
  const configPath = getGlobalConfigPath();

  if (!existsSync(configPath)) {
    throw new Error(
      `No global configuration found. Run ${colors.primary('envmark init')} to set up EnvMark.`
    );
  }

  let content: string;
  try {
    content = readFileSync(configPath, 'utf-8');
  } catch (err) {
    throw new Error(`Failed to read global config: ${(err as Error).message}`);
  }

  let config: unknown;
  try {
    config = JSON.parse(content);
  } catch (err) {
    throw new Error(`Invalid JSON in global config: ${(err as Error).message}`);
  }

  const validation = validateGlobalConfig(config);
  if (!validation.valid) {
    throw new Error(
      `Invalid global configuration:\n${validation.errors.map(e => `  - ${e}`).join('\n')}`
    );
  }

  return config as GlobalConfig;
}

/**
 * Save global configuration
 */
export function saveGlobalConfig(config: GlobalConfig): void {
  const validation = validateGlobalConfig(config);
  if (!validation.valid) {
    throw new Error(
      `Invalid global configuration:\n${validation.errors.map(e => `  - ${e}`).join('\n')}`
    );
  }

  ensureEnvmarkDir();
  const configPath = getGlobalConfigPath();
  const content = JSON.stringify(config, null, 2) + '\n';

  try {
    writeFileSync(configPath, content, 'utf-8');
  } catch (err) {
    throw new Error(`Failed to write global config: ${(err as Error).message}`);
  }
}

/**
 * Load local configuration
 */
export function loadLocalConfig(dir: string = process.cwd()): LocalConfig {
  const configPath = getLocalConfigPath(dir);

  if (!existsSync(configPath)) {
    throw new Error(
      `No ${LOCAL_CONFIG_FILE} found. Run ${colors.primary('envmark init')} in your project.`
    );
  }

  let content: string;
  try {
    content = readFileSync(configPath, 'utf-8');
  } catch (err) {
    throw new Error(`Failed to read ${LOCAL_CONFIG_FILE}: ${(err as Error).message}`);
  }

  let config: unknown;
  try {
    config = JSON.parse(content);
  } catch (err) {
    throw new Error(`Invalid JSON in ${LOCAL_CONFIG_FILE}: ${(err as Error).message}`);
  }

  const validation = validateLocalConfig(config);
  if (!validation.valid) {
    throw new Error(
      `Invalid local configuration:\n${validation.errors.map(e => `  - ${e}`).join('\n')}`
    );
  }

  return config as LocalConfig;
}

/**
 * Save local configuration
 */
export function saveLocalConfig(config: LocalConfig, dir: string = process.cwd()): void {
  const validation = validateLocalConfig(config);
  if (!validation.valid) {
    throw new Error(
      `Invalid local configuration:\n${validation.errors.map(e => `  - ${e}`).join('\n')}`
    );
  }

  const configPath = getLocalConfigPath(dir);
  const content = JSON.stringify(config, null, 2) + '\n';

  try {
    writeFileSync(configPath, content, 'utf-8');
  } catch (err) {
    throw new Error(`Failed to write ${LOCAL_CONFIG_FILE}: ${(err as Error).message}`);
  }
}

/**
 * Load merged configuration (global + local)
 */
export function loadConfig(dir: string = process.cwd()): EnvMarkConfig {
  const global = loadGlobalConfig();
  const local = loadLocalConfig(dir);

  return {
    remote: global.remote,
    project: local.project,
    defaultEnv: local.defaultEnv || global.defaultEnv || 'development',
    encrypt: local.encrypt ?? global.encrypt ?? false,
    envAliases: global.envAliases || {},
  };
}

/**
 * Create default global config
 */
export function createDefaultGlobalConfig(remote: string): GlobalConfig {
  return {
    remote,
    defaultEnv: 'development',
    encrypt: false,
  };
}

/**
 * Create default local config
 */
export function createDefaultLocalConfig(project: string): LocalConfig {
  return {
    project,
  };
}

/**
 * Load encryption key from file
 */
export function loadKey(): string | null {
  const keyPath = getKeyPath();

  if (!existsSync(keyPath)) {
    return null;
  }

  try {
    const content = readFileSync(keyPath, 'utf-8').trim();
    // Key format: ek_<base64 key>
    if (content.startsWith('ek_')) {
      return content.slice(3);
    }
    return content;
  } catch {
    return null;
  }
}

/**
 * Save encryption key to file
 */
export function saveKey(key: string): void {
  ensureEnvmarkDir();
  const keyPath = getKeyPath();
  const content = key.startsWith('ek_') ? key : `ek_${key}`;

  try {
    writeFileSync(keyPath, content + '\n', { encoding: 'utf-8', mode: 0o600 });
  } catch (err) {
    throw new Error(`Failed to write ${KEY_FILE}: ${(err as Error).message}`);
  }
}

/**
 * Get the .env file path for a project in the repo
 */
export function getEnvFilePath(projectName: string): string {
  return `${projectName}/.env`;
}
