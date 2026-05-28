import dns from "node:dns/promises";
import net from "node:net";

const BLOCKED_HOSTS = new Set(["localhost", "0.0.0.0"]);

function isPrivateIp(host) {
  const ipVersion = net.isIP(host);
  if (!ipVersion) return false;

  if (ipVersion === 6) {
    const normalized = host.toLowerCase();
    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80:")
    );
  }

  const parts = host.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;
  const [a, b] = parts;

  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

export async function validatePublicWebhookUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, error: "Invalid webhook URL." };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { ok: false, error: "Webhook URL must use http or https." };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(hostname) || isPrivateIp(hostname)) {
    return { ok: false, error: "Webhook URL must be a public endpoint." };
  }

  try {
    const addresses = await dns.lookup(hostname, { all: true });
    if (addresses.some((entry) => isPrivateIp(entry.address))) {
      return { ok: false, error: "Webhook URL cannot resolve to a private network." };
    }
  } catch {
    return { ok: false, error: "Could not resolve webhook hostname." };
  }

  return { ok: true, url: parsed.toString() };
}
