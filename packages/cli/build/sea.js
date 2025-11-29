#!/usr/bin/env node
;(async () => {
  const { main } = await import("./dist/index.js")
  await main()
})()
