import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box } from "ink"
import OllamaBox from "./components/boxes/OllamaBox"
import ParametersBox from "./components/boxes/ParametersBox"
import KeyBindings from "./components/KeyBindings"
import Logo from "./components/Logo"
import ChatPanel from "./components/layout/ChatPanel"
import FindingOllama from "./components/layout/FindingOllama"
import useExit from "./hooks/useExit"
import { useStore } from "./store"

const queryClient = new QueryClient()

export default function App() {
  useExit()
  const activeModel = useStore(state => state.activeModel)

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
