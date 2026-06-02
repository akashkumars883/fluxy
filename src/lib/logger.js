const isProd = process.env.NODE_ENV === "production";

export function log(...args) {
  if (!isProd) console.log(...args);
}

export function info(...args) {
  if (!isProd) console.info(...args);
}

export function warn(...args) {
  if (!isProd) console.warn(...args);
}

// Always surface errors so they can be captured by Sentry/logging in production
export function error(...args) {
  console.error(...args);
}

export default { log, info, warn, error };
