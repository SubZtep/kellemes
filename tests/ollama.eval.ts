import { Levenshtein } from "autoevals"
import { evalite } from "evalite"
import { ollamaService } from "../src/services/ollama.service"

evalite("Ollama test", {
  data: [
    {
      input: "Are you an AI? Answer with only one word: yes or no",
      expected: "Yes.",
    },
  ],
  task: async (input) => {
    return await ollamaService.chat(input)
  },
  scorers: [Levenshtein],
})
