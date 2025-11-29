import { spawn } from "node:child_process"
import { Box, Text, useApp, useInput } from "ink"
import type React from "react"
import { useEffect, useRef, useState } from "react"

type Props = {
  command: string
  args?: string[]
}

const Console: React.FC<Props> = ({ command, args = [] }) => {
  const [lines, setLines] = useState<string[]>([])
  const [running, setRunning] = useState(true)

  const processRef = useRef<ReturnType<typeof spawn> | null>(null)
  const scrollRef = useRef(0)

  const { exit } = useApp()

  useInput((input, _key) => {
    // Quit UI entirely
    if (input === "q") {
      killProcess()
      exit()
    }

    // Cancel command but keep UI running
    if (input === "c") {
      killProcess()
    }
  })

  const killProcess = () => {
    if (processRef.current && running) {
      processRef.current.kill("SIGTERM")
      setRunning(false)
      setLines(prev => [...prev, "\n[Process killed]\n"])
    }
  }

  useEffect(() => {
    const child = spawn(command, args, {
      shell: true,
    })

    processRef.current = child

    child.stdout.on("data", data => {
      const text = data.toString().replace(/\n$/, "")
      setLines(prev => [...prev, text])
    })

    child.stderr.on("data", data => {
      const text = data.toString().replace(/\n$/, "")
      setLines(prev => [...prev, `[ERR] ${text}`])
    })

    child.on("close", code => {
      setRunning(false)
      setLines(prev => [...prev, `\n[Exited with code ${code}]`])
    })

    return killProcess
  }, [command, args])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current = lines.length
  }, [lines])

  const visibleLines = lines.slice(Math.max(0, scrollRef.current - 20), scrollRef.current)

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text>
        <Text color="yellow">Running:</Text> {command} {args.join(" ")}
      </Text>

      <Box flexDirection="column" marginTop={1}>
        {visibleLines.map(line => (
          <Text key={line}>{line}</Text>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text dimColor>{running ? "Press 'c' to cancel the command, 'q' to quit." : "Press 'q' to quit."}</Text>
      </Box>
    </Box>
  )
}

export default Console
