import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box } from "ink"
import KeyBindings from "./components/KeyBindings"
import ChatPanel from "./components/layout/ChatPanel"
import FindingOllama from "./components/layout/FindingOllama"
import InfoPanel from "./components/layout/InfoPanel"
import { useStore } from "./store"

const queryClient = new QueryClient()

export default function App() {
  const activeModel = useStore(state => state.activeModel)

  return (
    <QueryClientProvider client={queryClient}>
      <FindingOllama>
        <Box flexDirection="column">
          <Box flexDirection="row" gap={1} flexGrow={1}>
            <InfoPanel minWidth={36} />
            {activeModel && <ChatPanel flexGrow={1} />}
          </Box>
          <KeyBindings />
        </Box>
      </FindingOllama>
    </QueryClientProvider>
  )
}
