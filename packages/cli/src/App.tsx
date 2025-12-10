import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box, useApp, useInput } from "ink"
import OllamaBox from "./components/boxes/OllamaBox"
import ParametersBox from "./components/boxes/ParametersBox"
import ChatPanel from "./components/chat/ChatPanel"
import FindingOllama from "./components/layout/FindingOllama"
import KeyBindings from "./components/layout/KeyBindings"
import Logo from "./components/layout/Logo"
import { useStore } from "./store"

const queryClient = new QueryClient()

export default function App() {
  const activeModel = useStore(state => state.activeModel)
  const { exit } = useApp()

  useInput((input, key) => {
    if (key.ctrl && input === "c") {
      exit()
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <FindingOllama>
        <Box flexDirection="column">
          <Box flexDirection="row" alignItems="flex-end" gap={1} flexGrow={1}>
            <Box flexDirection="column" width={40}>
              {/* <RagBox /> */}
              {activeModel ? <ParametersBox /> : <Logo />}
              <OllamaBox />
            </Box>
            {activeModel && <ChatPanel flexGrow={1} />}
          </Box>
        </Box>
      </FindingOllama>
      <KeyBindings />
    </QueryClientProvider>
  )
}
