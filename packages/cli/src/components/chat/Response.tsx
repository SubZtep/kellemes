import { Box, Text } from "ink"
import type { ChatMessage } from "../../store"
import ResponseSources from "./ResponseSources"

export default function Response({ response }: { response: ChatMessage }) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor={response.sender === "user" ? "green" : "white"}>
      <Text>{response.response}</Text>

      {response.sources && <ResponseSources sources={response.sources} />}
      {/* <Box paddingX={2} paddingY={1}>
        <Text>{response.response}</Text>
      </Box> */}
      {/* {response.sources && (
        <Text bold color="yellow">
          Sources ({response.sources.length}):
        </Text>
      )}
      {response.sources?.map((source: SearchResult, i: number) => (
        <Text key={source.question} dimColor>
          {i + 1}. [{(source.score * 100).toFixed(1)}%] {source.question}
        </Text>
      ))} */}
    </Box>
  )
}
