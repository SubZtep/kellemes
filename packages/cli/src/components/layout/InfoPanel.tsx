import { Box, type BoxProps, Newline, Text, useFocus } from "ink"
import { useStore } from "../../store"
import OllamaBox from "../info/OllamaBox"
import RagBox from "../info/RagBox"
import Logo from "../Logo"

export default function InfoPanel(props: BoxProps) {
  const activeModel = useStore(state => state.activeModel)
  const { isFocused } = useFocus({ autoFocus: !activeModel, id: "infopanel" })

  return (
    <Box flexDirection="column" backgroundColor="#030" gap={1} {...props}>
      <Logo />
      <OllamaBox isFocused={isFocused} />
      <RagBox flexGrow={1} />

      {isFocused && (
        <Text dimColor>
          ↑/↓/j/k: Change highlighted
          <Newline />
          Enter: Select active model
        </Text>
      )}
    </Box>
  )
}
