import { type BoxProps, Text, useFocus } from "ink"
import TextInput from "ink-text-input"
import { useState } from "react"
import { useStore } from "../../../store"
import FocusBox from "../../FocusBox"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  const { isFocused } = useFocus({ id: "parametersbox" })
  const [val, setVal] = useState("xxx")

  return (
    <FocusBox title="Parameters" isFocused={isFocused} {...props}>
      <Text>{activeModel} parameters</Text>

      <TextInput value={val} onChange={setVal} focus={isFocused} />
    </FocusBox>
  )
}
