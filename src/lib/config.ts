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

export const DEFAULT_DEMO_MODELS: ModelConfig[] = [
  {
    id: 'model-1',
    name: 'Ergonomik Dinlenme Koltuğu',
    ticket: 'demo-chair-ticket',
    modelViewUrl: 'demo://chair',
    description: 'Boyutları, eğim açısı, minderleri ve kumaş renkleri özelleştirilebilir parametrik koltuk.',
    thumbnail: '/chair.png',
  },
  {
    id: 'model-2',
    name: 'Minimalist Yemek Masası',
    ticket: 'demo-table-ticket',
    modelViewUrl: 'demo://table',
    description: 'Tabla boyutu, kenar pahı, malzeme kaplaması ve vurgu renkleri ayarlanabilir modern masa.',
    thumbnail: '/table.png',
  },
  {
    id: 'model-3',
    name: 'Seramik Tasarım Vazo',
    ticket: 'demo-vase-ticket',
    modelViewUrl: 'demo://vase',
    description: 'Yüksekliği, taban genişliği, boğum oranı ve sır rengi değiştirilebilir generatif vazo.',
    thumbnail: '/vase.png',
  },
];

/**
 * Parse models from environment variables
 * We must use static process.env access for Next.js client-side bundling
 */
function parseModelsFromEnv(): ModelConfig[] {
  const models: ModelConfig[] = [];
  
  // Check for legacy single model config first
  const legacyTicket = process.env.NEXT_PUBLIC_SHAPEDIVER_TICKET;
  const legacyUrl = process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_VIEW_URL;
  
  if (legacyTicket && legacyUrl && legacyTicket !== 'your-ticket-here') {
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
  
  if (models.length === 0) {
    return DEFAULT_DEMO_MODELS;
  }

  return models;
}

/**
 * All available models
 */
export const MODELS = parseModelsFromEnv();

/**
 * Check if the application or a specific model is running in demo UI mode
 */
export function isDemoMode(model?: ModelConfig | null): boolean {
  if (model) {
    return model.ticket.startsWith('demo-') || model.modelViewUrl.startsWith('demo://');
  }
  return MODELS.length === 0 || MODELS.every(m => m.ticket.startsWith('demo-') || m.ticket === 'your-ticket-here');
}

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
  return MODELS.length > 0;
}

/**
 * Validate a specific model config
 */
export function isModelConfigValid(model: ModelConfig): boolean {
  return (
    model.ticket.length > 0 &&
    model.modelViewUrl.length > 0
  );
}
