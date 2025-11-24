// import { withFullScreen } from "fullscreen-ink"
import { render } from "ink"
// import ollama from "ollama"
import "dotenv/config"
import App from "./App"

// Check if stdin supports raw mode (required for keyboard input)
if (!process.stdin.isTTY) {
  console.error("Error: This application requires an interactive terminal (TTY).")
  console.error("Please run it directly in your terminal, not through a pipe or redirect.")
  process.exit(1)
}

console.log({
  isTTY: process.stdin.isTTY,
  width: process.stdout.columns,
  height: process.stdout.rows,
})

// // Check if Ollama is installed
// try {
//   await ollama.version()
// } catch (error: any) {
//   console.error("Error: Ollama required for this application.", error.message)
//   console.log("Please install Ollama and try again. https://ollama.com/")
//   process.exit(1)
// }

// withFullScreen(<App />, { exitOnCtrlC: false }).start()
render(<App />, { exitOnCtrlC: false })
