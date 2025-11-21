import type { UseMutateFunction } from "@tanstack/react-query"
import { Box, Text } from "ink"
import TextInput from "ink-text-input"
import { useStore } from "../store"

export default function QueryPanel({
  isLoading,
  submitPrompt,
}: {
  isLoading: boolean
  submitPrompt: UseMutateFunction
}) {
  const { prompt, setPrompt } = useStore()

  return (
    <Box flexDirection="column" borderStyle="bold" paddingX={1} borderColor={isLoading ? "green" : "gray"}>
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
      <Text dimColor> </Text>
      <Text dimColor>Enter: {isLoading ? "Activate input" : "Submit query"} | Esc: Exit input</Text>
    </Box>
  )
}
