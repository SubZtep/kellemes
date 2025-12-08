import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box, Text, useApp, useInput } from "ink"
import Spinner from "ink-spinner"
import { useEffect } from "react"
import { getSession } from "./api.js"
import { AuthBox } from "./components/auth/index.js"
import OllamaBox from "./components/boxes/OllamaBox/index.js"
import ParametersBox from "./components/boxes/ParametersBox/index.js"
import ChatPanel from "./components/chat/ChatPanel.js"
import FindingOllama from "./components/layout/FindingOllama.js"
import KeyBindings from "./components/layout/KeyBindings.js"
import Logo from "./components/layout/Logo.js"
import { useStore } from "./store.js"

const queryClient = new QueryClient()

export default function App() {
  const activeModel = useStore(state => state.activeModel)
  const authStatus = useStore(state => state.authStatus)
  const setAuthStatus = useStore(state => state.setAuthStatus)
  const loginWithSession = useStore(state => state.loginWithSession)
  const { exit } = useApp()

  useInput((input, key) => {
    if (key.ctrl && input === "c") {
      exit()
    }
  })

  // Check session on mount
  useEffect(() => {
    if (authStatus === "checking") {
      getSession().then(result => {
        if (result.data) {
          loginWithSession(result.data)
        } else {
          setAuthStatus("unauthenticated")
        }
      })
    }
  }, [authStatus, setAuthStatus, loginWithSession])

  // Show loading while checking auth
  if (authStatus === "checking") {
    return (
      <Box padding={1}>
        <Spinner type="dots" />
        <Text> Checking session...</Text>
      </Box>
    )
  }

  // Show auth screen if not authenticated
  if (authStatus === "unauthenticated" || authStatus === "awaiting_magic_link") {
    return (
      <QueryClientProvider client={queryClient}>
        <Box flexDirection="column" padding={1}>
          <Logo />
          <AuthBox />
        </Box>
        <KeyBindings />
      </QueryClientProvider>
    )
  }

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
