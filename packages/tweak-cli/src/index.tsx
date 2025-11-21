import "dotenv/config"
import { withFullScreen } from "fullscreen-ink"
import ollama from "ollama"
import App from "./App"

// Check if stdin supports raw mode (required for keyboard input)
if (!process.stdin.isTTY) {
  console.error("Error: This application requires an interactive terminal (TTY).")
  console.error("Please run it directly in your terminal, not through a pipe or redirect.")
  process.exit(1)
}

const version = await ollama.version()
console.log(`Ollama version: ${version.version}`, version)

// Render the app
withFullScreen(<App />, { exitOnCtrlC: false }).start()
// render(<App />)
