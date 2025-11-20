import React from "react"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import type { SearchResult } from "@kellemes/core"

interface ResponsePanelProps {
  response: string | null
  sources: SearchResult[]
  isLoading: boolean
  error: string | null
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({ response, sources, isLoading, error }) => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="magenta" padding={1} minHeight={15}>
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

      {!isLoading && !error && response && (
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
                <Text key={i} dimColor>
                  {i + 1}. [{(source.score * 100).toFixed(1)}%] {source.question}
                </Text>
              ))}
            </Box>
          )}
        </Box>
      )}

      {!isLoading && !error && !response && (
        <Text dimColor>Submit a query to see results...</Text>
      )}
    </Box>
  )
}
