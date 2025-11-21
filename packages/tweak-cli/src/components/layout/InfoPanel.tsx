import { Box, type BoxProps } from "ink"
// import HotKeys from "../Hotkeys"
import Logo from "../Logo"
import StatusBox from "./StatusBox"

export default function InfoPanel(props: BoxProps) {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="#060" gap={1} {...props}>
      <Logo />
      <StatusBox />
      {/* <HotKeys /> */}
    </Box>
  )
}
