import { formatBytes } from "@kellemes/common"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import type { AbortableAsyncIterator, ProgressResponse } from "ollama"
import ollama from "ollama"
import { useEffect, useState } from "react"

const DEFAULT_MODEL = "smollm2:1.7b"
const STALL_TIMEOUT_MS = 15_000

type ProgressState = {
  status: string
  completedBytes: number | null
  totalBytes: number | null
}

export default function PullModel({ onPulled }: { onPulled?: (modelName: string) => void }) {
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState<ProgressState>({
    status: "Contacting Ollama",
    completedBytes: null,
    totalBytes: null,
  })

  useEffect(() => {
    let cancelled = false
    let stream: AbortableAsyncIterator<ProgressResponse> | null = null
    let stallTimer: ReturnType<typeof setTimeout> | null = null

    const scheduleStallTimeout = () => {
      if (stallTimer) clearTimeout(stallTimer)
      stallTimer = setTimeout(() => {
        if (cancelled) return
        stream?.abort()
        setError("Ollama did not report progress in time.")
      }, STALL_TIMEOUT_MS)
    }

    const pullModel = async () => {
      try {
        stream = await ollama.pull({ insecure: true, stream: true, model: DEFAULT_MODEL })
        scheduleStallTimeout()
        for await (const chunk of stream) {
          if (cancelled) break
          scheduleStallTimeout()
          setProgress(prev => ({
            status: chunk.status ?? prev.status,
            completedBytes: typeof chunk.completed === "number" ? chunk.completed : prev.completedBytes,
            totalBytes: typeof chunk.total === "number" ? chunk.total : prev.totalBytes,
          }))

          if (chunk.status === "success" || (typeof chunk.total === "number" && chunk.total === chunk.completed)) {
            setDone(true)
            break
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to pull model")
        }
      } finally {
        if (stallTimer) clearTimeout(stallTimer)
      }
    }

    pullModel()

    return () => {
      cancelled = true
      if (stallTimer) clearTimeout(stallTimer)
      stream?.abort()
    }
  }, [])

  useEffect(() => {
    if (done) {
      onPulled?.(DEFAULT_MODEL)
    }
  }, [done])

  const manualCommand = `ollama pull ${DEFAULT_MODEL}`
  const percent =
    progress.totalBytes && progress.completedBytes !== null
      ? Math.round((progress.completedBytes / progress.totalBytes) * 100)
      : null

  if (done) {
    return (
      <Box flexDirection="column">
        <Text color="green">Model {DEFAULT_MODEL} is ready.</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">Unable to finish pulling {DEFAULT_MODEL}.</Text>
        <Text>{error}</Text>
        <Text dimColor>Try running the command below in another terminal:</Text>
        <Text>{manualCommand}</Text>
        <Text dimColor>Restart the CLI afterwards to continue.</Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      <Text>
        Pulling {DEFAULT_MODEL} <Spinner type="line" />
      </Text>
      <Text color="cyan">
        {progress.status}
        {percent !== null && progress.totalBytes
          ? `: ${formatBytes(progress.completedBytes ?? 0)} / ${formatBytes(progress.totalBytes)} (${percent}%)`
          : ""}
      </Text>
      {percent === null && (
        <Text dimColor>If this hangs, cancel and run '{manualCommand}' manually, then reopen the CLI.</Text>
      )}
    </Box>
  )
}
