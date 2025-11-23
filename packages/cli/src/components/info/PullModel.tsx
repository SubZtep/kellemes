import { Box, Text, useFocusManager } from "ink"
import Spinner from "ink-spinner"
import ollama from "ollama/browser"
import { useEffect } from "react"

const DEFAULT_MODEL = "smollm:1.7b"

export default function PullModel() {
  const { focus } = useFocusManager()

  useEffect(() => {
    ;(async () => {
      await ollama.pull({ insecure: true, stream: false, model: DEFAULT_MODEL })
      focus("promptbox")
    })()
  }, [])

  return (
    <Box>
      <Text>
        Pulling a new model
        <Spinner type="simpleDotsScrolling" />
      </Text>
    </Box>
  )
}
