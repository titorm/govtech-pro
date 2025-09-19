import { createHash, randomBytes, createCipher, createDecipher } from "crypto";

/**
 * Cryptographic utilities for security and data protection
 */

export function generateHash(
  data: string,
  algorithm: "sha256" | "sha512" = "sha256"
): string {
  return createHash(algorithm).update(data).digest("hex");
}

export function generateSalt(length: number = 32): string {
  return randomBytes(length).toString("hex");
}

export function hashWithSalt(data: string, salt: string): string {
  return generateHash(data + salt);
}

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("base64url");
}

export function generateApiKey(): string {
  const prefix = "gtp_"; // GovTech Pro prefix
  const key = randomBytes(32).toString("base64url");
  return prefix + key;
}

export function maskSensitiveData(
  data: string,
  visibleChars: number = 4
): string {
  if (data.length <= visibleChars * 2) return data;

  const start = data.slice(0, visibleChars);
  const end = data.slice(-visibleChars);
  const middle = "*".repeat(data.length - visibleChars * 2);

  return start + middle + end;
}

export function generateDocumentHash(content: Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

export function verifyDocumentIntegrity(
  content: Buffer,
  expectedHash: string
): boolean {
  const actualHash = generateDocumentHash(content);
  return actualHash === expectedHash;
}

// Simple encryption for non-critical data (use proper encryption for sensitive data)
export function simpleEncrypt(text: string, key: string): string {
  const cipher = createCipher("aes192", key);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function simpleDecrypt(encryptedText: string, key: string): string {
  const decipher = createDecipher("aes192", key);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function generateChecksum(data: string): string {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data.charCodeAt(i);
  }
  return (sum % 1000).toString().padStart(3, "0");
}

export function validateChecksum(data: string, checksum: string): boolean {
  return generateChecksum(data) === checksum;
}
