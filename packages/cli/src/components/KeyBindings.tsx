import { Box, Text, useFocusManager } from "ink"

export default function KeyBindings() {
  const { activeId } = useFocusManager()

  return (
    <Box flexDirection="row" justifyContent="space-between" gap={1}>
      <Text dimColor>
        Tab/Shift+Tab: Change focus
        {activeId === "promptbox" && ", Enter: Submit prompt"}
        {activeId === "ollamabox" && ", ↑/↓/j/k: Change selection, Enter: Submit selection"}
      </Text>
      <Text dimColor>Esc: Quit</Text>
    </Box>
  )
}
