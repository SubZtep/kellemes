import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box } from "ink"
import KeyBindings from "./components/KeyBindings"
import ChatPanel from "./components/layout/ChatPanel"
import FindingOllama from "./components/layout/FindingOllama"
import InfoPanel from "./components/layout/InfoPanel"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FindingOllama>
        <Box flexDirection="column" width="100%" height={process.stdout.rows - 10}>
          <Box flexDirection="row" gap={1} flexGrow={1}>
            <ChatPanel flexGrow={1} />
            <InfoPanel minWidth={36} />
          </Box>
          <KeyBindings />
        </Box>
      </FindingOllama>
    </QueryClientProvider>
  )
}
