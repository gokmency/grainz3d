'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  createSession,
  createViewport,
  ISessionApi,
  IViewportApi,
  IParameterApi,
} from '@shapediver/viewer';
import { ModelConfig, isConfigValid, isModelConfigValid, isDemoMode, MODELS, getDefaultModel } from '@/lib/config';
import { createDemoViewer, DemoViewerInstance } from '@/lib/demoViewerEngine';
import { Loader2, AlertCircle, Settings2, Box } from 'lucide-react';
import { ParameterPanel } from './ParameterPanel';
import { ViewerToolbar } from './ViewerToolbar';
import { EnvironmentSelector } from './EnvironmentSelector';
import { ShareURL, useShareURLLoader } from './ShareURL';
import { OutputsPanel } from './OutputsPanel';
import { PresetSelector, Preset } from './PresetSelector';
import { ARViewButton } from './ARViewButton';
import { ModelSelector } from './ModelSelector';
import { SignOutButton } from './SignOutButton';
import Link from 'next/link';
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
  const demoInstanceRef = useRef<DemoViewerInstance | null>(null);

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

  // Initialize ShapeDiver viewer or Three.js demo engine
  useEffect(() => {
    let isMounted = true;
    let localCanvas: HTMLCanvasElement | null = null;
    let localViewport: IViewportApi | null = null;
    let localSession: ISessionApi | null = null;

    const initViewer = async () => {
      if (!containerRef.current) {
        return;
      }

      // Cleanup container
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }

      const activeModel = currentModel || getDefaultModel();
      if (!activeModel) {
        setError('No model selected');
        setIsLoading(false);
        return;
      }

      // Check if we should run in demo UI mode
      if (isDemoMode(activeModel)) {
        console.log('[Viewer] Starting Demo Three.js Mode for:', activeModel.name);
        try {
          setIsLoading(true);
          setError(null);

          const demoInstance = createDemoViewer(
            containerRef.current,
            activeModel,
            setIsCustomizing
          );

          if (!isMounted) {
            demoInstance.destroy();
            return;
          }

          demoInstanceRef.current = demoInstance;
          sessionRef.current = demoInstance.session;
          viewportRef.current = demoInstance.viewport;
          setSession(demoInstance.session);
          setViewport(demoInstance.viewport);
          setParameters(demoInstance.parameters);
          setIsLoading(false);
          setIsReady(true);
          return;
        } catch (demoErr) {
          console.error('[Viewer] Demo mode error:', demoErr);
        }
      }

      // Real ShapeDiver connection mode
      try {
        console.log('[ShapeDiver] Starting initialization...');
        setIsLoading(true);
        setError(null);

        localCanvas = document.createElement('canvas');
        localCanvas.style.width = '100%';
        localCanvas.style.height = '100%';
        localCanvas.style.outline = 'none';
        containerRef.current.appendChild(localCanvas);
        canvasRef.current = localCanvas;

        localViewport = await createViewport({
          id: `viewport-${Date.now()}`,
          canvas: localCanvas,
        });

        if (!isMounted) {
          try { localViewport.close(); } catch (e) {}
          if (localCanvas && localCanvas.parentNode) localCanvas.parentNode.removeChild(localCanvas);
          return;
        }

        viewportRef.current = localViewport;
        setViewport(localViewport);

        localSession = await createSession({
          id: `session-${Date.now()}`,
          ticket: activeModel.ticket,
          modelViewUrl: activeModel.modelViewUrl,
        });

        if (!isMounted) {
          try { localSession.close(); } catch (e) {}
          try { localViewport.close(); } catch (e) {}
          if (localCanvas && localCanvas.parentNode) localCanvas.parentNode.removeChild(localCanvas);
          return;
        }

        sessionRef.current = localSession;
        setSession(localSession);

        const allParams = Object.values(localSession.parameters) as IParameterApi<unknown>[];
        const visibleParams = allParams
          .filter((p) => !p.hidden)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        setParameters(visibleParams);
        setIsLoading(false);
        setIsReady(true);
      } catch (err) {
        console.warn('[ShapeDiver] Connection error, falling back to interactive demo viewer:', err);
        if (isMounted && containerRef.current) {
          // Graceful fallback to demo viewer
          try {
            while (containerRef.current.firstChild) {
              containerRef.current.removeChild(containerRef.current.firstChild);
            }
            const demoInstance = createDemoViewer(
              containerRef.current,
              activeModel,
              setIsCustomizing
            );
            demoInstanceRef.current = demoInstance;
            sessionRef.current = demoInstance.session;
            viewportRef.current = demoInstance.viewport;
            setSession(demoInstance.session);
            setViewport(demoInstance.viewport);
            setParameters(demoInstance.parameters);
            setIsLoading(false);
            setIsReady(true);
          } catch (e) {
            setError('Failed to initialize 3D viewer');
            setIsLoading(false);
          }
        }
      }
    };

    initViewer();

    return () => {
      isMounted = false;

      if (demoInstanceRef.current) {
        demoInstanceRef.current.destroy();
        demoInstanceRef.current = null;
      }

      if (localSession) {
        try { localSession.close(); } catch (err) {}
      }

      if (localViewport) {
        try { localViewport.close(); } catch (err) {}
      }

      if (localCanvas && localCanvas.parentNode) {
        try { localCanvas.parentNode.removeChild(localCanvas); } catch (err) {}
      }

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
      if (demoInstanceRef.current) {
        demoInstanceRef.current.updateParameter(parameterId, value);
        return;
      }

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
    console.log('[Viewer] Applied preset:', preset.name);
    if (preset.values) {
      Object.entries(preset.values).forEach(([id, val]) => {
        handleParameterChange(id, val);
      });
    }
  }, [handleParameterChange]);

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
              Parametreler
            </h2>
          </div>
          {isCustomizing && (
            <div className="flex items-center gap-2 mt-2 text-xs text-amber-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Güncelleniyor...</span>
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
        {isReady && parameters.length > 0 && currentModel && (
          <div className="px-4 py-3 border-b border-zinc-800">
            <PresetSelector
              session={session}
              parameters={parameters}
              modelId={currentModel.id}
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
              Model bağlandığında parametreler burada görünecektir.
            </div>
          ) : parameters.length === 0 ? (
            <div className="p-4 text-zinc-500 text-sm">
              Bu model için parametre bulunamadı.
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

        {/* Sidebar Footer - Share, AR, Settings & Sign Out */}
        {isReady && (
          <div className="p-4 border-t border-zinc-800 flex flex-col gap-2">
            <div className="flex gap-2">
              <ShareURL session={session} parameters={parameters} modelId={currentModel?.id} />
              <ARViewButton viewport={viewport} session={session} />
            </div>
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Box className="w-4 h-4" />
                Panel
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Settings2 className="w-4 h-4" />
                Ayarlar
              </Link>
            </div>
            <SignOutButton />
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
                {currentModel ? `${currentModel.name} Yükleniyor...` : '3D Model Yükleniyor...'}
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
                    Bağlantı Hatası
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4">{error}</p>
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
