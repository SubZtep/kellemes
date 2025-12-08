import { Box, Text, useInput } from "ink"
import SelectInput from "ink-select-input"
import { useEffect, useState } from "react"
import useOllamaDelete from "../../../hooks/useOllamaDelete"
import { useStore } from "../../../store"

export default function SelectModel() {
  const setKeyBindings = useStore(state => state.setKeyBindings)
  const models = useStore(state => state.ollamaModels).filter(
    model => !model.name.startsWith(`${process.env.OLLAMA_MODEL}:`),
  )
  const activeModel = useStore(state => state.activeModel)
  const setActiveModel = useStore(state => state.setActiveModel)
  const { deleteModel, isDeleting } = useOllamaDelete()
  const [highlightedModel, setHighlightedModel] = useState(models[0]!.name)

  useEffect(() => {
    setKeyBindings([
      { keys: ["Up", "Down"], description: "Change selection" },
      { keys: "Enter", description: "Set active model" },
      { keys: "Delete", description: "Delete selected model" },
    ])
  }, [])

  useInput((_input, key) => {
    if (key.delete) {
      if (highlightedModel === activeModel) {
        setActiveModel(null)
      }
      deleteModel(highlightedModel)
    }
  })

  return (
    <Box flexDirection="column" gap={1}>
      <Text>Select base model:</Text>
      <SelectInput
        initialIndex={0}
        items={models.map(model => ({ label: model.name, value: model.name }))}
        itemComponent={({ label, isSelected }) => (
          <Text color={isSelected ? "green" : "white"} bold={activeModel === label}>
            {label}
          </Text>
        )}
        onSelect={item => setActiveModel(item.value)}
        onHighlight={item => setHighlightedModel(item.value)}
        isFocused={!isDeleting}
      />
      <Text dimColor> ✈{process.env.OLLAMA_HOST}</Text>
    </Box>
  )
}
