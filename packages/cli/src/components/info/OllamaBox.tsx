import { TitledBox } from "@mishieck/ink-titled-box"
import { Box, type BoxProps, Text, useFocus, useFocusManager } from "ink"
import SelectInput from "ink-select-input"
// import SelectInput from "ink-select-input"
// import Spinner from "ink-spinner"
// import ollama from "ollama/browser"
import { useEffect } from "react"
import { useStore } from "../../store"
import PullModel from "./PullModel.js"
// import SelectModel from "./SelectModel"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const ollamaVersion = useStore(state => state.ollamaVersion)
  const models = useStore(state => state.ollamaModels)
  const activeModel = useStore(state => state.activeModel)
  const setActiveModel = useStore(state => state.setActiveModel)
  const { isFocused } = useFocus({ autoFocus: !activeModel, id: "ollamabox" })
  // const setActiveModel = useStore(state => state.setActiveModel)
  const { disableFocus, enableFocus } = useFocusManager()

  useEffect(() => {
    if (activeModel) {
      enableFocus()
    } else if (isFocused) {
      disableFocus()
    }
  }, [activeModel, isFocused])

  // if (ollamaModels.length === 0) {
  //   //
  // }

  // return <Text>Ollama: {ollamaModels.length}</Text>
  // return <Text>{JSON.stringify(models, null, 2)}</Text>

  return (
    <TitledBox
      titles={["Ollama", ollamaVersion!]}
      borderStyle={"round"}
      padding={1}
      flexDirection="column"
      borderDimColor={!isFocused}
      {...props}
    >
      {isFocused ? (
        <Box justifyContent="space-between" gap={1}>
          {models.length > 0 ? (
            <SelectInput
              items={models.map(model => ({ label: model.name, value: model.name }))}
              itemComponent={({ label, isSelected }) => (
                <Text color={isSelected ? "green" : "white"} bold={activeModel === label}>
                  {label}
                </Text>
              )}
              // onHighlight={item => setHightlightedModel(item?.value ?? null)}
              onSelect={item => setActiveModel(item.value)}
              isFocused={true}
            />
          ) : (
            <PullModel />
          )}
        </Box>
      ) : (
        <Box justifyContent="space-between" gap={1}>
          <Text>LLM:</Text>
          <Text color="green">{activeModel ?? "💀"}</Text>
        </Box>
      )}
    </TitledBox>
  )
}
