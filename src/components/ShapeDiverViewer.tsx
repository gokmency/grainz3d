'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createSession,
  createViewport,
  ISessionApi,
  IViewportApi,
  IParameterApi,
} from '@shapediver/viewer';
import { ModelConfig, isConfigValid, isModelConfigValid, MODELS, getDefaultModel } from '@/lib/config';
import { Loader2, AlertCircle, Settings2 } from 'lucide-react';
import { ParameterPanel } from './ParameterPanel';
import { ViewerToolbar } from './ViewerToolbar';
import { EnvironmentSelector } from './EnvironmentSelector';
import { ShareURL, useShareURLLoader } from './ShareURL';
import { OutputsPanel } from './OutputsPanel';
import { PresetSelector, Preset } from './PresetSelector';
import { ARViewButton } from './ARViewButton';
import { ModelSelector } from './ModelSelector';
import { debounce } from '@/hooks/useDebounce';

interface ShapeDiverViewerProps {
  className?: string;
  initialModel?: ModelConfig;
}

export function ShapeDiverViewer({ className = '', initialModel }: ShapeDiverViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<ISessionApi | null>(null);
  const viewportRef = useRef<IViewportApi | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [currentModel, setCurrentModel] = useState<ModelConfig | null>(initialModel || getDefaultModel());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parameters, setParameters] = useState<IParameterApi<unknown>[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [session, setSession] = useState<ISessionApi | null>(null);
  const [viewport, setViewport] = useState<IViewportApi | null>(null);

  // Handle model change
  const handleModelChange = useCallback((model: ModelConfig) => {
    setCurrentModel(model);
    // Reset states
    setIsReady(false);
    setParameters([]);
    setSession(null);
    setError(null);
  }, []);

  // Initialize ShapeDiver viewer
  useEffect(() => {
    let isMounted = true;
    let localCanvas: HTMLCanvasElement | null = null;
    let localViewport: IViewportApi | null = null;
    let localSession: ISessionApi | null = null;

    const initViewer = async () => {
      if (!containerRef.current) {
        console.log('[ShapeDiver] Container not ready');
        return;
      }

      // Validate configuration
      if (!isConfigValid()) {
        console.log('[ShapeDiver] Config invalid');
        setError(
          'ShapeDiver not configured. Please add your Ticket and Model View URL to .env.local file.'
        );
        setIsLoading(false);
        return;
      }

      // Validate current model
      if (!currentModel || !isModelConfigValid(currentModel)) {
        console.log('[ShapeDiver] Current model invalid');
        setError('Selected model configuration is invalid.');
        setIsLoading(false);
        return;
      }

      try {
        console.log('[ShapeDiver] Starting initialization...');
        console.log('[ShapeDiver] Model:', currentModel.name);
        setIsLoading(true);
        setError(null);

        // IMPORTANT: Clear the container completely to remove any leftover ShapeDiver UI elements
        // This prevents stacking of multiple loading screens from aborted initializations
        if (containerRef.current) {
          while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
          }
        }

        // Create canvas element dynamically
        localCanvas = document.createElement('canvas');
        localCanvas.style.width = '100%';
        localCanvas.style.height = '100%';
        localCanvas.style.outline = 'none';
        containerRef.current.appendChild(localCanvas);
        canvasRef.current = localCanvas;

        // Create the viewport
        console.log('[ShapeDiver] Creating viewport...');
        localViewport = await createViewport({
          id: `viewport-${Date.now()}`,
          canvas: localCanvas,
        });

        if (!isMounted) {
          console.log('[ShapeDiver] Unmounted during viewport creation, cleaning up...');
          // Clean up viewport before returning
          try {
            localViewport.close();
          } catch (e) {
            console.debug('[ShapeDiver] Viewport close error:', e);
          }
          if (localCanvas && localCanvas.parentNode) {
            localCanvas.parentNode.removeChild(localCanvas);
          }
          return;
        }

        viewportRef.current = localViewport;
        setViewport(localViewport);
        console.log('[ShapeDiver] Viewport created successfully');

        // Create the session with current model
        console.log('[ShapeDiver] Creating session...');
        console.log('[ShapeDiver] Ticket:', currentModel.ticket.substring(0, 30) + '...');
        console.log('[ShapeDiver] URL:', currentModel.modelViewUrl);

        localSession = await createSession({
          id: `session-${Date.now()}`,
          ticket: currentModel.ticket,
          modelViewUrl: currentModel.modelViewUrl,
        });

        if (!isMounted) {
          console.log('[ShapeDiver] Unmounted during session creation, cleaning up...');
          // Clean up session and viewport before returning
          try {
            localSession.close();
          } catch (e) {
            console.debug('[ShapeDiver] Session close error:', e);
          }
          try {
            localViewport.close();
          } catch (e) {
            console.debug('[ShapeDiver] Viewport close error:', e);
          }
          if (localCanvas && localCanvas.parentNode) {
            localCanvas.parentNode.removeChild(localCanvas);
          }
          return;
        }

        sessionRef.current = localSession;
        setSession(localSession);
        console.log('[ShapeDiver] Session created successfully');

        // Get all parameters (excluding hidden ones)
        const allParams = Object.values(localSession.parameters) as IParameterApi<unknown>[];
        console.log('[ShapeDiver] Total parameters:', allParams.length);

        const visibleParams = allParams
          .filter((p) => !p.hidden)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        console.log('[ShapeDiver] Visible parameters:', visibleParams.length);
        visibleParams.forEach((p) => {
          console.log(`  - ${p.name} (${p.type}): ${p.value}`);
        });

        // Log available exports
        const exports = Object.values(localSession.exports);
        console.log('[ShapeDiver] Available exports:', exports.length);
        exports.forEach((exp) => {
          console.log(`  - ${exp.name} (${exp.type})`);
        });

        // Log available outputs
        const outputs = Object.values(localSession.outputs);
        console.log('[ShapeDiver] Available outputs:', outputs.length);

        setParameters(visibleParams);
        setIsLoading(false);
        setIsReady(true);
      } catch (err) {
        console.error('[ShapeDiver] Initialization error:', err);
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to initialize ShapeDiver viewer'
          );
          setIsLoading(false);
        }
      }
    };

    initViewer();

    // Cleanup function
    return () => {
      console.log('[ShapeDiver] Cleanup triggered');
      isMounted = false;

      // Close session first
      if (localSession) {
        try {
          localSession.close();
          console.log('[ShapeDiver] Session closed');
        } catch (err) {
          console.debug('[ShapeDiver] Session cleanup:', err);
        }
      }

      // Then close viewport
      if (localViewport) {
        try {
          localViewport.close();
          console.log('[ShapeDiver] Viewport closed');
        } catch (err) {
          console.debug('[ShapeDiver] Viewport cleanup:', err);
        }
      }

      // Finally remove canvas
      if (localCanvas && localCanvas.parentNode) {
        try {
          localCanvas.parentNode.removeChild(localCanvas);
          console.log('[ShapeDiver] Canvas removed');
        } catch (err) {
          console.debug('[ShapeDiver] Canvas removal:', err);
        }
      }

      // Clear refs
      viewportRef.current = null;
      sessionRef.current = null;
      canvasRef.current = null;
    };
  }, [currentModel]); // Re-initialize when model changes

  // Debounced customization function
  const debouncedCustomize = useCallback(
    debounce(async () => {
      if (!sessionRef.current) return;

      try {
        setIsCustomizing(true);
        await sessionRef.current.customize();
      } catch (err) {
        console.error('Customization error:', err);
      } finally {
        setIsCustomizing(false);
      }
    }, 300),
    []
  );

  // Handle parameter value change
  const handleParameterChange = useCallback(
    async (parameterId: string, value: string | number | boolean) => {
      const currentSession = sessionRef.current;
      if (!currentSession) return;

      const param = currentSession.parameters[parameterId];
      if (!param) return;

      try {
        // Update the parameter value
        param.value = value;
        // Trigger debounced customization
        debouncedCustomize();
      } catch (err) {
        console.error('Parameter update error:', err);
      }
    },
    [debouncedCustomize]
  );

  // Handle preset application
  const handleApplyPreset = useCallback((preset: Preset) => {
    console.log('[ShapeDiver] Applied preset:', preset.name);
  }, []);

  // Load configuration from URL
  useShareURLLoader(session, handleParameterChange);

  return (
    <div className={`flex h-screen bg-zinc-950 ${className}`}>
      {/* Left Sidebar - Parameter Panel */}
      <aside className="w-80 flex-shrink-0 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">
              Parameters
            </h2>
          </div>
          {isCustomizing && (
            <div className="flex items-center gap-2 mt-2 text-xs text-amber-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        {/* Model Selector - Only shows if multiple models */}
        {MODELS.length > 1 && (
          <div className="px-4 py-3 border-b border-zinc-800">
            <ModelSelector
              currentModel={currentModel}
              onModelChange={handleModelChange}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Preset Selector */}
        {isReady && parameters.length > 0 && (
          <div className="px-4 py-3 border-b border-zinc-800">
            <PresetSelector
              session={session}
              parameters={parameters}
              onApplyPreset={handleApplyPreset}
            />
          </div>
        )}

        {/* Parameters List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 text-zinc-500 text-sm">
              Parameters will appear here once connected.
            </div>
          ) : parameters.length === 0 ? (
            <div className="p-4 text-zinc-500 text-sm">
              No parameters available for this model.
            </div>
          ) : (
            <ParameterPanel
              parameters={parameters}
              onParameterChange={handleParameterChange}
            />
          )}
        </div>

        {/* Outputs Panel */}
        {isReady && <OutputsPanel session={session} />}

        {/* Sidebar Footer - Share & AR */}
        {isReady && (
          <div className="p-4 border-t border-zinc-800 flex gap-2">
            <ShareURL session={session} parameters={parameters} />
            <ARViewButton viewport={viewport} session={session} />
          </div>
        )}
      </aside>

      {/* Main Viewport */}
      <main className="flex-1 relative">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-zinc-600 animate-spin" />
              <span className="text-zinc-500 text-sm">
                {currentModel ? `Loading ${currentModel.name}...` : 'Loading 3D Model...'}
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
            <div className="max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-zinc-100 font-medium mb-2">
                    Connection Error
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">{error}</p>
                  <div className="bg-zinc-950 rounded p-3 text-xs font-mono text-zinc-500">
                    <p className="mb-1">1. Check your Ticket and Model View URL</p>
                    <p className="mb-1">2. Add localhost to allowed domains</p>
                    <p>3. Restart the development server</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Viewer Toolbar */}
        {isReady && (
          <ViewerToolbar
            session={session}
            viewport={viewport}
          />
        )}

        {/* Environment Selector */}
        {isReady && <EnvironmentSelector viewport={viewport} />}

        {/* Canvas Container */}
        <div
          ref={containerRef}
          className="w-full h-full absolute inset-0"
          style={{ visibility: isReady ? 'visible' : 'hidden' }}
        />
      </main>
    </div>
  );
}
