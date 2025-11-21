import { Box, Text } from "ink"

export default function KeyboardShortcuts() {
  return (
    <Box flexDirection="column" paddingX={1} borderStyle="classic" borderColor="greenBright">
      <Text bold color="cyan">
        Keyboard Shortcuts
      </Text>
      <Box justifyContent="space-between">
        <Text>Quit:</Text>
        <Text>Q</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Navigate up/down:</Text>
        <Text>↑/↓</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Adjust values:</Text>
        <Text>←/→</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Toggle:</Text>
        <Text>Space</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Send prompt:</Text>
        <Text bold>
          <Text>Enter</Text>
        </Text>
      </Box>
    </Box>
  )
}
