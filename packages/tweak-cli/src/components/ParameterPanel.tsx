import React from "react"
import { Box, Text } from "ink"

export interface Parameters {
  topK: number
  similarityThreshold: number
  temperature: number
  useRAG: boolean
}

interface ParameterPanelProps {
  params: Parameters
  selectedParam: number
}

const paramNames = ["Top-K", "Similarity Threshold", "Temperature", "RAG Mode"]
const paramDescriptions = [
  "Number of documents to retrieve",
  "Minimum similarity score (0-1)",
  "Model temperature (0-2)",
  "Enable/disable RAG retrieval",
]

export const ParameterPanel: React.FC<ParameterPanelProps> = ({ params, selectedParam }) => {
  const values = [params.topK, params.similarityThreshold, params.temperature, params.useRAG ? "ON" : "OFF"]

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold color="cyan">
        Parameter Controls
      </Text>
      <Text dimColor> </Text>
      {paramNames.map((name, i) => (
        <Box key={i} flexDirection="column" marginY={0}>
          <Box>
            <Text color={selectedParam === i ? "yellow" : "white"} bold={selectedParam === i}>
              {selectedParam === i ? "▶ " : "  "}
              {name}:{" "}
            </Text>
            <Text color={selectedParam === i ? "green" : "gray"}>{values[i]}</Text>
          </Box>
          <Text dimColor>
            {"  "}
            {paramDescriptions[i]}
          </Text>
        </Box>
      ))}
      <Text dimColor> </Text>
      <Text dimColor>↑/↓: Navigate | ←/→: Adjust | Space: Toggle | Q: Quit</Text>
    </Box>
  )
}
