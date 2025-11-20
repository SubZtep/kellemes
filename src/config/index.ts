import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'xpllmoro',
    embeddingModel: process.env.EMBEDDING_MODEL || 'nomic-embed-text',
    embeddingDimension: parseInt(process.env.EMBEDDING_DIMENSION || '768', 10),
  },

  vectorDb: {
    path: process.env.VECTOR_DB_PATH || './data/vectors',
  },

  rag: {
    topK: parseInt(process.env.TOP_K_RESULTS || '3', 10),
    similarityThreshold: parseFloat(process.env.SIMILARITY_THRESHOLD || '0.7'),
  },

  dataPath: './qa.json',
} as const;

export default config;
