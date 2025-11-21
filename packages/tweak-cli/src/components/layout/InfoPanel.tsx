import { Box, type BoxProps, useFocus } from "ink"
import HotKeys from "../Hotkeys"
import Logo from "../Logo"
import StatusBox from "./StatusBox"

export default function InfoPanel(props: BoxProps) {
  const { isFocused } = useFocus()

  return (
    <Box
      flexDirection="column"
      borderStyle={isFocused ? "bold" : "round"}
      borderColor={isFocused ? "greenBright" : "green"}
      gap={1}
      {...props}
    >
      <Logo />
      <StatusBox />
      <HotKeys />
    </Box>
  )
}
