import { Box, type BoxProps, useFocusManager, useInput } from "ink"
import useOllamaChat from "../../hooks/useOllamaChat"
import PromptBox from "./PromptBox"
import ResponseBox from "./ResponseBox"

export default function ChatPanel(props: BoxProps) {
  const { isLoading, response, stream } = useOllamaChat()
  const { focus } = useFocusManager()

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
      <ResponseBox isLoading={isLoading} response={response} />
      <PromptBox isLoading={isLoading} />
    </Box>
  )
}
