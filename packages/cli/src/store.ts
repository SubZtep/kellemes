import type { ChatResponse } from "@kellemes/common"
import type { ModelResponse } from "ollama"
import { create } from "zustand"

export type ChatMessage = ChatResponse & { sender: "user" | "assistant"; createdAt: Date }
export type OllamaStatus = "connected" | "disconnected" | "checking"
export type RAGStatus = "ready" | "not ready" | "initializing"
export type Hotkey = "escape" | "return" | "space" | "leftArrow" | "rightArrow" | "upArrow" | "downArrow"

export interface State {
  /** Displayed key bindings on the footer. */
  keyBindings: { keys: string | string[]; description: string }[]

  /** Ollama version or null if the service is not available. */
  ollamaVersion: string | null

  /** Available Ollama models. */
  ollamaModels: ModelResponse[]

  /** Active Ollama model in the chat panel. */
  activeModel: string | null

  /** User input text prompt. */
  prompt: string
  /** Responses from the RAG service. */
  responses: ChatMessage[]

  ollamaStatus: OllamaStatus
  ragStatus: RAGStatus
  documentsCount: number

  topK: number
  similarityThreshold: number
  temperature: number | null
  useRAG: boolean
}

export interface Actions {
  setKeyBindings: (keyBindings: { keys: string | string[]; description: string }[]) => void
  setOllamaVersion: (ollamaVersion: string | null) => void
  setOllamaModels: (ollamaModels: ModelResponse[]) => void
  setActiveModel: (activeModel: string | null) => void
  addResponse: (response: ChatMessage) => void
  setPrompt: (prompt: string) => void
  setOllamaStatus: (ollamaStatus: OllamaStatus) => void
  setRAGStatus: (ragStatus: RAGStatus) => void
  setDocumentsCount: (documentsCount: number) => void
  setTopK: (topK: number) => void
  setSimilarityThreshold: (similarityThreshold: number) => void
  setTemperature: (temperature: number) => void
  setUseRAG: (useRAG: boolean) => void
}

type Store = State & Actions

const initialState: State = {
  keyBindings: [],
  ollamaVersion: null,
  ollamaModels: [],
  activeModel: null,
  prompt: "",
  responses: [],
  ollamaStatus: "checking",
  ragStatus: "initializing",
  documentsCount: 0,
  topK: 3,
  similarityThreshold: 0.5,
  temperature: 0.7,
  useRAG: false,
}

export const useStore = create<Store>()((set, get) => ({
  ...initialState,
  setKeyBindings: keyBindings => set({ keyBindings }),
  setOllamaVersion: ollamaVersion => {
    if (get().ollamaVersion !== ollamaVersion) {
      set({ ollamaVersion })
    }
  },
  setOllamaModels: ollamaModels =>
    set(state => {
      const prev = state.ollamaModels // Only update if models actually changed (by count or name)
      if (prev.length !== ollamaModels.length || prev.some((m, i) => m.name !== ollamaModels[i]?.name)) {
        return { ollamaModels }
      }
      return {}
    }),
  setActiveModel: activeModel => set({ activeModel }),
  setPrompt: prompt => set({ prompt }),
  addResponse: response => set({ responses: [...get().responses, response] }),
  setOllamaStatus: ollamaStatus => set({ ollamaStatus }),
  setRAGStatus: ragStatus => set({ ragStatus }),
  setDocumentsCount: documentsCount => set({ documentsCount }),
  setTopK: topK => set({ topK }),
  setSimilarityThreshold: similarityThreshold => set({ similarityThreshold }),
  setTemperature: temperature => set({ temperature }),
  setUseRAG: useRAG => set({ useRAG }),
}))
