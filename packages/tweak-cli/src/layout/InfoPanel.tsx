import { Box, useFocus } from "ink"
import KeyboardShortcuts from "../components/KeyboardShortcuts"
import Logo from "../components/Logo"
import StatusBar from "../components/StatusBar"

export default function InfoPanel() {
  const { isFocused } = useFocus()

  return (
    <Box
      flexDirection="column"
      borderStyle={isFocused ? "bold" : "round"}
      borderColor={isFocused ? "greenBright" : "green"}
      gap={1}
    >
      <Logo />
      <StatusBar />
      <KeyboardShortcuts />
    </Box>
  )
}
