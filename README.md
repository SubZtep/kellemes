> ##
>
> ## Work In Progress :construction:
>
> ---
>
> ##

# :rainbow::sparkler: keLLeMes, the untouchable :love_letter:

An [Ollama](https://ollama.com) based TypeScript Retrieval-Augmented Generation (RAG) system for a keLLeMes chatbot. This system uses vector embeddings and semantic search to provide context-aware responses based on a knowledge base.

> The [rest of](https://subztep.github.io/kellemes) the ~~docs~~ are a work in progress.

## Prerequisites

**Setup [MISE-EN-PLACE](https://mise.jdx.dev/)** in the dev environment to handle tool version management.

## Configuration

All required environment variable defaults are in [`mise.toml`](mise.toml#L1), without change any of them the rig should work with empty data.

****
If you want to override any of them, create a `.env` file with the updated values.

## Terminal Commands

Run these commands from the project root:

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `pnpm i`                | Install dependencies for all packages |
| `pnpm build`            | Build all packages                    |
| `pnpm lint`             | Code lint all packages                |
| `pnpm typecheck`        | Type calidity check all packages      |
| `pnpm test`             | Run tests (where available)           |
| `pnpm --filter api dev` | Start the API in development mode     |
| `pnpm --filter cli dev` | Start the CLI app in development mode |

> ### Bonus command:
> 
> For the first run it setup the database in a permanent Docker volume.

## Dependencies

| Logo                                                                                        | Name                                                   | Description                                                |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| <img src="https://raw.githubusercontent.com/jdx/mise/main/docs/public/logo.svg" width="64"> | [mise-en-place](https://mise.jdx.dev/)                 | Developer tools version manager.                           |
| ![pnpm](https://github.com/pnpm.png?size=64)                                                | [pnpm](https://pnpm.io/)                               | Install dependencies and run scripts accross the monorepo. |
| ![Biome](https://github.com/biomejs.png?size=64)                                            | [Biome](https://biomejs.dev/)                          | Code linter and formatter.                                 |
| ![Nodejs](https://github.com/nodejs.png?size=64)                                            | [Node.js](https://nodejs.org/en)                       | JS runtime.                                                |
| ![Bun](https://github.com/oven-sh.png?size=64)                                              | [Bun](https://bun.sh/)                                 | JS runtime for API and CLI executable builds.              |
| ![Changesets](https://github.com/changesets.png?size=64)                                    | [Changesets](https://github.com/changesets/changesets) |                                                            |
| ![image](https://github.com/commitlint.png?size=64)                                         |                                                        |                                                            |
| ![image](https://github.com/husky.png?size=64)                                              |                                                        |                                                            |
| ![Hono](https://github.com/hono.png?size=64)                                                | [Hono](https://hono.dev/)                              | _Post-Express_ API Framework.                              |
| ![Kysely](https://github.com/kysely-org.png?size=64)                                        | [Kysely](https://kysely.dev/)                          | Type-safe PostgreSQL query build and migration manager.    |
| ![image](https://github.com/ollama.png?size=64)                                             |                                                        |                                                            |
| ![image](https://github.com/tanstack.png?size=64)                                           |                                                        |                                                            |
| ![datefns](https://github.com/date-fns.png?size=64)                                         | [date-fns](https://date-fns.org/)                      |                                                            |

---
---
---
-
---
- :thought_balloon:
---

```
⠀⠀⠀⠀⠀⠀⠀⡀⠠⠠⠀⠚⠁⠁⠁⠁⠁⠁⠂⠄⢀⢀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⠐⠀⠀⠀⣀⡠⠤⣄⠀⠀⠀⠀⠀⢀⣀⣀⡀⠀⢅⠀⠀⠀⠀
⠀⠀⠀⠠⠀⠀⠀⠀⠋⠀⠀⣀⠀⠉⠀⠀⠀⠈⠁⠀⠀⠈⠙⠀⠑⡄⠀⠀
⠀⠀⠀⠂⠀⠀⠀⠀⢠⠖⠉⠀⠉⢣⠀⠀⠀⠀⡤⠖⠒⠲⣄⠀⠀⠈⠄⠀
⠀⠀⠁⠀⠀⠀⠀⠀⡞⠋⡷⢒⡖⣺⠀⠀⠀⡮⣄⣀⣀⣀⡌⡆⠀⠀⠅⠀
⠀⠈⠀⠀⠀⠀⠀⠀⣇⡄⠀⠉⡰⠃⠀⠀⠀⣇⠀⠈⠓⢊⡜⠁⠀⠀⠨⠀
⠀⠁⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⠀⠀⠀⠉⠉⠉⠀⠀⠀⠀⠀⠈⡀
⠈⠀⠀⢻⠑⢄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡤⠖⢻⠀⠀⠀⡒⠀⠀⠅
⠅⠀⠀⠸⡀⠀⠀⠀⠉⠙⠒⠢⠤⠔⠒⠉⠉⠀⠀⢀⡇⠀⠀⢐⠎⠀⠀⠅
⢐⠀⠀⠀⢗⠦⢜⡀⠀⠆⠀⠀⠀⠀⠀⠀⠀⢇⡶⠅⠀⠀⠀⠈⠀⠀⠀⡃
⠐⠀⠀⠀⠈⡆⠀⢐⠉⠇⠉⠉⠉⠉⠉⠉⡭⠃⠀⠀⠀⢀⡞⠈⠀⠀⡈⠀
⠀⠡⠀⠀⠀⠀⠑⢾⣀⣁⡀⠀⣀⡤⠎⠁⠀⠀⠀⠀⠀⠈⠀⠀⠀⡈⠀⠀
⠀⠀⠑⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⡐⠀⠀⠀
⠀⠀⠀⠀⠣⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠊⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠈⠉⠂⠒⠤⠠⠄⠄⠤⠄⠤⠤⠠⠔⠈⠀⠀⠀⠀⠀⠀⠀
```

---
-
---

_(TBC)_
