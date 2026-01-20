'use client';

import { useState, useCallback, useMemo } from 'react';
import { ISessionApi, IViewportApi } from '@shapediver/viewer';
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

interface ViewerToolbarProps {
  session: ISessionApi | null;
  viewport: IViewportApi | null;
  onAutoRotateChange?: (enabled: boolean) => void;
}

interface ExportOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  format: string;
  requiresGrasshopper?: boolean;
}

const EXPORT_OPTIONS: ExportOption[] = [
  { id: 'stl', name: 'STL', icon: <Box className="w-4 h-4" />, format: 'stl', requiresGrasshopper: true },
  { id: 'obj', name: 'OBJ', icon: <FileType className="w-4 h-4" />, format: 'obj', requiresGrasshopper: true },
  { id: 'gltf', name: 'glTF', icon: <Box className="w-4 h-4" />, format: 'gltf', requiresGrasshopper: true },
  { id: 'step', name: 'STEP', icon: <FileType className="w-4 h-4" />, format: 'step', requiresGrasshopper: true },
];

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

  // Check which exports are available from the model
  const availableExports = useMemo(() => {
    if (!session) return [];
    const exports = Object.values(session.exports);
    return exports.map(e => ({
      name: e.name?.toLowerCase() || '',
      type: e.type?.toLowerCase() || '',
    }));
  }, [session]);

  // Check if a specific format is available
  const isExportAvailable = useCallback((format: string) => {
    return availableExports.some(exp => 
      exp.name.includes(format.toLowerCase()) || 
      exp.type.includes(format.toLowerCase())
    );
  }, [availableExports]);

  // Check if any exports are available
  const hasAnyExports = availableExports.length > 0;

  // Reset camera to default view
  const handleResetCamera = useCallback(async () => {
    if (!viewport) return;
    
    try {
      // Reset camera to fit all content using zoomTo
      // ShapeDiver API: viewport.camera.zoomTo() or viewport.camera.reset()
      if (viewport.camera) {
        // Try zoomTo first (fits all visible content)
        if (typeof viewport.camera.zoomTo === 'function') {
          await viewport.camera.zoomTo();
        } else if (typeof (viewport.camera as any).reset === 'function') {
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
        const cameraControls = (viewport as any).cameraControls;
        if (cameraControls) {
          cameraControls.autoRotate = newState;
          cameraControls.autoRotateSpeed = newState ? 1.0 : 0;
        } else if ((viewport.camera as any).enableCameraControls) {
          // Fallback to enableCameraControls if available
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

  // Handle export
  const handleExport = useCallback(async (format: string) => {
    if (!session) return;
    
    try {
      setIsExporting(true);
      setShowExportMenu(false);
      setExportStatus(`Exporting ${format.toUpperCase()}...`);
      
      // Try session exports
      const exports = Object.values(session.exports);
      const exportItem = exports.find((exp) => {
        const expName = exp.name?.toLowerCase() || '';
        const expType = exp.type?.toLowerCase() || '';
        return expName.includes(format.toLowerCase()) || expType.includes(format.toLowerCase());
      });
      
      if (exportItem) {
        // Request the export
        const result = await exportItem.request();
        
        if (result.content && result.content.length > 0) {
          // Open download link
          const href = result.content[0].href;
          if (href) {
            window.open(href, '_blank');
            setExportStatus(`${format.toUpperCase()} exported!`);
            setTimeout(() => setExportStatus(null), 3000);
            return;
          }
        }
      }
      
      // List available exports for debugging
      console.log('Available exports:', exports.map(e => ({ name: e.name, type: e.type })));
      
      // No export available
      setExportStatus(`${format.toUpperCase()} not available for this model`);
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
                  {EXPORT_OPTIONS.map((option) => {
                    const available = isExportAvailable(option.format);
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleExport(option.format)}
                        disabled={!available}
                        className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                          available
                            ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                            : 'text-zinc-500 cursor-not-allowed'
                        }`}
                        title={!available ? 'Not available for this model' : ''}
                      >
                        {option.icon}
                        <span className="flex-1 text-left">{option.name}</span>
                        {available && (
                          <span className="text-xs text-emerald-500">✓</span>
                        )}
                      </button>
                    );
                  })}
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
          className={`p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isAutoRotating
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
