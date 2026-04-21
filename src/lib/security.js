import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH_BYTES = 12; // GCM standard IV size is 12 bytes
const AUTH_TAG_LENGTH_BYTES = 16;

function getKey() {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex) return null;

  // AES-256-GCM needs 32 bytes (64 hex chars)
  if (keyHex.length !== 64) return null;
  if (!/^[0-9a-fA-F]+$/.test(keyHex)) return null;

  return Buffer.from(keyHex, "hex");
}

/**
 * 1. Token Encrypt karne ke liye
 */
export function encryptToken(text) {
  if (!text) return null;

  const key = getKey();
  if (!key) {
    throw new Error("Invalid ENCRYPTION_KEY (must be 64 hex chars for AES-256-GCM).");
  }

  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:encryptedContent
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * 2. Token Decrypt karne ke liye
 */
export function decryptToken(hash) {
  if (!hash || !hash.includes(":")) return hash; // Agar already decrypt ho ya format galat ho

  try {
    const key = getKey();
    if (!key) return hash;

    const parts = hash.split(":");
    if (parts.length !== 3) return hash;

    const [ivHex, authTagHex, encryptedText] = parts;
    
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    if (iv.length !== IV_LENGTH_BYTES) return hash;
    if (authTag.length !== AUTH_TAG_LENGTH_BYTES) return hash;

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
  } catch (error) {
    console.error("Decryption Error:", error.message);
    // Agar decryption fail hoti hai (e.g. wrong key), toh shayad ye pichla plain token hai
    return hash; 
  }
}
