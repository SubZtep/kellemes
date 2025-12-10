import { type BoxProps, useFocus } from "ink"
import { useStore } from "../../../store"
import FocusBox from "../../ui/FocusBox"
import ActiveModelInfo from "./ActiveModelInfo"
import CustomModelInfo from "./CustomModelInfo"
import PullModel from "./PullModel"
import SelectModel from "./SelectModel"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  const setActiveModel = useStore(state => state.setActiveModel)
  const { isFocused } = useFocus({ autoFocus: !activeModel, id: "ollamabox" })
  const ollamaVersion = useStore(state => state.ollamaVersion)
  const models = useStore(state => state.ollamaModels)

  return (
    <FocusBox title={`Ollama ${ollamaVersion}`} isFocused={isFocused} {...props}>
      {isFocused ? (
        models.length > 0 ? (
          <SelectModel />
        ) : (
          <PullModel
            model={process.env.OLLAMA_DEFAULT_MODEL}
            onPulled={model => {
              if (!activeModel) {
                setActiveModel(model)
              }
            }}
          />
        )
      ) : (
        <>
          <ActiveModelInfo />
          <CustomModelInfo />
        </>
      )}
    </FocusBox>
  )
}
