import { Box, Text } from "ink"
import TextInput from "ink-text-input"

interface QueryPanelProps {
  query: string
  onQueryChange: (value: string) => void
  onSubmit: () => void
  isActive: boolean
}

export const QueryPanel: React.FC<QueryPanelProps> = ({ query, onQueryChange, onSubmit, isActive }) => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor={isActive ? "green" : "gray"} padding={1}>
      <Text bold color={isActive ? "green" : "white"}>
        Test Query
      </Text>
      <Text dimColor> </Text>
      <Box>
        <Text>Query: </Text>
        {isActive ? (
          <TextInput value={query} onChange={onQueryChange} onSubmit={onSubmit} />
        ) : (
          <Text color="gray">{query || "(Enter to activate)"}</Text>
        )}
      </Box>
      <Text dimColor> </Text>
      <Text dimColor>Enter: {isActive ? "Submit query" : "Activate input"} | Esc: Exit input</Text>
    </Box>
  )
}
