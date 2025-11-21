#!/usr/bin/env node

import "dotenv/config"
import { render } from "ink"
import App from "./App"

// Check if stdin supports raw mode (required for keyboard input)
if (!process.stdin.isTTY) {
  console.error("Error: This application requires an interactive terminal (TTY).")
  console.error("Please run it directly in your terminal, not through a pipe or redirect.")
  process.exit(1)
}

// Render the app
render(<App />)
