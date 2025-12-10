
> [!CAUTION] 
> This repository is a work in progress. :construction:

# :rainbow::sparkler:<sub><sub>`k`</sub>e</sub>**~~L~~L**<sup>e</sup>**M**<sub>e`$`</sub>:heartpulse::sweat_drops:

Bunch of packages playing around with small and **large language model**s to see what’s what.

Although the majority of the source code is initially generated, I still can’t fully embrace my inner **vibe-code**r. Without a project plan, I keep having to convince the agents about the uncertain future of this write-only code from my _tiny content-window world_. :neckbeard:

> If you’re looking for user-facing **documentation**, it’ll be on [the website](https://kellemes.net)… :shrug: eventually.

## Features

- [x] :hatching_chick:
- [ ] :computer: **Simple CLI** tool compiled into an installable binary that communicates with an [Ollama](https://ollama.com) service on- or offline. Set **AI parameters**, change personality traits, and let the chatbot talk to you satisfied.
- [ ] :books: Bring your own documents and datasets, the Retrieval-Augmented Generation (**RAG**) system uses vector embeddings and semantic search to give context-aware responses based on a knowledge base.
- [ ] :iphone: Push your model to the cloud and chat through the **mobile app** without touching _Evil Corp_’s server.
- [ ] **?**
- [ ] :money_with_wings: Profit

## Prerequisites

Running the **[Docker](https://www.docker.com/)** deamon is recommended for smooth service execution.

Setup **[MISE-EN-PLACE](https://mise.jdx.dev/)** in the dev environment to handle tool version management.

## Configuration

All required environment variable defaults are in [`mise.toml`](mise.toml#L1), without change any of them the rig should work with empty data.

****
If you want to override any of them, create a `.env` file with the updated values.

## Run as a developer

1. Clone the project
2. `pnpm i`
3. `pnpm build`
4. `docker compose --profile backend up -d`
5. `pnpm --filter cli dev`

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
