import { formatBytes } from "@kellemes/common"
import { BarChart } from "@pppp606/ink-chart"
import { Box, Text } from "ink"
import Spinner from "ink-spinner"
import ollama, { type AbortableAsyncIterator, type ProgressResponse } from "ollama"
import { useEffect, useState } from "react"

// import { useStore } from "../../../store"

const STALL_TIMEOUT_MS = 15_000

type ProgressState = {
  status: string
  completedBytes: number | null
  totalBytes: number | null
}

export default function PullModel({ model, onPulled }: { model: string; onPulled?: (modelName: string) => void }) {
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  // const addOllamaModel = useStore(state => state.addOllamaModel)
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
      // TODO: check disk space
      try {
        stream = await ollama.pull({
          insecure: true,
          stream: true,
          model: model,
        })
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
      onPulled?.(model)
    }
  }, [done])

  const manualCommand = `ollama pull ${model}`
  const percent =
    progress.totalBytes && progress.completedBytes !== null
      ? Math.round((progress.completedBytes / progress.totalBytes) * 100)
      : null

  if (done) {
    return (
      <Box flexDirection="column">
        <Text color="green">Model {model} is ready.</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">Unable to finish pulling {model}.</Text>
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
        Pulling {model} {progress.totalBytes && `(${formatBytes(progress.totalBytes)}) `}
        <Spinner type="line" />
      </Text>
      {/* <Text color="cyan">
        {progress.status}
        {percent !== null && progress.totalBytes
          ? `: ${formatBytes(progress.completedBytes ?? 0)} / ${formatBytes(progress.totalBytes)}`
          : ""}
      </Text> */}

      {percent !== null && (
        <BarChart
          data={[{ label: "Progress", value: percent }]}
          max={100}
          showValue="right"
          format={v => `${v}%`}
          width={30}
          color="cyan"
        />
      )}

      {percent === null && (
        <Text dimColor>If this hangs, cancel and run '{manualCommand}' manually, then reopen the CLI.</Text>
      )}
    </Box>
  )
}
