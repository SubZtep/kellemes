import { Box, Text } from "ink"

interface StatusBarProps {
  ollamaStatus: "connected" | "disconnected" | "checking"
  ragStatus: "ready" | "not ready" | "initializing"
  documentsCount: number
}

export const StatusBar: React.FC<StatusBarProps> = ({ ollamaStatus, ragStatus, documentsCount }) => {
  const ollamaColor = ollamaStatus === "connected" ? "green" : ollamaStatus === "checking" ? "yellow" : "red"
  const ragColor = ragStatus === "ready" ? "green" : ragStatus === "initializing" ? "yellow" : "red"

  return (
    <Box borderStyle="round" borderColor="blue" padding={1}>
      <Box flexDirection="row" gap={2}>
        <Text>
          Ollama: <Text color={ollamaColor}>{ollamaStatus}</Text>
        </Text>
        <Text>|</Text>
        <Text>
          RAG: <Text color={ragColor}>{ragStatus}</Text>
        </Text>
        <Text>|</Text>
        <Text>
          Documents: <Text color="cyan">{documentsCount}</Text>
        </Text>
      </Box>
    </Box>
  )
}
