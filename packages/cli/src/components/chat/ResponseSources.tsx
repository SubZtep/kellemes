import type { SearchResult } from "@kellemes/common"
import { Box, Text } from "ink"

export default function ResponseSources({ sources }: { sources: SearchResult[] }) {
  if (!sources || sources.length === 0) return null

  return (
    <Box>
      <Text bold color="yellow">
        Sources ({sources.length}):
      </Text>
      {sources.map((source: SearchResult, i: number) => (
        <Text key={source.question} dimColor>
          {i + 1}. [{(source.score * 100).toFixed(1)}%] {source.question}
        </Text>
      ))}
    </Box>
  )
}
