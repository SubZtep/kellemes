declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Default Ollama model to download when no models are available. */
      OLLAMA_DEFAULT_MODEL: string

      // /** Ollama API base URL */
      // OLLAMA_BASE_URL: string

      // /** Primary Ollama model for chat generation */
      // OLLAMA_MODEL: string

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

      // /** HTTP server port for API */
      // API_PORT: string

      // /** PostgreSQL database host */
      // POSTGRES_HOST: string

      // /** PostgreSQL database port */
      // POSTGRES_PORT: string

      // /** PostgreSQL database name */
      // POSTGRES_DB: string

      // /** PostgreSQL database user */
      // POSTGRES_USER: string

      // /** PostgreSQL database password */
      // POSTGRES_PASSWORD: string
    }
  }
}

export {}
