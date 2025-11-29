import { Box, Text } from "ink"
import { Fragment } from "react"
import { useStore } from "../../store"

export default function KeyBindings() {
  const activeModel = useStore(state => state.activeModel)
  const keyBindings = useStore(state => state.keyBindings)

  return (
    <Box flexDirection="row" columnGap={1} flexWrap="wrap">
      {keyBindings.map(({ keys, description }) => (
        <HotKey key={keys.toString()} keys={keys}>
          {description}
        </HotKey>
      ))}

      {activeModel ? <HotKey keys={["Tab", "Shift+Tab"]}>Change focus</HotKey> : null}

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
