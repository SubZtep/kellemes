import { Box, Text } from "ink"
import SelectInput from "ink-select-input"
import Spinner from "ink-spinner"
import ollama from "ollama/browser"
import { useEffect, useState } from "react"
import { useStore } from "../../store"
import ModelInfo from "./ModelInfo"

export default function SelectModel() {
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
    const interval = setInterval(async () => {
      const [list, ps] = await Promise.all([ollama.list(), ollama.ps()])
      const currentModels = list.models.map(model => {
        const expires_at = ps.models.find(p => p.model === model.name)?.expires_at
        return { name: model.name, expires_at: expires_at ? new Date(expires_at) : null }
      })
      setModels(currentModels)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getExpiresAt = (modelName: string) => {
    return models?.find(model => model.name === modelName)?.expires_at
  }

  return (
    <>
      <Box marginTop={1}>
        {!models ? (
          <Text color="yellowBright">
            Loading models
            <Spinner type="simpleDotsScrolling" />
          </Text>
        ) : (
          <Text color="yellow">Please, select a model:</Text>
        )}
      </Box>

      {!!models && models.length > 0 ? (
        <>
          <SelectInput
            initialIndex={models.findIndex(model => model.name === highlightedModel)}
            items={models?.map(model => ({ label: model.name, value: model.name })) ?? []}
            onHighlight={item => setHightlightedModel(item?.value ?? null)}
            onSelect={item => setActiveModel(item.value)}
            isFocused={true}
          />
          {highlightedModel && <ModelInfo model={highlightedModel} expiresAt={getExpiresAt(highlightedModel)!} />}
        </>
      ) : (
        <Text dimColor>No models found</Text>
      )}
    </>
  )
}
