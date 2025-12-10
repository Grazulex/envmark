import { describe, it, expect } from 'vitest';
import {
  generateKey,
  encrypt,
  decrypt,
  encryptToString,
  decryptFromString,
  isEncrypted,
} from '../lib/crypto.js';

describe('Crypto Module', () => {
  describe('generateKey', () => {
    it('should generate a key starting with ek_', () => {
      const key = generateKey();
      expect(key).toMatch(/^ek_/);
    });

    it('should generate unique keys', () => {
      const key1 = generateKey();
      const key2 = generateKey();
      expect(key1).not.toBe(key2);
    });

    it('should generate keys with correct length', () => {
      const key = generateKey();
      // ek_ prefix + 32 bytes in base64 (44 chars)
      expect(key.length).toBeGreaterThan(40);
    });
  });

  describe('encrypt/decrypt', () => {
    const testKey = generateKey();
    const testContent = 'APP_NAME=TestApp\nDB_HOST=localhost\nSECRET=super-secret-123';

    it('should encrypt content', () => {
      const encrypted = encrypt(testContent, testKey);

      expect(encrypted).toHaveProperty('iv');
      expect(encrypted).toHaveProperty('data');
      expect(encrypted).toHaveProperty('tag');
      expect(encrypted.data).not.toBe(testContent);
    });

    it('should decrypt content back to original', () => {
      const encrypted = encrypt(testContent, testKey);
      const decrypted = decrypt(encrypted, testKey);

      expect(decrypted).toBe(testContent);
    });

    it('should produce different ciphertexts for same content (random IV)', () => {
      const encrypted1 = encrypt(testContent, testKey);
      const encrypted2 = encrypt(testContent, testKey);

      expect(encrypted1.iv).not.toBe(encrypted2.iv);
      expect(encrypted1.data).not.toBe(encrypted2.data);
    });

    it('should fail to decrypt with wrong key', () => {
      const encrypted = encrypt(testContent, testKey);
      const wrongKey = generateKey();

      expect(() => decrypt(encrypted, wrongKey)).toThrow();
    });
  });

  describe('encryptToString/decryptFromString', () => {
    const testKey = generateKey();
    const testContent = 'API_KEY=abc123\nDATABASE_URL=postgres://localhost';

    it('should encrypt to a string format iv:tag:data', () => {
      const encrypted = encryptToString(testContent, testKey);
      const parts = encrypted.split(':');

      expect(parts.length).toBe(3);
    });

    it('should decrypt from string format', () => {
      const encrypted = encryptToString(testContent, testKey);
      const decrypted = decryptFromString(encrypted, testKey);

      expect(decrypted).toBe(testContent);
    });

    it('should handle multiline content', () => {
      const multilineContent = `
APP_NAME=MyApp
APP_ENV=production
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=secret
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
      `.trim();

      const encrypted = encryptToString(multilineContent, testKey);
      const decrypted = decryptFromString(encrypted, testKey);

      expect(decrypted).toBe(multilineContent);
    });

    it('should handle special characters', () => {
      const specialContent = 'PASSWORD=p@$$w0rd!#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = encryptToString(specialContent, testKey);
      const decrypted = decryptFromString(encrypted, testKey);

      expect(decrypted).toBe(specialContent);
    });

    it('should handle unicode characters', () => {
      const unicodeContent = 'MESSAGE=Hello 世界 🌍 émojis';
      const encrypted = encryptToString(unicodeContent, testKey);
      const decrypted = decryptFromString(encrypted, testKey);

      expect(decrypted).toBe(unicodeContent);
    });

    it('should throw on invalid encrypted string format', () => {
      expect(() => decryptFromString('invalid', testKey)).toThrow();
      expect(() => decryptFromString('only:two', testKey)).toThrow();
    });
  });

  describe('isEncrypted', () => {
    const testKey = generateKey();

    it('should return true for encrypted content', () => {
      const encrypted = encryptToString('test content', testKey);
      expect(isEncrypted(encrypted)).toBe(true);
    });

    it('should return false for plain text', () => {
      expect(isEncrypted('APP_NAME=Test')).toBe(false);
      expect(isEncrypted('just some text')).toBe(false);
    });

    it('should return false for .env file content', () => {
      const envContent = `
APP_NAME=MyApp
APP_ENV=local
DB_HOST=localhost
      `.trim();
      expect(isEncrypted(envContent)).toBe(false);
    });

    it('should return false for content that does not match encrypted format', () => {
      // Only 2 parts, not 3
      expect(isEncrypted('part1:part2')).toBe(false);
      // Single value
      expect(isEncrypted('noColonsHere')).toBe(false);
    });
  });

  describe('key validation', () => {
    it('should throw on invalid key format', () => {
      expect(() => encrypt('test', 'invalid-key')).toThrow();
      expect(() => encrypt('test', 'ek_short')).toThrow();
    });

    it('should accept keys without ek_ prefix', () => {
      const key = generateKey();
      const keyWithoutPrefix = key.slice(3);

      const encrypted = encryptToString('test', keyWithoutPrefix);
      const decrypted = decryptFromString(encrypted, keyWithoutPrefix);

      expect(decrypted).toBe('test');
    });
  });
});
