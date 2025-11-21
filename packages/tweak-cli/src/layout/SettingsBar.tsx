import { Box, useFocus } from "ink"
import ParameterPanel from "../components/ParameterPanel"

export default function SettingsBar() {
  const { isFocused } = useFocus()

  // Parameters
  // const [params, setParams] = useState<Parameters>({
  //   topK: 3,
  //   similarityThreshold: 0.5,
  //   temperature: 0.7,
  //   useRAG: true,
  // })
  // const [selectedParam, setSelectedParam] = useState(0)

  return (
    <Box
      flexDirection="column"
      alignItems="flex-start"
      borderStyle={isFocused ? "bold" : "round"}
      borderColor={isFocused ? "redBright" : "red"}
      paddingX={2}
    >
      {/* @ts-ignore */}
      {/* <BigText text="Settings" font="tiny" colors={["yellow", "green"]} spaceless={true} /> */}
      {/* <InfoPanel /> */}
      <ParameterPanel />
    </Box>
  )
}
