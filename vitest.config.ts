import { fileURLToPath } from "node:url"
import { defineConfig, configDefaults } from "vitest/config"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": __dirname,
    },
  },
  test: {
    environment: "node",
    // Don't scan agent git worktrees (created under .claude/worktrees by
    // isolation runs) — their stale test copies would pollute the suite.
    exclude: [...configDefaults.exclude, "**/.claude/**"],
  },
})
