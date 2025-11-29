import { Ollama } from "ollama"

const host = process.env.OLLAMA_BASE_URL!

export const ollama = new Ollama({ host })

// const response = await ollama.chat({
//   model: 'llama3.1',
//   messages: [{ role: 'user', content: 'Why is the sky blue?' }],
// })
