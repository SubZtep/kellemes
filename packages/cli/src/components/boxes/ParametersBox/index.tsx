import { Box, type BoxProps, Text, useFocus, useFocusManager, useInput } from "ink"
import TextInput from "ink-text-input"
import { useEffect, useState } from "react"
import useOllamaCreate from "../../../hooks/useOllamaCreate"
import { _parameters, useStore } from "../../../store"
import FloatInput from "../../ui/FloatInput"
import FocusBox from "../../ui/FocusBox"
import NumberInput from "../../ui/NumberInput"

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  const { create, isLoading } = useOllamaCreate(activeModel!)
  const { isFocused } = useFocus({ id: "parametersbox" })
  const setKeyBindings = useStore(state => state.setKeyBindings)
  const { disableFocus, enableFocus } = useFocusManager()
  const parameters = useStore(state => state.parameters)
  const setParameter = useStore(state => state.setParameter)

  const [activeParameter, setActiveParameter] = useState("temperature")

  useEffect(() => {
    if (isFocused) {
      setKeyBindings([
        { keys: ["Meta+Up", "Meta+Down"], description: "Change active parameter" },
        { keys: ["Up", "Down"], description: "Change value" },
        { keys: "Enter", description: "Bake model" },
      ])
    }
  }, [isFocused])

  useEffect(() => {
    if (isLoading) {
      disableFocus()
    } else {
      enableFocus()
    }
  }, [isLoading])

  useInput((_input, key) => {
    if (!isFocused) return
    if (key.meta && key.downArrow) {
      const items = Object.keys(_parameters)
      const currentIndex = items.indexOf(activeParameter)
      const nextIndex = (currentIndex + 1) % items.length
      setActiveParameter(items[nextIndex]!)
    }
    if (key.meta && key.upArrow) {
      const items = Object.keys(_parameters)
      const currentIndex = items.indexOf(activeParameter)
      const previousIndex = (currentIndex - 1 + items.length) % items.length
      setActiveParameter(items[previousIndex]!)
    }
    if (key.return) {
      if (isLoading) return
      create(parameters)
    }
  })

  return (
    <FocusBox title="Parameters" isFocused={isFocused} {...props} backgroundColor={isLoading ? "blue" : undefined}>
      {Object.entries(_parameters).map(([key, value]) => (
        <Box key={key} justifyContent="space-between" flexDirection={value.type === "string" ? "column" : "row"}>
          <Text underline={isFocused && activeParameter === key} dimColor={!isFocused || activeParameter !== key}>
            {key}:
          </Text>
          {isFocused && activeParameter === key ? (
            value.type === "float" ? (
              <FloatInput value={parameters[key] as number} onChange={v => setParameter(key, v)} />
            ) : value.type === "number" ? (
              <NumberInput value={parameters[key] as number} onChange={v => setParameter(key, v)} />
            ) : (
              <TextInput value={parameters[key] as string} onChange={v => setParameter(key, v)} />
            )
          ) : (
            <Text>{parameters[key]}</Text>
          )}
        </Box>
      ))}
    </FocusBox>
  )
}
