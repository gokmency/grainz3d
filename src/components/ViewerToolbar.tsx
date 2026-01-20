'use client';

import { useState, useCallback, useMemo } from 'react';
import { ISessionApi, IViewportApi, IExportApi } from '@shapediver/viewer';
import {
  Download,
  Camera,
  RotateCcw,
  Play,
  Pause,
  Maximize2,
  Box,
  FileType,
  Loader2,
  ChevronDown,
  Info,
} from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ViewerToolbarProps {
  session: ISessionApi | null;
  viewport: IViewportApi | null;
  onAutoRotateChange?: (enabled: boolean) => void;
}

interface DynamicExportOption {
  id: string;
  name: string;
  displayName: string;
  type: string;
  icon: React.ReactNode;
  exportApi: IExportApi;
}

// Helper to get icon based on export type/name
function getExportIcon(name: string, type: string): React.ReactNode {
  const lowerName = name.toLowerCase();
  const lowerType = type.toLowerCase();

  if (lowerName.includes('stl') || lowerType.includes('stl')) {
    return <Box className="w-4 h-4" />;
  }
  if (lowerName.includes('obj') || lowerType.includes('obj')) {
    return <FileType className="w-4 h-4" />;
  }
  if (lowerName.includes('gltf') || lowerName.includes('glb') || lowerType.includes('gltf')) {
    return <Box className="w-4 h-4" />;
  }
  if (lowerName.includes('step') || lowerName.includes('stp') || lowerType.includes('step')) {
    return <FileType className="w-4 h-4" />;
  }
  // Default icon for any export
  return <Download className="w-4 h-4" />;
}

