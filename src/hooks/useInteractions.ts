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
    onHover,
    onSelect,
  } = options;

  const [state, setState] = useState<InteractionState>({
    hoveredNodeId: null,
    selectedNodeId: null,
    hoveredNodeName: null,
    selectedNodeName: null,
  });

  const cleanupRef = useRef<(() => void) | null>(null);

  // Initialize basic interaction handling
  useEffect(() => {
    if (!viewport || !session) return;

    // Basic fallback using canvas events
    const canvas = viewport.canvas;
    if (!canvas) return;

    const handleMouseMove = () => {
      if (!enableHover) return;
      // Basic hover detection - can be extended with raycasting
    };

    const handleClick = () => {
      if (!enableSelection) return;
      // Basic selection detection - can be extended with raycasting
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    cleanupRef.current = () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [viewport, session, enableHover, enableSelection]);

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
    isInteractionEnabled: true,
  };
}
