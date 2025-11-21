/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
import { Box, Text } from "ink"
import { useStore } from "../../store"
// import { useState } from "react"
// import { useStore } from "../store"

// export interface Parameters {
//   topK: number
//   similarityThreshold: number
//   temperature: number
//   useRAG: boolean
// }

// interface ParameterPanelProps {
//   params: Parameters
//   selectedParam: number
// }

// const paramNames = ["Top-K", "Similarity Threshold", "Temperature", "RAG Mode"]
// const paramDescriptions = [
//   "Number of documents to retrieve",
//   "Minimum similarity score (0-1)",
//   "Model temperature (0-2)",
//   "Enable/disable RAG retrieval",
// ]

export default function ParameterBox() {
  const keyPressed = useStore(state => state.keyPressed)
  // const values = [params.topK, params.similarityThreshold, params.temperature, params.useRAG ? "ON" : "OFF"]
  // const { topK, similarityThreshold, temperature, useRAG } = useStore()
  // const values = [topK, similarityThreshold, temperature, useRAG ? "ON" : "OFF"]

  // const [selectedParam, setSelectedParam] = useState(0)

  return (
    <Box flexDirection="column">
      <Text bold color="cyan">
        Parameter Controls
      </Text>
      <Text>{keyPressed}</Text>
      {/* <Text dimColor> </Text> */}
      {/* {paramNames.map((name, i) => (
        <Box key={name} flexDirection="column" marginY={0}>
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
      ))} */}
      {/* <Text dimColor> </Text> */}
      {/* <Text dimColor>
        ↑/↓: Navigate
        <Newline />
        ←/→: Adjust
        <Newline />
        Space: Toggle
        <Newline />
        Q: Quit
      </Text> */}
    </Box>
  )
}
