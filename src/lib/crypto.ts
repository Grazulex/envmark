import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

export interface EncryptedData {
  iv: string;       // Base64 encoded IV
  data: string;     // Base64 encoded encrypted data
  tag: string;      // Base64 encoded auth tag
}

/**
 * Generate a new AES-256 key
 */
export function generateKey(): string {
  const key = randomBytes(KEY_LENGTH);
  return `ek_${key.toString('base64')}`;
}

/**
 * Parse a key string (removes ek_ prefix)
 */
function parseKey(keyString: string): Buffer {
  const base64Key = keyString.startsWith('ek_')
    ? keyString.slice(3)
    : keyString;

  const key = Buffer.from(base64Key, 'base64');

  if (key.length !== KEY_LENGTH) {
    throw new Error(`Invalid key length: expected ${KEY_LENGTH} bytes, got ${key.length}`);
  }

  return key;
}

/**
 * Encrypt content using AES-256-GCM
 */
export function encrypt(content: string, keyString: string): EncryptedData {
  const key = parseKey(keyString);
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(content, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    data: encrypted,
    tag: authTag.toString('base64'),
  };
}

/**
 * Decrypt content using AES-256-GCM
 */
export function decrypt(encryptedData: EncryptedData, keyString: string): string {
  const key = parseKey(keyString);
  const iv = Buffer.from(encryptedData.iv, 'base64');
  const authTag = Buffer.from(encryptedData.tag, 'base64');

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData.data, 'base64', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Encrypt content and return as a single string (for storage)
 * Format: base64(iv):base64(tag):base64(data)
 */
export function encryptToString(content: string, keyString: string): string {
  const encrypted = encrypt(content, keyString);
  return `${encrypted.iv}:${encrypted.tag}:${encrypted.data}`;
}

/**
 * Decrypt from a single string format
 */
export function decryptFromString(encryptedString: string, keyString: string): string {
  const parts = encryptedString.split(':');

  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const encryptedData: EncryptedData = {
    iv: parts[0],
    tag: parts[1],
    data: parts[2],
  };

  return decrypt(encryptedData, keyString);
}

/**
 * Check if content looks like encrypted data
 */
export function isEncrypted(content: string): boolean {
  const parts = content.trim().split(':');
  if (parts.length !== 3) return false;

  // Check if all parts are valid base64
  try {
    for (const part of parts) {
      Buffer.from(part, 'base64');
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the path to the project key file
 */
export function getKeyFilePath(projectName: string): string {
  const envmarkDir = join(homedir(), '.envmark');
  return join(envmarkDir, 'keys', `${projectName}.key`);
}

/**
 * Save a key to the key file
 */
export function saveKey(projectName: string, key: string): void {
  const keyPath = getKeyFilePath(projectName);
  const keysDir = join(homedir(), '.envmark', 'keys');

  if (!existsSync(keysDir)) {
    mkdirSync(keysDir, { recursive: true });
  }

  writeFileSync(keyPath, key, { mode: 0o600 }); // Read/write only for owner
}

/**
 * Load a key from the key file
 */
export function loadKey(projectName: string): string | null {
  const keyPath = getKeyFilePath(projectName);

  if (!existsSync(keyPath)) {
    return null;
  }

  return readFileSync(keyPath, 'utf-8').trim();
}

/**
 * Check if a key exists for a project
 */
export function keyExists(projectName: string): boolean {
  return existsSync(getKeyFilePath(projectName));
}

/**
 * Delete a key file
 */
export function deleteKey(projectName: string): boolean {
  const keyPath = getKeyFilePath(projectName);

  if (existsSync(keyPath)) {
    unlinkSync(keyPath);
    return true;
  }

  return false;
}
