import { formatBytes } from "@kellemes/common"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import type { AbortableAsyncIterator, ProgressResponse } from "ollama"
import ollama from "ollama/browser"
import { useEffect, useState } from "react"

const DEFAULT_MODEL = "smollm2:1.7b"

export default function PullModel() {
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ completed: number; total: number; status: string } | null>(null)

  useEffect(() => {
    let stream: AbortableAsyncIterator<ProgressResponse> | null = null

    ;(async () => {
      try {
        stream = await ollama.pull({ insecure: true, stream: true, model: DEFAULT_MODEL })
        for await (const chunk of stream) {
          if (chunk.total && chunk.completed) {
            setProgress({ completed: chunk.completed, total: chunk.total, status: chunk.status })
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to pull model")
      }
    })()

    return () => {
      stream?.abort()
    }
  }, [])

  if (error) {
    return (
      <Box>
        <Text color="red">Error: {error}</Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      <Text>
        Pulling {DEFAULT_MODEL} <Spinner type="line" />
      </Text>
      {progress && (
        <Text color="cyan">
          {progress.status}: {formatBytes(progress.completed)} / {formatBytes(progress.total)} (
          {Math.round((progress.completed / progress.total) * 100)}%)
        </Text>
      )}
    </Box>
  )
}
