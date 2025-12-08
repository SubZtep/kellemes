import { Box, Text, useInput } from "ink"
import Spinner from "ink-spinner"
import TextInput from "ink-text-input"
import { useCallback, useEffect, useState } from "react"
import { getSession, sendMagicLink, signInAnonymous } from "../../api.js"
import { useStore } from "../../store.js"
import FocusBox from "../ui/FocusBox.js"

export default function AuthBox() {
  const authStatus = useStore(state => state.authStatus)
  const authError = useStore(state => state.authError)
  const setAuthStatus = useStore(state => state.setAuthStatus)
  const setAuthError = useStore(state => state.setAuthError)
  const loginWithSession = useStore(state => state.loginWithSession)

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle anonymous login with Tab key
  useInput((input, key) => {
    if (key.tab && authStatus === "unauthenticated" && !isSubmitting) {
      handleAnonymousLogin()
    }
  })

  const handleAnonymousLogin = useCallback(async () => {
    setIsSubmitting(true)
    setAuthError(null)

    const result = await signInAnonymous()
    if (result.error) {
      setAuthError(result.error)
      setIsSubmitting(false)
      return
    }

    if (result.data) {
      loginWithSession(result.data)
    }
    setIsSubmitting(false)
  }, [setAuthError, loginWithSession])

  const handleEmailSubmit = useCallback(async () => {
    if (!email.trim() || !email.includes("@")) {
      setAuthError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    const result = await sendMagicLink(email.trim())
    if (result.error) {
      setAuthError(result.error)
      setIsSubmitting(false)
      return
    }

    setAuthStatus("awaiting_magic_link")
    setIsSubmitting(false)
  }, [email, setAuthError, setAuthStatus])

  // Poll for session when awaiting magic link
  useEffect(() => {
    if (authStatus !== "awaiting_magic_link") return

    const pollInterval = setInterval(async () => {
      const result = await getSession()
      if (result.data) {
        loginWithSession(result.data)
        clearInterval(pollInterval)
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [authStatus, loginWithSession])

  if (authStatus === "awaiting_magic_link") {
    return (
      <FocusBox title="Check your email" isFocused={true}>
        <Box flexDirection="column" padding={1}>
          <Box>
            <Spinner type="dots" />
            <Text> Waiting for you to click the magic link...</Text>
          </Box>
          <Box marginTop={1}>
            <Text dimColor>Email sent to: {email}</Text>
          </Box>
        </Box>
      </FocusBox>
    )
  }

  return (
    <FocusBox title="Sign in to keLLeMes" isFocused={true}>
      <Box flexDirection="column" padding={1}>
        <Box marginBottom={1}>
          <Text>Enter your email to receive a magic link:</Text>
        </Box>

        <Box>
          <Text>Email: </Text>
          {isSubmitting ? (
            <Spinner type="dots" />
          ) : (
            <TextInput
              value={email}
              onChange={setEmail}
              onSubmit={handleEmailSubmit}
              placeholder="you@example.com"
              focus={true}
            />
          )}
        </Box>

        {authError && (
          <Box marginTop={1}>
            <Text color="red">{authError}</Text>
          </Box>
        )}

        <Box marginTop={1}>
          <Text dimColor>Press </Text>
          <Text color="cyan">Enter</Text>
          <Text dimColor> to send magic link, or </Text>
          <Text color="cyan">Tab</Text>
          <Text dimColor> to continue as guest</Text>
        </Box>
      </Box>
    </FocusBox>
  )
}
