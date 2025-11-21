import type { ChatResponse } from "@kellemes/core"
import { create } from "zustand"

export interface State {
  /** User input text prompt. */
  prompt: string
  /** Responses from the RAG service. */
  responses: ChatResponse[]

  topK: number
  similarityThreshold: number
  temperature: number | null
  useRAG: boolean
}

export interface Actions {
  addResponse: (response: ChatResponse) => void
  setPrompt: (prompt: string) => void
  setTopK: (topK: number) => void
  setSimilarityThreshold: (similarityThreshold: number) => void
  setTemperature: (temperature: number) => void
  setUseRAG: (useRAG: boolean) => void
}

type Store = State & Actions

const initialState: State = {
  prompt: "",
  responses: [],
  topK: 3,
  similarityThreshold: 0.5,
  temperature: 0.7,
  useRAG: true,
}

export const useStore = create<Store>()((set, get) => ({
  ...initialState,
  setPrompt: prompt => set({ prompt }),
  addResponse: response => set({ responses: [...get().responses, response] }),
  setTopK: topK => set({ topK }),
  setSimilarityThreshold: similarityThreshold => set({ similarityThreshold }),
  setTemperature: temperature => set({ temperature }),
  setUseRAG: useRAG => set({ useRAG }),
}))
