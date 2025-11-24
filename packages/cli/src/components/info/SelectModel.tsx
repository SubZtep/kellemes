import { useQuery } from "@tanstack/react-query"
import { Box, Text } from "ink"
import SelectInput from "ink-select-input"
import Spinner from "ink-spinner"
import ollama from "ollama"
import { useEffect, useState } from "react"
import { useStore } from "../../store"
import ModelInfo from "./ModelInfo"

// import PullModel from "./PullModel"

interface Model {
  name: string
  expires_at?: Date
}

export default function SelectModel() {
  // const activeModel = useStore(state => state.activeModel)
  // const setActiveModel = useStore(state => state.setActiveModel)
  const setKeyBindings = useStore(state => state.setKeyBindings)
  // const [highlightedModel, setHightlightedModel] = useState<string | null>(null)
  // const [models, setModels] = useState<Model[] | null>(null)

  // const { isLoading: isLoadingModels } = useQuery({
  //   queryKey: ["models"],
  //   queryFn: () => Promise.all([ollama.list(), ollama.ps()]),
  //   select: async ([list, ps]) => {
  //     console.log("Models found1!!!", list.models.length)
  //     const models = list.models.map(model => ({
  //       name: model.name,
  //       expires_at: ps.models.find(p => p.model === model.name)?.expires_at,
  //     }))
  //     setModels(models)
  //     return models
  //   },
  //   staleTime: 1000,
  // })

  useEffect(() => {
    setKeyBindings([
      { keys: ["↑", "↓", "j", "k"], description: "Change selection" },
      { keys: ["Enter"], description: "Use model" },
    ])
    return () => {
      setKeyBindings([])
    }
  }, [])

  // const getExpiresAt = (modelName: string) => {
  //   return models?.find(model => model.name === modelName)?.expires_at
  // }

  return (
    <>
      <Text>Models</Text>
      {/* <Text>Models: {JSON.stringify(models, null, 2)}</Text> */}
      {/* <Box marginTop={1}>
        <Text color="yellow" dimColor={isLoadingModels}>
          {isLoadingModels ? (
            <>
              Loading models
              <Spinner type="simpleDots" />
            </>
          ) : (
            "Please, select a model:"
          )}
        </Text>
      </Box>

      {!isLoadingModels &&
        models &&
        (models.length > 0 ? (
          <>
            <SelectInput
              items={models.map(model => ({ label: model.name, value: model.name }))}
              itemComponent={({ label, isSelected }) => (
                <Text color={isSelected ? "green" : "white"} bold={activeModel === label}>
                  {label}
                </Text>
              )}
              onHighlight={item => setHightlightedModel(item?.value ?? null)}
              onSelect={item => setActiveModel(item.value)}
              isFocused={true}
            />
            {highlightedModel && <ModelInfo model={highlightedModel} expiresAt={getExpiresAt(highlightedModel)!} />}
          </>
        ) : (
          // <PullModel />
          <Text>No models found</Text>
        ))} */}
    </>
  )
}
