import { Box, Text } from "ink"
import { useStore } from "../../../store"

export default function CustomModelInfo() {
  const customModels = useStore(state => state.ollamaModels).filter(model =>
    model.name.startsWith(`${process.env.OLLAMA_MODEL}:`),
  )

  if (customModels.length === 0) {
    return null
  }

  return (
    <Box justifyContent="space-between" gap={1}>
      <Text>Custom model:</Text>
      <Text color="green">{customModels.map(model => model.name).join(", ")}</Text>
    </Box>
  )
}
