interface Scorer {
  name: string
  description?: string
  scorer: (args: { input: string; output: string; expected?: string }) => number
}

export const LoggerScorer: Scorer = {
  name: "Custom Scorer",
  description: "Debug that scorer values.",
  scorer: args => {
    console.table(args)
    return args.output === args.expected ? 1 : 0
  },
}
