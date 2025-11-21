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
  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)
  const setInputActive = useStore(state => state.setInputActive)
  const { isFocused } = useFocus({ autoFocus: true, id: "prompt" })

  // Update inputActive state based on focus
  useEffect(() => {
    setInputActive(isFocused && !isLoading)
  }, [isFocused, isLoading, setInputActive])

  return (
    <Box
      flexDirection="column"
      borderStyle={isFocused ? "bold" : "round"}
      paddingX={1}
      borderColor={isLoading ? "greenBright" : "green"}
    >
      <Box>
        <Text bold color={isLoading ? "green" : "white"}>
          Prompt:{" "}
        </Text>
        {isLoading ? (
          <Text color="gray">{prompt || "(Press Tab to focus input)"}</Text>
        ) : (
          <TextInput value={prompt} onChange={setPrompt} onSubmit={() => submitPrompt()} focus={isFocused} />
        )}
      </Box>
      <Text dimColor> </Text>
      <Text dimColor>{isFocused ? "Enter: Submit | Tab: Change focus" : "Tab: Focus input"} | Esc: Quit</Text>
    </Box>
  )
}
