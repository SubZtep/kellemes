import { TitledBox } from "@mishieck/ink-titled-box"
import { type BoxProps, useFocus, useFocusManager } from "ink"
import { useEffect } from "react"
import { useStore } from "../../../store"
import ActiveModelInfo from "./ActiveModelInfo"
import SelectActiveModel from "./SelectActiveModel"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  // const { isFocused } = useFocus({ autoFocus: !activeModel, id: "ollamabox" })
  const { isFocused } = useFocus({ autoFocus: true, id: "ollamabox" })
  const { disableFocus, enableFocus } = useFocusManager()
  const ollamaVersion = useStore(state => state.ollamaVersion)

  useEffect(() => {
    if (activeModel) {
      enableFocus()
    } else {
      disableFocus()
    }
  }, [activeModel])

  return (
    <TitledBox
      titles={["Ollama", ollamaVersion!]}
      borderStyle={"round"}
      flexDirection="column"
      borderDimColor={!isFocused}
      paddingX={1}
      gap={1}
      {...props}
    >
      {/* <Box justifyContent="space-between" gap={1}> */}
      {/* <PullModel model="smollm2:1.7b" /> */}
      {isFocused ? <SelectActiveModel /> : <ActiveModelInfo />}
      {/* {isFocused ? (
        models.length > 0 ? (
          <SelectModel />
        ) : null
        // : (
        //   <PullModel model={process.env.OLLAMA_DEFAULT_MODEL} />
        // )
      ) : (
        <ActiveModelInfo />
      )} */}
      {/* </Box> */}
    </TitledBox>
  )
}
