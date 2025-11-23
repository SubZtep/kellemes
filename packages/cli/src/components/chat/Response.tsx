import { Box, Text } from "ink"
import type { ChatMessage } from "../../store"
import ResponseSources from "./ResponseSources"

export default function Response({ response }: { response: ChatMessage }) {
  return (
    <Box flexDirection="column" alignSelf={response.sender === "user" ? "flex-end" : "flex-start"}>
      <Text dimColor={response.sender === "user"}>
        {`${response.sender !== "user" ? "🤖 " : ""} ${response.response} ${response.sender === "user" ? "👤" : ""}`}
      </Text>

      {response.sources && <ResponseSources sources={response.sources} />}

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
