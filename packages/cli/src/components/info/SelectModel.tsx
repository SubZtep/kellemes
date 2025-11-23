import { Box, Text, useFocusManager } from "ink"
import SelectInput from "ink-select-input"
import Spinner from "ink-spinner"
import ollama from "ollama/browser"
import { useEffect, useState } from "react"
import { useStore } from "../../store"
import ModelInfo from "./ModelInfo"
import PullModel from "./PullModel"

export default function SelectModel() {
  const { disableFocus, enableFocus, focus } = useFocusManager()
  const activeModel = useStore(state => state.activeModel)
  const setActiveModel = useStore(state => state.setActiveModel)
  const [highlightedModel, setHightlightedModel] = useState<string | null>(null)
  const [models, setModels] = useState<
    | {
        name: string
        /** null indicates the model is currently not loaded into memory */
        expires_at: Date | null
      }[]
    | null
  >(null)

  useEffect(() => {
    if (activeModel) {
      enableFocus()
      focus("promptbox")
    } else {
      disableFocus()
    }
  }, [activeModel])

  useEffect(() => {
    const interval = setInterval(async () => {
      const [list, ps] = await Promise.all([ollama.list(), ollama.ps()])

      if (list.models.length === 1) {
        setActiveModel(list.models.at(0)!.name)
        return
      }

      const currentModels = list.models.map(model => {
        const expires_at = ps.models.find(p => p.model === model.name)?.expires_at
        return { name: model.name, expires_at: expires_at ? new Date(expires_at) : null }
      })
      setModels(currentModels)
    }, 1000)

    return () => {
      clearInterval(interval)
      enableFocus()
    }
  }, [])

  const getExpiresAt = (modelName: string) => {
    return models?.find(model => model.name === modelName)?.expires_at
  }

  return (
    <>
      <Box marginTop={1}>
        {!models ? (
          <Text color="yellow" dimColor={true}>
            Loading models
            <Spinner type="simpleDots" />
          </Text>
        ) : (
          <Text color="yellow">Please, select a model:</Text>
        )}
      </Box>

      {models &&
        (models.length > 0 ? (
          <>
            <SelectInput
              items={models.map(model => ({ label: model.name, value: model.name }))}
              onHighlight={item => setHightlightedModel(item?.value ?? null)}
              onSelect={item => setActiveModel(item.value)}
              isFocused={true}
            />
            {highlightedModel && <ModelInfo model={highlightedModel} expiresAt={getExpiresAt(highlightedModel)!} />}
          </>
        ) : (
          <PullModel />
        ))}
    </>
  )
}
