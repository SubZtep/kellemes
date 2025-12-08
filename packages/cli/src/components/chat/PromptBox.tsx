import { Box, type BoxProps, Text } from "ink"
import Spinner from "ink-spinner"
import TextInput from "ink-text-input"
import { useState } from "react"
import { useStore } from "../../store"
import FocusBox from "../ui/FocusBox"

export default function PromptBox({
  isLoading,
  isFocused,
  ...props
}: {
  isLoading: boolean
  isFocused: boolean
} & BoxProps) {
  const setPrompt = useStore(state => state.setPrompt)
  const [input, setInput] = useState("")

  return (
    <FocusBox title="Enter your prompt" isFocused={isFocused} {...props}>
      <Box>
        {isLoading ? (
          <Text dimColor>(Waiting for response)</Text>
        ) : !isFocused && !input ? (
          <Text dimColor>
            👤 <Spinner type="growHorizontal" />
          </Text>
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
            placeholder='Try "Why is the sky blue?"'
          />
        )}
      </Box>
    </FocusBox>
  )
}
