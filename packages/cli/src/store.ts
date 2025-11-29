import type { ChatResponse } from "@kellemes/common"
import type { ModelResponse, Options } from "ollama"
import { create } from "zustand"

export const _parameters: Partial<
  Record<keyof Options | "system_prompt", { default: number | string; type: "float" | "number" | "string" }>
> = {
  temperature: {
    default: 0.7,
    type: "float",
  },
  top_k: {
    default: 40,
    type: "number",
  },
  system_prompt: {
    default: "ALWAYS reply in Pirate language.",
    type: "string",
  },
}

export type ChatMessage = ChatResponse & {
  /** `user` | `assistant` | `system` */
  sender: string
  createdAt: Date
}
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

  parameters: Record<string, number | string>

  ollamaStatus: OllamaStatus
  ragStatus: RAGStatus
  documentsCount: number

  useRAG: boolean
}

export interface Actions {
  setKeyBindings: (keyBindings: { keys: string | string[]; description: string }[]) => void
  setOllamaVersion: (ollamaVersion: string | null) => void
  setOllamaModels: (ollamaModels: ModelResponse[]) => void
  setActiveModel: (activeModel: string | null) => void
  addResponse: (response: ChatMessage) => void
  setParameters: (parameters: Record<string, number | string>) => void
  setParameter: (key: string, value: number | string) => void
  setPrompt: (prompt: string) => void
  setOllamaStatus: (ollamaStatus: OllamaStatus) => void
  setRAGStatus: (ragStatus: RAGStatus) => void
  setDocumentsCount: (documentsCount: number) => void
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
  parameters: Object.fromEntries(Object.entries(_parameters).map(([key, value]) => [key, value.default])),
  ollamaStatus: "checking",
  ragStatus: "initializing",
  documentsCount: 0,
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
  setParameters: parameters => set({ parameters }),
  setParameter: (key: string, value: number | string) =>
    set(state => ({
      parameters: {
        ...state.parameters,
        [key]: value,
      },
    })),
  setOllamaStatus: ollamaStatus => set({ ollamaStatus }),
  setRAGStatus: ragStatus => set({ ragStatus }),
  setDocumentsCount: documentsCount => set({ documentsCount }),
  setUseRAG: useRAG => set({ useRAG }),
}))
