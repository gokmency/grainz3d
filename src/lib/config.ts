/**
 * ShapeDiver Configuration
 * 
 * Supports multiple models via environment variables.
 * Add models by setting NEXT_PUBLIC_SHAPEDIVER_MODEL_X_TICKET and NEXT_PUBLIC_SHAPEDIVER_MODEL_X_URL
 * 
 * Note: Next.js requires static access to process.env variables for client-side bundling.
 * Dynamic access like process.env[`VAR_${i}`] won't work on the client.
 */

export interface ModelConfig {
  id: string;
  name: string;
  ticket: string;
  modelViewUrl: string;
  description?: string;
  thumbnail?: string;
}

/**
 * Parse models from environment variables
 * We must use static process.env access for Next.js client-side bundling
 */
function parseModelsFromEnv(): ModelConfig[] {
  const models: ModelConfig[] = [];
  
  // Check for legacy single model config first
  const legacyTicket = process.env.NEXT_PUBLIC_SHAPEDIVER_TICKET;
  const legacyUrl = process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_VIEW_URL;
  
  if (legacyTicket && legacyUrl) {
    models.push({
      id: 'default',
      name: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_NAME || 'Default Model',
      ticket: legacyTicket,
      modelViewUrl: legacyUrl,
      description: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_DESCRIPTION || '',
    });
  }
  
  // Model 1 - Static access required for Next.js client bundling
  if (process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_1_TICKET && process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_1_URL) {
    models.push({
      id: 'model-1',
      name: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_1_NAME || 'Model 1',
      ticket: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_1_TICKET,
      modelViewUrl: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_1_URL,
      description: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_1_DESCRIPTION || '',
      thumbnail: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_1_THUMBNAIL || '',
    });
  }

  // Model 2
  if (process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_2_TICKET && process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_2_URL) {
    models.push({
      id: 'model-2',
      name: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_2_NAME || 'Model 2',
      ticket: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_2_TICKET,
      modelViewUrl: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_2_URL,
      description: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_2_DESCRIPTION || '',
      thumbnail: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_2_THUMBNAIL || '',
    });
  }

  // Model 3
  if (process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_3_TICKET && process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_3_URL) {
    models.push({
      id: 'model-3',
      name: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_3_NAME || 'Model 3',
      ticket: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_3_TICKET,
      modelViewUrl: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_3_URL,
      description: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_3_DESCRIPTION || '',
      thumbnail: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_3_THUMBNAIL || '',
    });
  }

  // Model 4
  if (process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_4_TICKET && process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_4_URL) {
    models.push({
      id: 'model-4',
      name: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_4_NAME || 'Model 4',
      ticket: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_4_TICKET,
      modelViewUrl: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_4_URL,
      description: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_4_DESCRIPTION || '',
      thumbnail: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_4_THUMBNAIL || '',
    });
  }

  // Model 5
  if (process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_5_TICKET && process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_5_URL) {
    models.push({
      id: 'model-5',
      name: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_5_NAME || 'Model 5',
      ticket: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_5_TICKET,
      modelViewUrl: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_5_URL,
      description: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_5_DESCRIPTION || '',
      thumbnail: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_5_THUMBNAIL || '',
    });
  }
  
  return models;
}

/**
 * All available models
 */
export const MODELS = parseModelsFromEnv();

/**
 * Get the default model (first one)
 */
export function getDefaultModel(): ModelConfig | null {
  return MODELS.length > 0 ? MODELS[0] : null;
}

/**
 * Get a model by ID
 */
export function getModelById(id: string): ModelConfig | null {
  return MODELS.find(m => m.id === id) || null;
}

/**
 * Legacy config for backward compatibility
 */
export const SHAPEDIVER_CONFIG = {
  ticket: process.env.NEXT_PUBLIC_SHAPEDIVER_TICKET || '',
  modelViewUrl: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_VIEW_URL || '',
} as const;

/**
 * Validate that at least one model is configured
 */
export function isConfigValid(): boolean {
  return MODELS.length > 0 && MODELS.some(m => 
    m.ticket.length > 0 && 
    m.ticket !== 'your-ticket-here' && 
    m.modelViewUrl.length > 0
  );
}

/**
 * Validate a specific model config
 */
export function isModelConfigValid(model: ModelConfig): boolean {
  return (
    model.ticket.length > 0 &&
    model.ticket !== 'your-ticket-here' &&
    model.modelViewUrl.length > 0
  );
}
