import { type BoxProps, useFocus } from "ink"
import { useStore } from "../../../store"
import FocusBox from "../../FocusBox"
import SelectModel from "../../info/SelectModel"
import ActiveModelInfo from "./ActiveModelInfo"
import PullModel from "./PullModel"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  const { isFocused } = useFocus({ autoFocus: !activeModel, id: "ollamabox" })
  const ollamaVersion = useStore(state => state.ollamaVersion)
  const models = useStore(state => state.ollamaModels)

  return (
    <FocusBox title={`Ollama ${ollamaVersion}`} isFocused={isFocused} {...props}>
      {isFocused ? (
        models.length > 0 ? (
          <SelectModel />
        ) : (
          <PullModel model={process.env.OLLAMA_DEFAULT_MODEL} />
        )
      ) : (
        <ActiveModelInfo />
      )}
    </FocusBox>
  )
}
