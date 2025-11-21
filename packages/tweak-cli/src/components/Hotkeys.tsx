import { Box, Text } from "ink"

export default function Hotkeys() {
  return (
    <Box flexDirection="column" paddingX={1} borderStyle="classic" borderColor="green">
      <Box justifyContent="center">
        <Text bold color="cyan">
          Hotkeys
        </Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Quit:</Text>
        <Text>Esc</Text>
      </Box>
      {/* <Box justifyContent="space-between">
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
      </Box> */}
      <Box justifyContent="space-between">
        <Text>Change focus:</Text>
        <Text>Tab/Shift+Tab</Text>
      </Box>
    </Box>
  )
}
