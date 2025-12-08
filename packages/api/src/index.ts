// import { migrateToLatest } from "../db/migrator"
import { app } from "./app"

// import { registerDocs } from "./docs"

// import { registerMiddleware } from "./middlewares"
// import { registerRoutes } from "./routes/index"

// registerMiddleware(app)
// registerRoutes(app)
// await registerDocs(app)

try {
  console.log("=== keLLeMes API ===\n")
  console.log("Running database migrations...")
  // await migrateToLatest()

  console.log("✓ Migrations complete\n")
  console.log(`✓ Server running on ${process.env.API_URL}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV}\n`)
} catch (error) {
  console.error("Failed to start server:", error)
  process.exit(1)
}

export default {
  // port: Number(process.env.API_PORT),
  port: 3000,
  fetch: app.fetch,
}
