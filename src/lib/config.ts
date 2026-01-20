/**
 * ShapeDiver Configuration
 * 
 * Supports multiple models via environment variables.
 * Add models by setting NEXT_PUBLIC_SHAPEDIVER_MODEL_X_TICKET and NEXT_PUBLIC_SHAPEDIVER_MODEL_X_URL
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
 * Format: NEXT_PUBLIC_SHAPEDIVER_MODEL_1_NAME, NEXT_PUBLIC_SHAPEDIVER_MODEL_1_TICKET, etc.
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
  
  // Check for numbered models (1-10)
  for (let i = 1; i <= 10; i++) {
    const ticket = process.env[`NEXT_PUBLIC_SHAPEDIVER_MODEL_${i}_TICKET`];
    const url = process.env[`NEXT_PUBLIC_SHAPEDIVER_MODEL_${i}_URL`];
    
    if (ticket && url) {
      models.push({
        id: `model-${i}`,
        name: process.env[`NEXT_PUBLIC_SHAPEDIVER_MODEL_${i}_NAME`] || `Model ${i}`,
        ticket,
        modelViewUrl: url,
        description: process.env[`NEXT_PUBLIC_SHAPEDIVER_MODEL_${i}_DESCRIPTION`] || '',
        thumbnail: process.env[`NEXT_PUBLIC_SHAPEDIVER_MODEL_${i}_THUMBNAIL`] || '',
      });
    }
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
