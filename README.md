> ##
>
> ## Work In Progress :construction:
>
> ---
>
> ##

# :rainbow::sparkler: keLLeMes, the untouchable :love_letter:

An [Ollama](https://ollama.com) based TypeScript Retrieval-Augmented Generation (RAG) system for a keLLeMes chatbot. This system uses vector embeddings and semantic search to provide context-aware responses based on a knowledge base.

## Prerequisites

**Install [MISE-EN-PLACE](https://mise.jdx.dev/) properly** on your system. It's a tool/version manager that handles core utilities (like pnpm). Get familiar with it now to make future configuration easier. :shipit:

> The [rest of](https://subztep.github.io/kellemes) the ~~docs~~ are a work in progress.

## Configuration

All required environment variable defaults are in [`mise.toml`](mise.toml#L1).

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
> `docker compose up -d`\
> Start all required services (+more) in the background.\
> For the first run it setup the database in a permanent Docker volume.

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
