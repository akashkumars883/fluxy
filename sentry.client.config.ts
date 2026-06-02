import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use 1.0 for testing
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console when Sentry is initialized.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample fewer relationships in production
  replaysSessionSampleRate: 0.1,
});
