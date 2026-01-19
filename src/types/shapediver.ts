import type { IParameterApi, ISessionApi, IViewportApi } from '@shapediver/viewer';

/**
 * Extended parameter type with additional UI-related properties
 */
export interface ParameterDefinition {
  id: string;
  name: string;
  displayname?: string;
  type: string;
  value: string | number | boolean;
  defval?: string;
  min?: number;
  max?: number;
  choices?: string[];
  decimalplaces?: number;
  hidden?: boolean;
  order?: number;
  group?: {
    id: string;
    name: string;
  };
  tooltip?: string;
}

/**
 * Grouped parameters for UI organization
 */
export interface ParameterGroup {
  id: string;
  name: string;
  parameters: ParameterDefinition[];
}

/**
 * ShapeDiver session state
 */
export interface ShapeDiverState {
  session: ISessionApi | null;
  viewport: IViewportApi | null;
  parameters: IParameterApi<unknown>[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Parameter update event
 */
export interface ParameterUpdateEvent {
  parameterId: string;
  value: string | number | boolean;
}
