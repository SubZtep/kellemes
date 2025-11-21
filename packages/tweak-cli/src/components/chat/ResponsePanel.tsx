import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import { useStore } from "../../store.js"
import Response from "./Response.js"

export default function ResponsePanel({ isLoading, error }: { isLoading: boolean; error: string | null }) {
  const { responses } = useStore()

  return (
    <Box flexDirection="column" paddingX={1} flexGrow={1} gap={1}>
      <Text bold color="magenta">
        Response Preview
      </Text>
      <Text dimColor> </Text>

      {isLoading && (
        <Box>
          <Text color="yellow">
            <Spinner type="dots" />
          </Text>
          <Text color="yellow"> Generating response...</Text>
        </Box>
      )}

      {error && (
        <Box>
          <Text color="red">Error: {error}</Text>
        </Box>
      )}

      {/* <Text>{JSON.stringify(responses, null, 2)}</Text> */}

      {responses
        .filter(response => response.model === process.env.MODEL!)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(response => (
          <Response key={response.createdAt.toString()} response={response} />
        ))}

      {!isLoading && !error && responses.length === 0 && <Text dimColor>Submit a query to see results...</Text>}
    </Box>
  )
}
