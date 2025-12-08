declare global {
  namespace NodeJS {
    interface AppEnv {
      user: any
    }
    interface ProcessEnv {
      DATABASE_URL: string

      SMTP_HOST: string
      SMTP_PORT: string

      BETTER_AUTH_SECRET: string

      /** Default Ollama model to download when no models are available. */
      OLLAMA_MODEL: string

      // /** Ollama API base URL */
      OLLAMA_HOST: string

      /** Base URL for this Kellemes API */
      API_URL: string

      /** Primary Ollama model for chat generation */
      OLLAMA_MODEL: string

      // /** Model used for generating embeddings */
      // EMBEDDING_MODEL: string

      // /** Dimension of embedding vectors */
      // EMBEDDING_DIMENSION: string

      // /** Number of top results to retrieve in RAG search */
      // TOP_K_RESULTS: string

      // /** Minimum similarity threshold for RAG results (0-1) */
      // SIMILARITY_THRESHOLD: string

      // /** Directory path for data storage */
      // DATA_DIR: string
    }
  }
}

export {}
