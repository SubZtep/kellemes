import { Box, type BoxProps } from "ink"
import { useStore } from "../../store"
import OllamaBox from "../boxes/OllamaBox"
import ParametersBox from "../boxes/ParametersBox"
// import RagBox from "../info/RagBox"
import Logo from "../Logo"

export default function InfoPanel(props: BoxProps) {
  const activeModel = useStore(state => state.activeModel)

  return (
    <Box flexDirection="column" {...props}>
      {activeModel ? <ParametersBox /> : <Logo />}
      <OllamaBox flexGrow={1} />
      {/* <RagBox /> */}
    </Box>
  )
}
