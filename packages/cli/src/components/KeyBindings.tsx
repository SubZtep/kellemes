import { Box, Text } from "ink"
import { Fragment } from "react/jsx-runtime"
import { useStore } from "../store"

export default function KeyBindings() {
  const activeModel = useStore(state => state.activeModel)
  const keyBindings = useStore(state => state.keyBindings)
  return (
    <Box flexDirection="row" columnGap={1} flexWrap="wrap">
      {/* <Text>Key Bindings x</Text> */}
      {keyBindings.map(({ keys, description }) => (
        <HotKey key={keys.toString()} keys={keys}>
          {description}
        </HotKey>
      ))}
      {activeModel ? <HotKey keys={["Tab", "Shift+Tab"]}>Change focus</HotKey> : null}
      {/* <Box>
        {activeId === "promptbox" && ", Enter: Submit prompt"}
        {activeId === "ollamabox" && ", ↑/↓/j/k: Change selection, Enter: Submit selection"}
      </Box> */}
      <HotKey keys="Ctrl+c">Quit</HotKey>
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
