// Encrypt the private report before it crosses the Actions job boundary.
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function keyFromEnv(value) {
  if (!/^[A-Za-z0-9+/]{43}=$/.test(value ?? "")) {
    throw new Error("REPORT_TRANSFER_KEY must be a base64-encoded 32-byte key.");
  }
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("REPORT_TRANSFER_KEY must be a base64-encoded 32-byte key.");
  return key;
}

export function sealReport(report, transferKey) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFromEnv(transferKey), iv);
  const data = Buffer.concat([cipher.update(report, "utf8"), cipher.final()]);
  return JSON.stringify({ version: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") });
}

export function openReport(envelope, transferKey) {
  try {
    const { version, iv, tag, data } = JSON.parse(envelope);
    if (version !== 1 || typeof iv !== "string" || typeof tag !== "string" || typeof data !== "string") throw new Error();
    const nonce = Buffer.from(iv, "base64");
    const authTag = Buffer.from(tag, "base64");
    if (nonce.length !== 12 || authTag.length !== 16) throw new Error();
    const decipher = createDecipheriv("aes-256-gcm", keyFromEnv(transferKey), nonce);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8");
  } catch {
    throw new Error("The encrypted daily report could not be opened; refusing delivery.");
  }
}
