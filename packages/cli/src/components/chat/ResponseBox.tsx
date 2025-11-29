import { useStore } from "../../store"
import FocusBox from "../FocusBox"
import Response from "./Response"

export default function ResponseBox() {
  const responses = useStore(state => state.responses)
  const activeModel = useStore(state => state.activeModel)

  return (
    <FocusBox title="Response" isFocused={false} flexDirection="column" flexGrow={1} gap={1}>
      {responses
        .filter(response => response.model === activeModel)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(response => (
          <Response key={response.sender + response.createdAt.getTime().toString()} response={response} />
        ))}

      {/* {isLoading && (
        <Box>   
          <Text color="green" inverse>
            <Spinner type="binary" />
            Generating response
            <Spinner type="simpleDots" />
          </Text>
        </Box>
      )} */}

      {/* {error && (
        <Box>
          <Text color="red">Error: {error}</Text>
        </Box>
      )} */}

      {/* {!isLoading && !error && responses.length === 0 && <Text dimColor>Submit a prompt to see results...</Text>} */}
    </FocusBox>
  )
}
