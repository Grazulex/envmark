---
id: 38
title: Écrire les tests unitaires CLI - Crypto
status: To Do
priority: high
assignees: []
labels:
  - cli
  - tests
  - v1.0
subtasks: []
dependencies:
  - 21
blocked_by:
  - 41
created_date: '2025-12-09T20:20:08.838Z'
updated_date: '2025-12-09T20:34:20.654Z'
changelog:
  - timestamp: '2025-12-09T20:20:08.838Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:34:17.551Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:18.300Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:19.075Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:19.882Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:34:20.654Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Tests encrypt/decrypt roundtrip
    checked: false
  - text: Test IV unique à chaque chiffrement
    checked: false
  - text: Test erreur sur clé invalide
    checked: false
  - text: Test erreur sur données corrompues
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Écrire les tests unitaires pour le module crypto.

  ### Étapes
  1. Configurer Vitest
  2. Tester generateKey()
  3. Tester encrypt/decrypt roundtrip
  4. Tester unicité de l'IV
  5. Tester gestion des erreurs

  ### Fichiers concernés
  - `src/lib/__tests__/crypto.test.ts`

  ### Approche technique
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { generateKey, encrypt, decrypt } from '../crypto';

  describe('crypto', () => {
    it('generates key with ek_ prefix', () => {
      const key = generateKey();
      expect(key).toMatch(/^ek_[A-Za-z0-9+/=]+$/);
    });
    
    it('encrypts and decrypts correctly', () => {
      const key = generateKey();
      const plaintext = 'DB_HOST=localhost\nDB_PORT=5432';
      
      const encrypted = encrypt(plaintext, key);
      const decrypted = decrypt(encrypted, key);
      
      expect(decrypted).toBe(plaintext);
    });
    
    it('generates unique IV each time', () => {
      const key = generateKey();
      const plaintext = 'test';
      
      const enc1 = encrypt(plaintext, key);
      const enc2 = encrypt(plaintext, key);
      
      expect(enc1).not.toBe(enc2);
    });
    
    it('throws on invalid key', () => {
      const encrypted = encrypt('test', generateKey());
      expect(() => decrypt(encrypted, 'ek_invalid')).toThrow();
    });
  });
  ```
---
Tests Jest/Vitest pour le module de chiffrement. Tester: génération de clé, chiffrement/déchiffrement symétrique, vérification IV unique, format base64, gestion des erreurs (clé invalide, données corrompues).
