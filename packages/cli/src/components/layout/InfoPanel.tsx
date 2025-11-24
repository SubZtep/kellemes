import { Box, type BoxProps } from "ink"
import OllamaBox from "../info/OllamaBox"
// import RagBox from "../info/RagBox"
// import Logo from "../Logo"

export default function InfoPanel(props: BoxProps) {
  return (
    <Box flexDirection="column" {...props}>
      {/* <Logo /> */}
      <OllamaBox flexGrow={1} />
      {/* <RagBox /> */}
    </Box>
  )
}
