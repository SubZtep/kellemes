import { Box, type BoxProps, Text, useFocus } from "ink"
import { useState } from "react"
import { useStore } from "../../../store"
import FloatInput from "../../FloatInput"
import FocusBox from "../../FocusBox"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  const { isFocused } = useFocus({ id: "parametersbox" })
  const [temperature, setTemperature] = useState(0.7)

  return (
    <FocusBox title="Parameters" isFocused={isFocused} {...props}>
      <Text>{activeModel} parameters</Text>

      <Box justifyContent="space-between">
        <Text>Temperature:</Text>
        {isFocused ? <FloatInput value={temperature} onChange={setTemperature} /> : <Text>{temperature}</Text>}
      </Box>
    </FocusBox>
  )
}
