import { Levenshtein } from "autoevals"
import { evalite } from "evalite"
import { ragService } from "@kellemes/core"
import { LoggerScorer } from "./setup/scorers"

evalite("RAG test", {
  data: [
    {
      input: "Are you an AI? Answer with only one word: yes or no",
      expected: "Yes.",
    },
  ],
  task: async input => {
    const response = await ragService.generateResponse(input)
    return response.response
  },
  scorers: [Levenshtein, LoggerScorer],
})
