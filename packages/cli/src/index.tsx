import { render } from "ink"
import "dotenv/config"
import App from "./App"

// Check if stdin supports raw mode (required for keyboard input)
if (!process.stdin.isTTY) {
  console.error("Error: This application requires an interactive terminal (TTY).")
  console.error("Please run it directly in your terminal, not through a pipe or redirect.")
  process.exit(1)
}

// console.table({
//   node: globalThis.process?.versions?.node,
//   window: !!globalThis.window,
//   width: process.stdout.columns,
//   height: process.stdout.rows,
// })

render(<App />, {
  incrementalRendering: true,
  exitOnCtrlC: false,
  maxFps: 15,
})
