import { TitledBox } from "@mishieck/ink-titled-box"
import { Box, Text, useFocus } from "ink"
import TextInput from "ink-text-input"
import { useEffect } from "react"
import { useStore } from "../../store.js"

export default function PromptBox({
  isLoading,
  submitPrompt,
}: {
  isLoading: boolean
  submitPrompt: (prompt: string) => void
}) {
  const activeModel = useStore(state => state.activeModel)
  const prompt = useStore(state => state.prompt)
  const setPrompt = useStore(state => state.setPrompt)
  const setInputActive = useStore(state => state.setInputActive)
  const { isFocused } = useFocus({ autoFocus: !!activeModel, id: "promptbox" })

  // Update inputActive state based on focus
  useEffect(() => {
    setInputActive(isFocused && !isLoading)
  }, [isFocused, isLoading, setInputActive])

  return (
    <TitledBox
      titles={["Enter your prompt"]}
      borderStyle={"round"}
      paddingRight={1}
      flexDirection="row"
      borderDimColor={!isFocused}
    >
      <Box width={1} height={1}></Box>
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
    </TitledBox>
  )
}
