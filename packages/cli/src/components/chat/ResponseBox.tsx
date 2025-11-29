import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import { useStore } from "../../store"
import FocusBox from "../ui/FocusBox"
import Response from "./Response"

export default function ResponseBox({ isLoading, response }: { isLoading: boolean; response: string }) {
  const responses = useStore(state => state.responses)
  const activeModel = useStore(state => state.activeModel)

  return (
    <FocusBox title="Chat" isFocused={false} flexDirection="column" flexGrow={1} gap={1}>
      {responses
        .filter(response => response.model === activeModel)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(response => (
          <Response key={response.sender + response.createdAt.getTime().toString()} response={response} />
        ))}

      {isLoading && (
        <Box>
          <Text>
            {!response ? <Spinner type="dots12" /> : `🤖 `}
            {response}
            {response ? <Spinner type="line" /> : null}
          </Text>
        </Box>
      )}

      {!isLoading && responses.length === 0 && (
        <Text dimColor={true}>
          🤖<Spinner type="grenade" />
        </Text>
      )}
    </FocusBox>
  )
}
