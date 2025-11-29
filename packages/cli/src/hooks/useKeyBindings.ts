import { useEffect } from "react"
import { type State, useStore } from "../store"

export default function useKeyBindings(keyBindings: State["keyBindings"]) {
  const setKeyBindings = useStore(state => state.setKeyBindings)

  useEffect(() => {
    setKeyBindings(keyBindings)

    return () => {
      setKeyBindings([])
    }
  }, [])
}
