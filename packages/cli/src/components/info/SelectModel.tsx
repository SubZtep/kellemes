import { Text } from "ink"
import SelectInput from "ink-select-input"
import { useEffect } from "react"
import { useStore } from "../../store"

export default function SelectModel() {
  const setKeyBindings = useStore(state => state.setKeyBindings)
  const models = useStore(state => state.ollamaModels)
  const activeModel = useStore(state => state.activeModel)
  const setActiveModel = useStore(state => state.setActiveModel)

  useEffect(() => {
    setKeyBindings([
      { keys: ["↑", "↓", "j", "k"], description: "Change selection" },
      { keys: ["Enter"], description: "Use model" },
    ])
    return () => {
      setKeyBindings([])
    }
  }, [])

  return (
    <SelectInput
      items={models.map(model => ({ label: model.name, value: model.name }))}
      itemComponent={({ label, isSelected }) => (
        <Text color={isSelected ? "green" : "white"} bold={activeModel === label}>
          {label}
        </Text>
      )}
      onSelect={item => setActiveModel(item.value)}
      isFocused={true}
    />
  )
}
