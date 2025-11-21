import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import { useStore } from "../../store"

export default function ResponseBox({ isLoading, error }: { isLoading: boolean; error: string | null }) {
  const responses = useStore(state => state.responses)

  return (
    <Box flexDirection="column" paddingX={2} flexGrow={1}>
      <Text bold color="magenta">
        Response Preview
      </Text>

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

      {/* {!isLoading && !error && response && (
        <Box flexDirection="column">
          <Box flexDirection="column" marginBottom={1}>
            <Text color="white">{response}</Text>
          </Box>

          {sources.length > 0 && (
            <Box flexDirection="column">
              <Text dimColor> </Text>
              <Text bold color="yellow">
                Sources ({sources.length}):
              </Text>
              {sources.map((source, i) => (
                <Text key={source.question} dimColor>
                  {i + 1}. [{(source.score * 100).toFixed(1)}%] {source.question}
                </Text>
              ))}
            </Box>
          )}
        </Box>
      )} */}

      {responses.map((response, i) => (
        <Box key={i}>
          <Text color="white">{response.response}</Text>
        </Box>
      ))}

      {!isLoading && !error && responses.length === 0 && <Text dimColor>Submit a query to see results...</Text>}
    </Box>
  )
}
