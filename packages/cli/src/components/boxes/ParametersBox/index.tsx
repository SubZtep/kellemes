import { TitledBox } from "@mishieck/ink-titled-box"
import { type BoxProps, Text, useFocus } from "ink"
import TextInput from "ink-text-input"
import { useState } from "react"
import { useStore } from "../../../store"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  const { isFocused } = useFocus({ id: "parametersbox" })
  const [val, setVal] = useState("xxx")

  return (
    <TitledBox
      titles={["Parameters", activeModel!]}
      borderStyle={"round"}
      flexDirection="column"
      borderDimColor={!isFocused}
      paddingX={1}
      gap={1}
      {...props}
    >
      <Text>{activeModel} parameters</Text>

      <TextInput value={val} onChange={setVal} focus={isFocused} />
    </TitledBox>
  )
}
