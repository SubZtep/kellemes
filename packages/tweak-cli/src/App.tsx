import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box } from "ink"
import ChatPanel from "./components/layout/ChatPanel"
import InfoPanel from "./components/layout/InfoPanel"
import SettingsPanel from "./components/layout/SettingsPanel"
import useHotkeys from "./hooks/useHotkeys"

// import { useStore } from "./store"

// Create a client outside the component
const queryClient = new QueryClient()

export default function App() {
  // const keyPressed = useStore(state => state.keyPressed)
  // const { exit } = useApp()
  useHotkeys()

  // Parameters
  // const [params, setParams] = useState<Parameters>({
  //   topK: 3,
  //   similarityThreshold: 0.5,
  //   temperature: 0.7,
  //   useRAG: true,
  // })
  // const [selectedParam, setSelectedParam] = useState(0)

  // // Query and response
  // const [queryInputActive, setQueryInputActive] = useState(false)

  // Keyboard input handling
  // useInput((input: string, key: any) => {
  //   console.log({ input, key })
  //   // Query input is active - let TextInput handle it
  //   // if (queryInputActive) {
  //   //   if (key.escape) {
  //   //     setQueryInputActive(false)
  //   //   }
  //   //   return
  //   // }

  //   // Global commands
  //   // if (input === "q" || input === "Q") {
  //   //   exit()
  //   //   return
  //   // }

  //   // // Activate query input
  //   // if (key.return) {
  //   //   setQueryInputActive(true)
  //   //   return
  //   // }

  //   // Navigate parameters
  //   // if (key.upArrow) {
  //   //   setSelectedParam(prev => Math.max(0, prev - 1))
  //   //   return
  //   // }

  //   // if (key.downArrow) {
  //   //   setSelectedParam(prev => Math.min(3, prev + 1))
  //   //   return
  //   // }

  //   // Adjust parameters
  //   if (key.leftArrow || key.rightArrow) {
  //     // const delta = key.rightArrow ? 1 : -1
  //     // setParams(prev => {
  //     //   const updated = { ...prev }
  //     //   switch (selectedParam) {
  //     //     case 0: // Top-K
  //     //       updated.topK = Math.max(1, Math.min(10, prev.topK + delta))
  //     //       break
  //     //     case 1: // Similarity threshold
  //     //       updated.similarityThreshold = Math.max(0, Math.min(1, prev.similarityThreshold + delta * 0.1))
  //     //       break
  //     //     case 2: // Temperature
  //     //       updated.temperature = Math.max(0, Math.min(2, prev.temperature + delta * 0.1))
  //     //       break
  //     //     case 3: // RAG mode (toggle with space)
  //     //       break
  //     //   }
  //     //   return updated
  //     // })
  //   }

  //   // Toggle RAG modeimport InfoPanel from "./layout/InfoPanel"

  //   // if (input === " " && selectedParam === 3) {
  //   //   setParams(prev => ({ ...prev, useRAG: !prev.useRAG }))
  //   // }
  // })

  return (
    <QueryClientProvider client={queryClient}>
      <Box flexDirection="row" minHeight={20} width="100%">
        <SettingsPanel minWidth={36} />
        <ChatPanel flexGrow={1} />
        <InfoPanel minWidth={36} />
      </Box>
    </QueryClientProvider>
  )
}
