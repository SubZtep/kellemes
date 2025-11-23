import { Box, Text } from "ink"

export default function KeyBindings() {
  return (
    <Box flexDirection="row" justifyContent="space-between" gap={1}>
      <Text dimColor>
        Tab/Shift+Tab: Change focus, ↑/↓/j/k: Change selection, Enter: Select active/Submit prompt, Space: Toggle
        something
      </Text>
      <Text dimColor>Esc: Quit</Text>
    </Box>
  )
}
