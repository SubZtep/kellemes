import { defineConfig } from "evalite/config"

export default defineConfig({
  setupFiles: ["./tests/setup/ollama-ready.ts", "./tests/setup/rag-ready.ts"],
  testTimeout: 60_000,
  trialCount: 3,
})