// Helper to format display name
function formatExportDisplayName(name: string, index: number): string {
  if (!name || name.trim() === '') {
    return `Export ${index + 1}`;
  }
  // Capitalize first letter of each word
  return name
    .split(/[\s_-]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function ViewerToolbar({
  session,
  viewport,
  onAutoRotateChange,
}: ViewerToolbarProps) {
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  // Get all available exports from the model dynamically
  const dynamicExports = useMemo((): DynamicExportOption[] => {
    if (!session) {
      return [];
    }

    const exports = Object.values(session.exports);
    console.log('[ViewerToolbar] Available exports:', exports.map(e => ({
      id: e.id,
      name: e.name,
      type: e.type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      displayname: (e as any).displayname
    })));

    return exports.map((exp, index) => ({
      id: exp.id,
      name: exp.name || '',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      displayName: formatExportDisplayName(exp.name || (exp as any).displayname || '', index),
      type: exp.type || '',
      icon: getExportIcon(exp.name || '', exp.type || ''),
      exportApi: exp,
    }));
  }, [session]);

  // Check if any exports are available
  const hasAnyExports = dynamicExports.length > 0;

  // Reset camera to default view
  const handleResetCamera = useCallback(async () => {
    if (!viewport) return;

    try {
      // Reset camera to fit all content using zoomTo
      // ShapeDiver API: viewport.camera.zoomTo() or viewport.camera.reset()
      if (viewport.camera) {
        // Try zoomTo first (fits all visible content)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof (viewport.camera as any).zoomTo === 'function') {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (viewport.camera as any).zoomTo();
        } else if (typeof (viewport.camera as any).reset === 'function') {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (viewport.camera as any).reset();
        }
      }
      setExportStatus('Camera reset!');
      setTimeout(() => setExportStatus(null), 1500);
    } catch (err) {
      console.error('Camera reset error:', err);
    }
  }, [viewport]);

  // Toggle auto-rotate
  const handleToggleAutoRotate = useCallback(() => {
    if (!viewport) return;

    try {
      const newState = !isAutoRotating;
      setIsAutoRotating(newState);

      // Enable/disable auto rotation on viewport camera
      // ShapeDiver uses cameraControls property
      if (viewport.camera) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cameraControls = (viewport as any).cameraControls;
        if (cameraControls) {
          cameraControls.autoRotate = newState;
          cameraControls.autoRotateSpeed = newState ? 1.0 : 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if ((viewport.camera as any).enableCameraControls) {
          // Fallback to enableCameraControls if available
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (viewport.camera as any).enableCameraControls({
            autoRotate: newState,
            autoRotateSpeed: 1.0,
          });
        }
      }

      onAutoRotateChange?.(newState);
    } catch (err) {
      console.error('Auto-rotate toggle error:', err);
    }
  }, [viewport, isAutoRotating, onAutoRotateChange]);

  // Take screenshot
  const handleScreenshot = useCallback(async () => {
    if (!viewport) return;

    try {
      setIsTakingScreenshot(true);

      // Get screenshot from viewport - ShapeDiver API uses string format parameter
      // Format: 'image/png' or 'image/jpeg'
      const screenshot = await viewport.getScreenshot('image/png');

      // Create download link
      const link = document.createElement('a');
      link.href = screenshot;
      link.download = `shapediver-screenshot-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportStatus('Screenshot saved!');
      setTimeout(() => setExportStatus(null), 2000);
    } catch (err) {
      console.error('Screenshot error:', err);
      setExportStatus('Screenshot failed');
      setTimeout(() => setExportStatus(null), 2000);
    } finally {
      setIsTakingScreenshot(false);
    }
  }, [viewport]);

  // Handle export using dynamic export option
  const handleExport = useCallback(async (exportOption: DynamicExportOption) => {
    if (!session) {
      return;
    }

    try {
      setIsExporting(true);
      setShowExportMenu(false);
      setExportStatus(`Exporting ${exportOption.displayName}...`);

      // Request the export directly using the API reference
      const result = await exportOption.exportApi.request();
      console.log('[ViewerToolbar] Export result:', result);

      if (result.content && result.content.length > 0) {
        // Open download link
        const href = result.content[0].href;
        if (href) {
          window.open(href, '_blank');
          setExportStatus(`${exportOption.displayName} exported!`);
          setTimeout(() => setExportStatus(null), 3000);
          return;
        }
      }

      // No content available
      setExportStatus(`Export failed - no content available`);
      setTimeout(() => setExportStatus(null), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setExportStatus('Export failed');
      setTimeout(() => setExportStatus(null), 2000);
    } finally {
      setIsExporting(false);
    }
  }, [session]);

  // Fullscreen toggle
  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
      {/* Main Toolbar */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-xl">
        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={!session || isExporting}
            className="flex items-center gap-1 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export Model"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Export Menu */}
          {showExportMenu && (
            <div className="absolute top-full right-0 mt-1 py-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl min-w-[200px]">
              {hasAnyExports ? (
                <>
                  {dynamicExports.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleExport(option)}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      {option.icon}
                      <span className="flex-1 text-left">{option.displayName}</span>
                      <span className="text-xs text-emerald-500">✓</span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-3 py-3 text-sm text-zinc-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-amber-500" />
                    <span className="font-medium">No exports available</span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    This model doesn&apos;t have export components configured in Grasshopper.
                    Contact the model creator to add STL, OBJ, or other export options.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-700" />

        {/* Screenshot */}
        <button
          onClick={handleScreenshot}
          disabled={!viewport || isTakingScreenshot}
          className="flex items-center gap-1 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Take Screenshot"
        >
          {isTakingScreenshot ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Screenshot</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-700" />

        {/* Camera Controls */}
        <button
          onClick={handleResetCamera}
          disabled={!viewport}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleToggleAutoRotate}
          disabled={!viewport}
          className={`p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAutoRotating
            ? 'text-emerald-400 bg-emerald-900/30 hover:bg-emerald-900/50'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
            }`}
          title={isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
        >
          {isAutoRotating ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={handleFullscreen}
          className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Status Message */}
      {exportStatus && (
        <div className="px-3 py-2 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-lg text-xs text-zinc-300 animate-fade-in">
          {exportStatus}
        </div>
      )}
    </div>
  );
}
