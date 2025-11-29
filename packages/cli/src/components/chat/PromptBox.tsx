import { Box, type BoxProps, Text, useFocus } from "ink"
import TextInput from "ink-text-input"
import { useState } from "react"
import useKeyBindings from "../../hooks/useKeyBindings"
import { useStore } from "../../store"
import FocusBox from "../FocusBox"

export default function PromptBox({
  // isLoading,
  // submitPrompt,
  ...props
}: {
  // isLoading: boolean
  // submitPrompt: (prompt: string) => void
} & BoxProps) {
  // const activeModel = useStore(state => state.activeModel)
  // const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)
  const [input, setInput] = useState("")
  const { isFocused } = useFocus({ autoFocus: true, id: "promptbox" })
  useKeyBindings([{ keys: ["Enter"], description: "Submit prompt" }])

  return (
    <FocusBox title="Enter your prompt" isFocused={isFocused} {...props}>
      <Box>
        {/* {isLoading ? (
          <Text color="gray">(Waiting for response)</Text>
        ) : !isFocused && !input ? (
          <Text color="gray">(Press Tab to focus input)</Text>
        ) : ( */}
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
        {/* )} */}
      </Box>
    </FocusBox>
  )
}
