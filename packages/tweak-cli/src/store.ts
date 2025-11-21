import type { ChatResponse } from "@kellemes/core"
import { create } from "zustand"

export type ChatMessage = ChatResponse & { sender: "user" | "assistant"; createdAt: Date }
export type OllamaStatus = "connected" | "disconnected" | "checking"
export type RAGStatus = "ready" | "not ready" | "initializing"
export type Hotkey = "escape" | "return" | "space" | "leftArrow" | "rightArrow" | "upArrow" | "downArrow"

export interface State {
  keyPressed: Hotkey | null
  inputActive: boolean

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
  setKeyPressed: (keyPressed: Hotkey | null) => void
  setInputActive: (inputActive: boolean) => void
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
  keyPressed: null,
  inputActive: false,
  activeModel: null,
  prompt: "",
  responses: [],
  ollamaStatus: "checking",
  ragStatus: "initializing",
  documentsCount: 0,
  topK: 3,
  similarityThreshold: 0.5,
  temperature: 0.7,
  useRAG: true,
}

export const useStore = create<Store>()((set, get) => ({
  ...initialState,
  setKeyPressed: keyPressed => set({ keyPressed }),
  setInputActive: inputActive => set({ inputActive }),
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
