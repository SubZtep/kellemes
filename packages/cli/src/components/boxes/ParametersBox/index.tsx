import { produce } from "immer"
import { Box, type BoxProps, Text, useFocus, useFocusManager, useInput } from "ink"
import TextInput from "ink-text-input"
import { useEffect, useState } from "react"
import useOllamaCreate from "../../../hooks/useOllamaCreate"
import { useStore } from "../../../store"
import FloatInput from "../../ui/FloatInput"
import FocusBox from "../../ui/FocusBox"
import NumberInput from "../../ui/NumberInput"

const _parameters = {
  temperature: {
    default: 0.7,
    type: "float",
  },
  top_k: {
    default: 40,
    type: "number",
  },
}

export default function OllamaBox({ ...props }: Pick<BoxProps, "flexGrow">) {
  const activeModel = useStore(state => state.activeModel)
  const { create, isLoading } = useOllamaCreate(activeModel!)
  const { isFocused } = useFocus({ id: "parametersbox" })
  const setKeyBindings = useStore(state => state.setKeyBindings)
  const { disableFocus, enableFocus } = useFocusManager()

  const [parameters, setParameters] = useState<Record<string, number | string>>(
    // @ts-ignore
    Object.fromEntries(Object.entries(_parameters).map(([key, value]) => [key, value.default])),
  )
  const [activeParameter, setActiveParameter] = useState("temperature")

  useEffect(() => {
    if (isFocused) {
      setKeyBindings([
        { keys: ["Meta+↑", "Meta+↓"], description: "Change active parameter" },
        { keys: ["↑", "↓"], description: "Change value" },
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
      create(parameters)
    }
  })

  return (
    <FocusBox title="Parameters" isFocused={isFocused} {...props}>
      {Object.entries(_parameters).map(([key, value]) => (
        <Box key={key} justifyContent="space-between">
          <Text underline={activeParameter === key}>{key}:</Text>
          {isFocused && activeParameter === key ? (
            value.type === "float" ? (
              <FloatInput
                value={parameters[key] as number}
                onChange={v =>
                  setParameters(
                    produce(draft => {
                      draft[key] = v
                    }),
                  )
                }
              />
            ) : value.type === "number" ? (
              <NumberInput
                value={parameters[key] as number}
                onChange={v =>
                  setParameters(
                    produce(draft => {
                      draft[key] = v
                    }),
                  )
                }
              />
            ) : (
              <TextInput
                value={parameters[key] as string}
                onChange={v =>
                  setParameters(
                    produce(draft => {
                      draft[key] = v
                    }),
                  )
                }
              />
            )
          ) : (
            <Text>{parameters[key]}</Text>
          )}
        </Box>
      ))}
    </FocusBox>
  )
}
