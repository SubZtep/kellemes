import SelectInput from "ink-select-input"
import { useStore } from "../../../store"

export default function SelectActiveModel() {
  const models = useStore(state => state.ollamaModels)
  const setActiveModel = useStore(state => state.setActiveModel)
  // const activeModel = useStore(state => state.activeModel)
  return (
    <SelectInput
      items={models.map(model => ({ label: model.name, value: model.name }))}
      onSelect={item => {
        setActiveModel(item.value)
      }}
      // isFocused={activeModel === null}
    />
  )
}
