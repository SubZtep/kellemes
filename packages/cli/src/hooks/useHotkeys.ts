import { useApp, useInput } from "ink"
import { useStore } from "../store"

export default function useHotkeys() {
  const setKeyPressed = useStore(state => state.setKeyPressed)
  const inputActive = useStore(state => state.inputActive)
  const { exit } = useApp()

  useInput(
    (input: string, key: Record<string, boolean>) => {
      const pressedKeys = Object.keys(key).filter(k => key[k])

      // Always allow escape to exit
      if (pressedKeys.includes("escape")) {
        exit()
        return
      }

      // Don't capture any other keys when text input is active
      if (inputActive) {
        return
      }

      // Tab for focus management - let Ink handle it
      if (pressedKeys.includes("tab")) {
        setKeyPressed(null)
        return
      }

      if (pressedKeys.length === 0 && input === " ") {
        setKeyPressed("space")
        return
      }

      if (pressedKeys.includes("leftArrow")) {
        setKeyPressed("leftArrow")
        return
      }

      if (pressedKeys.includes("rightArrow")) {
        setKeyPressed("rightArrow")
        return
      }

      if (pressedKeys.includes("upArrow")) {
        setKeyPressed("upArrow")
        return
      }

      if (pressedKeys.includes("downArrow")) {
        setKeyPressed("downArrow")
        return
      }

      setKeyPressed(null)
    },
    { isActive: true }
  )
}
