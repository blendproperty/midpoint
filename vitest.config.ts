import { defineConfig } from "vitest/config";
import path from "path";

// Unit-test config for the pure/business-logic layer (lib/*.ts) —
// deliberately not a full browser e2e setup. This targets the modules that
// have broken or needed careful review this project already: rate limiting,
// reCAPTCHA verification, password-reset token hashing, and SEO scoring.
// Runs in plain Node, no browser, no live database required.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
