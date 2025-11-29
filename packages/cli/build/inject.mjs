import { execSync } from "node:child_process"
import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import { platform } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const distDir = join(root, "dist")
const blob = join(distDir, "app.blob")
const output = join(distDir, platform() === "win32" ? "app.exe" : "app")

console.log("🔍 Root:", root)
console.log("🔍 Dist dir:", distDir)
// console.log("🔍 Blob:", blob)
console.log("🔍 Output:", output)

// Ensure dist exists
if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true })

// Real Node binary
let nodeBinary
if (platform() === "darwin" || platform() === "linux") {
  nodeBinary = execSync("readlink -f $(which node) || which node", { encoding: "utf-8" }).trim()
} else {
  nodeBinary = process.execPath
}

// Copy Node
copyFileSync(nodeBinary, output)

// Inject SEA blob
execSync(`npx postject "${output}" NODE_SEA_BLOB "${blob}" --sentinel-fuse node:sea`, { stdio: "inherit" })

console.log(`✅ SEA binary built at ${output}`)
