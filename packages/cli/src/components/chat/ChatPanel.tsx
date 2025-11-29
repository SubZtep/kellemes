import { Box, type BoxProps } from "ink"
import useOllamaChat from "../../hooks/useOllamaChat"
import PromptBox from "./PromptBox"
import ResponseBox from "./ResponseBox"

export default function ChatPanel(props: BoxProps) {
  const { isLoading, response } = useOllamaChat()

  return (
    <Box flexDirection="column" {...props}>
      <ResponseBox isLoading={isLoading} response={response} />
      <PromptBox isLoading={isLoading} />
    </Box>
  )
}
