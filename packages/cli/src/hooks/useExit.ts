import { useApp, useInput } from "ink"

export default function useExit() {
  const { exit } = useApp()

  useInput((input, key) => {
    if (key.ctrl && input === "c") {
      exit()
    }
  })
}
