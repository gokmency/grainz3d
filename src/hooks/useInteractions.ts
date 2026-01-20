'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { IViewportApi, ISessionApi } from '@shapediver/viewer';

export interface InteractionState {
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  hoveredNodeName: string | null;
  selectedNodeName: string | null;
}

export interface UseInteractionsOptions {
  enableHover?: boolean;
  enableSelection?: boolean;
  hoverColor?: string;
  selectionColor?: string;
  onHover?: (nodeId: string | null, nodeName: string | null) => void;
  onSelect?: (nodeId: string | null, nodeName: string | null) => void;
}

const DEFAULT_HOVER_COLOR = '#3b82f6'; // Blue
const DEFAULT_SELECTION_COLOR = '#10b981'; // Emerald

export function useInteractions(
  viewport: IViewportApi | null,
  session: ISessionApi | null,
  options: UseInteractionsOptions = {}
) {
  const {
    enableHover = true,
    enableSelection = true,
    hoverColor = DEFAULT_HOVER_COLOR,
    selectionColor = DEFAULT_SELECTION_COLOR,
    onHover,
    onSelect,
  } = options;

  const [state, setState] = useState<InteractionState>({
    hoveredNodeId: null,
    selectedNodeId: null,
    hoveredNodeName: null,
    selectedNodeName: null,
  });

  const interactionEngineRef = useRef<any>(null);
  const originalMaterialsRef = useRef<Map<string, any>>(new Map());

  // Initialize interaction engine
  useEffect(() => {
    if (!viewport || !session) return;

    const setupInteractions = async () => {
      try {
        // Try to import and create interaction engine
        // Note: This is a dynamic import as the feature may not be available
        const { createInteractionEngine } = await import(
          '@shapediver/viewer.features.interaction'
        ).catch(() => ({ createInteractionEngine: null }));

        if (createInteractionEngine) {
          const engine = createInteractionEngine(viewport);
          interactionEngineRef.current = engine;

          // Configure hover behavior
          if (enableHover && engine.hovering) {
            engine.hovering.hoverStyle = {
              color: hoverColor,
              opacity: 0.8,
            };
          }

          // Configure selection behavior
          if (enableSelection && engine.selection) {
            engine.selection.selectionStyle = {
              color: selectionColor,
              opacity: 1.0,
            };
          }

          console.log('[Interactions] Engine initialized');
        } else {
          console.log('[Interactions] Feature not available, using fallback');
          // Fallback: Set up basic mouse events on canvas
          setupFallbackInteractions();
        }
      } catch (err) {
        console.log('[Interactions] Using fallback mode:', err);
        setupFallbackInteractions();
      }
    };

    const setupFallbackInteractions = () => {
      // Basic fallback using viewport events if available
      const canvas = viewport.canvas;
      if (!canvas) return;

      const handleMouseMove = (event: MouseEvent) => {
        if (!enableHover) return;
        // Basic hover detection would go here
        // This is a simplified fallback
      };

      const handleClick = (event: MouseEvent) => {
        if (!enableSelection) return;
        // Basic selection detection would go here
        // This is a simplified fallback
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleClick);

      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleClick);
      };
    };

    setupInteractions();

    return () => {
      if (interactionEngineRef.current) {
        try {
          interactionEngineRef.current.dispose?.();
        } catch {
          // Ignore cleanup errors
        }
        interactionEngineRef.current = null;
      }
    };
  }, [viewport, session, enableHover, enableSelection, hoverColor, selectionColor]);

  // Handle hover state changes
  const handleHover = useCallback(
    (nodeId: string | null, nodeName: string | null) => {
      setState((prev) => ({
        ...prev,
        hoveredNodeId: nodeId,
        hoveredNodeName: nodeName,
      }));
      onHover?.(nodeId, nodeName);
    },
    [onHover]
  );

  // Handle selection state changes
  const handleSelect = useCallback(
    (nodeId: string | null, nodeName: string | null) => {
      setState((prev) => ({
        ...prev,
        selectedNodeId: nodeId,
        selectedNodeName: nodeName,
      }));
      onSelect?.(nodeId, nodeName);
    },
    [onSelect]
  );

  // Clear selection
  const clearSelection = useCallback(() => {
    if (interactionEngineRef.current?.selection) {
      interactionEngineRef.current.selection.clear();
    }
    handleSelect(null, null);
  }, [handleSelect]);

  // Clear hover
  const clearHover = useCallback(() => {
    handleHover(null, null);
  }, [handleHover]);

  return {
    ...state,
    clearSelection,
    clearHover,
    isInteractionEnabled: !!interactionEngineRef.current,
  };
}
