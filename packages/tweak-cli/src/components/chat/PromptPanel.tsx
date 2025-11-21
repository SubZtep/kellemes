import type { UseMutateFunction } from "@tanstack/react-query"
import { Box, Text, useFocus } from "ink"
import TextInput from "ink-text-input"
import { useEffect } from "react"
import { useStore } from "../../store.js"

export default function PromptPanel({
  isLoading,
  submitPrompt,
}: {
  isLoading: boolean
  submitPrompt: UseMutateFunction
}) {
  const { prompt, setPrompt, setInputActive } = useStore()
  const { isFocused } = useFocus({ autoFocus: true })

  // Update inputActive state based on focus
  useEffect(() => {
    setInputActive(isFocused && !isLoading)
  }, [isFocused, isLoading, setInputActive])

  return (
    <Box flexDirection="column" borderStyle="bold" paddingX={1} borderColor={isLoading ? "green" : "gray"}>
      <Box>
        <Text bold color={isLoading ? "green" : "white"}>
          Prompt:{" "}
        </Text>
        {isLoading ? (
          <Text color="gray">{prompt || "(Press Tab to focus input)"}</Text>
        ) : (
          <TextInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={() => submitPrompt()}
            focus={isFocused}
          />
        )}
      </Box>
      <Text dimColor> </Text>
      <Text dimColor>
        {isFocused ? "Enter: Submit | Tab: Change focus" : "Tab: Focus input"} | Esc: Quit
      </Text>
    </Box>
  )
}
