import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use 1.0 for testing
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console when Sentry is initialized.
  debug: false,
});
