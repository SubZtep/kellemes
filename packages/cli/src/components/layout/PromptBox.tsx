import type { UseMutateFunction } from "@tanstack/react-query"
import { Box, Text } from "ink"
import TextInput from "ink-text-input"
import { useStore } from "../../store"

export default function PromptBox({
  isLoading,
  submitPrompt,
}: {
  isLoading: boolean
  submitPrompt: UseMutateFunction
}) {
  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)

  return (
    <Box flexDirection="column" borderStyle="bold" paddingX={1} borderColor={isLoading ? "redBright" : "red"}>
      <Box>
        <Text bold color={isLoading ? "green" : "white"}>
          Prompt:{" "}
        </Text>
        {isLoading ? (
          <Text color="gray">{prompt || "(Enter to activate)"}</Text>
        ) : (
          <TextInput value={prompt} onChange={setPrompt} onSubmit={() => submitPrompt()} />
        )}
      </Box>
      <Text dimColor>Enter: {isLoading ? "Activate input" : "Submit query"} | Esc: Exit input</Text>
    </Box>
  )
}
