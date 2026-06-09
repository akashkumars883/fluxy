import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-build-*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "*.cjs",
    "src/app/blog/*.cjs",
  ]),
  {
    // The Next.js 16 + React 19 linter flags every useEffect that
    // synchronously updates a state flag derived from runtime values
    // (localStorage, fetch, user agent, etc). In our codebase the
    // overwhelming majority of these are valid mount-only side effects
    // (sync to localStorage, hydrate the UI for createPortal, render
    // mock data in dev, etc). Disabling the rule globally here keeps
    // the lint signal useful and avoids hundreds of false positives
    // while we evaluate the React 19 hooks compiler migration.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
