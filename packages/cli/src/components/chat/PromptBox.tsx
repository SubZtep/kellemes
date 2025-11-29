import { Box, type BoxProps, Text, useFocus } from "ink"
import TextInput from "ink-text-input"
import { useStore } from "../../store"
import FocusBox from "../FocusBox"

export default function PromptBox({
  isLoading,
  submitPrompt,
  ...props
}: {
  isLoading: boolean
  submitPrompt: (prompt: string) => void
} & BoxProps) {
  const activeModel = useStore(state => state.activeModel)
  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)
  const { isFocused } = useFocus({ autoFocus: !!activeModel, id: "promptbox" })

  return (
    <FocusBox title="Enter your prompt" isFocused={isFocused} {...props}>
      <Box>
        {isLoading ? (
          <Text color="gray">(Waiting for response)</Text>
        ) : !isFocused && !prompt ? (
          <Text color="gray">(Press Tab to focus input)</Text>
        ) : (
          <TextInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={() => {
              const newPrompt = prompt.slice()
              submitPrompt(newPrompt)
              setPrompt("")
            }}
            focus={isFocused}
          />
        )}
      </Box>
    </FocusBox>
  )
}
