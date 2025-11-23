import { ragService } from "@kellemes/core"
import { TitledBox } from "@mishieck/ink-titled-box"
import { Box, type BoxProps, Text } from "ink"
import { useEffect, useState } from "react"

type RAGStatus = "ready" | "not ready" | "initializing"

export default function RagBox(props: Pick<BoxProps, "flexGrow">) {
  const [ragStatus, setRAGStatus] = useState<RAGStatus>("initializing")
  const [documentsCount, setDocumentsCount] = useState(0)

  const ragColor = ragStatus === "ready" ? "green" : ragStatus === "initializing" ? "yellow" : "red"

  useEffect(() => {
    ;(async () => {
      // Initialize RAG
      await ragService.initialize()
      const stats = ragService.getStats()
      setRAGStatus(stats.isReady ? "ready" : "not ready")
      setDocumentsCount(stats.totalDocuments)
    })()
  }, [])

  return (
    <TitledBox
      titles={["RAG", "Stats"]}
      borderStyle={"round"}
      padding={1}
      flexDirection="column"
      borderDimColor={true}
      {...props}
    >
      <Box justifyContent="space-between">
        <Text>RAG:</Text>
        <Text color={ragColor}>{ragStatus}</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Documents:</Text>
        <Text color="cyan">{documentsCount}</Text>
      </Box>
    </TitledBox>
  )
}
