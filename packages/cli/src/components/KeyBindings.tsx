import { Box, Text } from "ink"
import { Fragment } from "react/jsx-runtime"

export default function KeyBindings() {
  return (
    <Box flexDirection="row" justifyContent="space-between" gap={1}>
      {/* <Text>Key Bindings x</Text> */}
      <HotKey keys={["Tab", "Shift+Tab"]}>Change focus</HotKey>
      {/* <Box>
        {activeId === "promptbox" && ", Enter: Submit prompt"}
        {activeId === "ollamabox" && ", ↑/↓/j/k: Change selection, Enter: Submit selection"}
      </Box> */}
      <HotKey keys="Esc">Quit</HotKey>
    </Box>
  )
}

function HotKey({ keys, children }: { keys: string | string[]; children: React.ReactNode }) {
  if (!keys.length) {
    return null
  }
  const keysArr: string[] = Array.isArray(keys) ? keys : [keys]
  const len = keysArr.length - 1
  return (
    <Box>
      <Text dimColor color="cyan">
        [
      </Text>
      {keysArr.map((k, i) => (
        <Fragment key={k + i.toString()}>
          <Text dimColor>{k}</Text>
          {i < len && (
            <Text dimColor color="cyan">
              |
            </Text>
          )}
        </Fragment>
      ))}
      <Text dimColor color="cyan">
        ]
      </Text>
      <Text dimColor> {children}</Text>
    </Box>
  )
}
