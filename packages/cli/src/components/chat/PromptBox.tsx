import { Box, type BoxProps, Text, useFocus } from "ink"
import TextInput from "ink-text-input"
import { useEffect, useState } from "react"
import { useStore } from "../../store"
import FocusBox from "../ui/FocusBox"

export default function PromptBox({
  isLoading,
  ...props
}: {
  isLoading: boolean
} & BoxProps) {
  const setPrompt = useStore(state => state.setPrompt)
  const [input, setInput] = useState("")
  const { isFocused } = useFocus({ autoFocus: true, id: "promptbox" })
  const setKeyBindings = useStore(state => state.setKeyBindings)

  useEffect(() => {
    if (isFocused) {
      setKeyBindings([
        { keys: "Enter", description: "Submit prompt" },
        { keys: "Escape", description: "Stop generating response" },
      ])
    }
  }, [isFocused])

  return (
    <FocusBox title="Enter your prompt" isFocused={isFocused} {...props}>
      <Box>
        {isLoading ? (
          <Text dimColor>(Waiting for response)</Text>
        ) : !isFocused && !input ? (
          <Text dimColor>👤</Text>
        ) : (
          <TextInput
            value={input}
            onChange={setInput}
            onSubmit={() => {
              const newPrompt = input.slice().trim()
              if (newPrompt) {
                setPrompt(newPrompt)
                setInput("")
              }
            }}
            focus={isFocused}
          />
        )}
      </Box>
    </FocusBox>
  )
}
