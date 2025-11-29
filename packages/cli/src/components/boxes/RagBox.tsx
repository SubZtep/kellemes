// import { ragService } from "@kellemes/rag"
import { Box, type BoxProps, Text } from "ink"
import { useEffect, useState } from "react"
import FocusBox from "../ui/FocusBox"

type RAGStatus = "ready" | "not ready" | "initializing"

export default function RagBox(props: Pick<BoxProps, "flexGrow">) {
  const [ragStatus, setRAGStatus] = useState<RAGStatus>("initializing")
  const [documentsCount, setDocumentsCount] = useState(0)

  const ragColor = ragStatus === "ready" ? "green" : ragStatus === "initializing" ? "yellow" : "red"

  useEffect(() => {
    ;(async () => {
      // Initialize RAG
      // await ragService.initialize()
      // const stats = ragService.getStats()
      // setRAGStatus(stats.isReady ? "ready" : "not ready")
      // setDocumentsCount(stats.totalDocuments)
      setRAGStatus("not ready")
      setDocumentsCount(0)
    })()
  }, [])

  return (
    <FocusBox title="RAG" isFocused={false} flexDirection="column" gap={1} {...props}>
      <Box justifyContent="space-between">
        <Text>RAG:</Text>
        <Text color={ragColor}>{ragStatus}</Text>
      </Box>
      <Box justifyContent="space-between">
        <Text>Documents:</Text>
        <Text color="cyan">{documentsCount}</Text>
      </Box>
    </FocusBox>
  )
}
