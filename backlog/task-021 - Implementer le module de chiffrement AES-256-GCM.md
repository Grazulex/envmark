---
id: 21
title: Implémenter le module de chiffrement AES-256-GCM
status: To Do
priority: critical
assignees: []
labels:
  - cli
  - crypto
  - security
  - v1.0
subtasks: []
dependencies:
  - 21
blocked_by:
  - 22
  - 26
  - 27
  - 28
  - 30
  - 38
created_date: '2025-12-09T20:16:32.333Z'
updated_date: '2025-12-09T20:29:01.182Z'
changelog:
  - timestamp: '2025-12-09T20:16:32.333Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:28:58.085Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:58.858Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:28:59.617Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:00.397Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:01.182Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Chiffrement AES-256-GCM fonctionnel
    checked: false
  - text: IV unique de 12 bytes généré à chaque chiffrement
    checked: false
  - text: 'Format sortie: IV + ciphertext + tag en base64'
    checked: false
  - text: Déchiffrement vérifie le tag d'authentification
    checked: false
ai_plan: >-
  ## Plan d'implémentation


  ### Objectif

  Implémenter le module de chiffrement AES-256-GCM en TypeScript.


  ### Étapes

  1. Créer le module `src/lib/crypto.ts`

  2. Implémenter generateKey() - clé 256 bits aléatoire

  3. Implémenter encrypt(plaintext, key) - retourne base64(IV + ciphertext +
  tag)

  4. Implémenter decrypt(encrypted, key) - extrait IV, déchiffre, vérifie tag

  5. Ajouter gestion d'erreurs (clé invalide, données corrompues)


  ### Fichiers concernés

  - `src/lib/crypto.ts`


  ### Approche technique

  ```typescript

  import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';


  const ALGORITHM = 'aes-256-gcm';

  const IV_LENGTH = 12;

  const TAG_LENGTH = 16;


  export function generateKey(): string {
    const key = randomBytes(32);
    return 'ek_' + key.toString('base64');
  }


  export function encrypt(plaintext: string, keyBase64: string): string {
    const key = Buffer.from(keyBase64.replace('ek_', ''), 'base64');
    const iv = randomBytes(IV_LENGTH);
    
    const cipher = createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    
    return Buffer.concat([iv, encrypted, tag]).toString('base64');
  }


  export function decrypt(encryptedBase64: string, keyBase64: string): string {
    const key = Buffer.from(keyBase64.replace('ek_', ''), 'base64');
    const data = Buffer.from(encryptedBase64, 'base64');
    
    const iv = data.subarray(0, IV_LENGTH);
    const tag = data.subarray(-TAG_LENGTH);
    const encrypted = data.subarray(IV_LENGTH, -TAG_LENGTH);
    
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    return decipher.update(encrypted) + decipher.final('utf8');
  }

  ```
---
Module crypto en Go pour chiffrer/déchiffrer avec AES-256-GCM. Fonctions: GenerateKey(), Encrypt(plaintext, key), Decrypt(ciphertext, key). IV aléatoire 12 bytes par opération. Format sortie: IV + ciphertext + tag encodé en base64.
