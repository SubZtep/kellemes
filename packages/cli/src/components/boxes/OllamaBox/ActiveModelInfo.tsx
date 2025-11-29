import { Box, Text } from "ink"
import { useStore } from "../../../store"

export default function ActiveModelInfo() {
  const activeModel = useStore(state => state.activeModel)

  return (
    <Box justifyContent="space-between" gap={1}>
      <Text>Base LLM:</Text>
      <Text color="green">{activeModel ?? "💀"}</Text>
    </Box>
  )
}
