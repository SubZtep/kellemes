const path = require("node:path")

const repoRoot = __dirname

const toRepoFile = repoRelativePath => {
  const absolutePath = path.resolve(repoRoot, repoRelativePath)
  const fromPackage = path.relative(process.cwd(), absolutePath)
  return fromPackage === "" ? repoRelativePath : fromPackage
}

const uniqueAssets = assets => [...new Set(assets.filter(Boolean))]

module.exports = {
  branches: ["main"],
  extends: "semantic-release-monorepo",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: toRepoFile("CHANGELOG.md"),
      },
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: uniqueAssets(["package.json", toRepoFile("pnpm-lock.yaml"), toRepoFile("CHANGELOG.md")]),
        // biome-ignore lint/suspicious/noTemplateCurlyInString: <>
        message: "chore(release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/github",
  ],
}
