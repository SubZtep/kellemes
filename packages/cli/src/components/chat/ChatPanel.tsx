import { Box, type BoxProps, useFocus, useFocusManager, useInput } from "ink"
import { useEffect } from "react"
import useOllamaChat from "../../hooks/useOllamaChat"
import { useStore } from "../../store"
import PromptBox from "./PromptBox"
import ResponseBox from "./ResponseBox"

export default function ChatPanel(props: BoxProps) {
  const { isLoading, response, stream } = useOllamaChat()
  const { focus } = useFocusManager()
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

  useInput(
    (_input, key) => {
      if (key.escape) {
        stream?.abort()
        focus("promptbox")
      }
    },
    { isActive: isLoading },
  )

  return (
    <Box flexDirection="column" {...props}>
      {isFocused ? <ResponseBox isLoading={isLoading} response={response} /> : null}
      <PromptBox isLoading={isLoading} isFocused={isFocused} />
    </Box>
  )
}
