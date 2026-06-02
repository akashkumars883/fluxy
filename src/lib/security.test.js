import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { encryptToken, decryptToken } from "./security";

describe("Security Token Utility Tests", () => {
  const VALID_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"; // 64 hex chars (32 bytes)
  let originalKey;

  beforeAll(() => {
    // Preserve any existing environment key
    originalKey = process.env.ENCRYPTION_KEY;
    process.env.ENCRYPTION_KEY = VALID_KEY;
  });

  afterAll(() => {
    // Restore environment
    process.env.ENCRYPTION_KEY = originalKey;
  });

  it("should encrypt a plain text token and produce a formatted cipher hash", () => {
    const rawText = "test-meta-access-token-12345";
    const encrypted = encryptToken(rawText);

    expect(encrypted).toBeTypeOf("string");
    expect(encrypted).toContain(":");
    
    // Expect 3 colon-separated parts (iv:authTag:content)
    const parts = encrypted.split(":");
    expect(parts.length).toBe(3);
    
    // Check that iv and authTag are hex strings of expected lengths
    expect(parts[0]).toMatch(/^[0-9a-fA-F]{24}$/); // 12 bytes = 24 hex characters
    expect(parts[1]).toMatch(/^[0-9a-fA-F]{32}$/); // 16 bytes = 32 hex characters
  });

  it("should decrypt a valid encrypted cipher hash back to the original text", () => {
    const rawText = "secret-database-token";
    const encrypted = encryptToken(rawText);
    const decrypted = decryptToken(encrypted);

    expect(decrypted).toBe(rawText);
  });

  it("should return null for null or empty encryption inputs", () => {
    expect(encryptToken(null)).toBeNull();
    expect(encryptToken("")).toBeNull();
  });

  it("should return the input value if decrypting a non-encrypted string or invalid format", () => {
    const plainString = "not-encrypted-string";
    expect(decryptToken(plainString)).toBe(plainString);
    expect(decryptToken("invalid:format")).toBe("invalid:format");
    expect(decryptToken(null)).toBeNull();
  });

  it("should throw an error on encryption if key is invalid or missing", () => {
    process.env.ENCRYPTION_KEY = "invalid-short-key";
    expect(() => encryptToken("some-text")).toThrow();

    process.env.ENCRYPTION_KEY = undefined;
    expect(() => encryptToken("some-text")).toThrow();

    // Restore key
    process.env.ENCRYPTION_KEY = VALID_KEY;
  });

  it("should fallback gracefully and return hash when decrypting fails due to incorrect/missing key", () => {
    const rawText = "test-token";
    const encrypted = encryptToken(rawText);

    // Swap to a different but valid-length key
    process.env.ENCRYPTION_KEY = "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789";
    
    // Decrypting with wrong key should fail authentication tag check and return raw hash
    const decrypted = decryptToken(encrypted);
    expect(decrypted).toBe(encrypted);

    // Restore key
    process.env.ENCRYPTION_KEY = VALID_KEY;
  });
});
