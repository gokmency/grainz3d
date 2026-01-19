/**
 * ShapeDiver Configuration
 * 
 * These values come from your ShapeDiver dashboard.
 * See .env.example for instructions on how to find them.
 */
export const SHAPEDIVER_CONFIG = {
  /**
   * The Ticket (Model View ID) for your ShapeDiver model.
   * Find this in: Dashboard > Your Model > Edit > Developers > Embedding > Ticket for embedding
   */
  ticket: process.env.NEXT_PUBLIC_SHAPEDIVER_TICKET || '',
  
  /**
   * The Model View URL (Geometry Backend URL).
   * Find this in: Dashboard > Your Model > Edit > Developers > Embedding > Model view URL
   */
  modelViewUrl: process.env.NEXT_PUBLIC_SHAPEDIVER_MODEL_VIEW_URL || '',
} as const;

/**
 * Validate that the configuration is properly set up
 */
export function isConfigValid(): boolean {
  return (
    SHAPEDIVER_CONFIG.ticket.length > 0 &&
    SHAPEDIVER_CONFIG.ticket !== 'your-ticket-here' &&
    SHAPEDIVER_CONFIG.modelViewUrl.length > 0
  );
}
