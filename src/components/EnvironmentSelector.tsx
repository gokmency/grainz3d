'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useEffect } from 'react';
import { IViewportApi, ENVIRONMENT_MAP } from '@shapediver/viewer';
import { Sun, Moon, Sparkles, Building2, TreePine, Warehouse, ChevronDown, Check } from 'lucide-react';

interface EnvironmentSelectorProps {
  viewport: IViewportApi | null;
}

interface EnvironmentOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: string;
  description: string;
}

// Available environment maps from ShapeDiver ENVIRONMENT_MAP enum
// These are the actual values that work with the API
const ENVIRONMENT_OPTIONS: EnvironmentOption[] = [
  {
    id: 'default_studio',
    name: 'Default Studio',
    icon: <Sparkles className="w-4 h-4" />,
    value: 'DEFAULT_STUDIO',
    description: 'Standard studio lighting',
  },
  {
    id: 'photo_studio',
    name: 'Photo Studio',
    icon: <Sun className="w-4 h-4" />,
    value: 'PHOTO_STUDIO',
    description: 'Professional photo lighting',
  },
  {
    id: 'furniture_studio',
    name: 'Furniture Studio',
    icon: <Sparkles className="w-4 h-4" />,
    value: 'FURNITURE_STUDIO',
    description: 'Optimized for furniture',
  },
  {
    id: 'jewelry_studio',
    name: 'Jewelry Studio',
    icon: <Sparkles className="w-4 h-4" />,
    value: 'JEWELRY_STUDIO',
    description: 'Optimized for jewelry',
  },
  {
    id: 'neutral',
    name: 'Neutral',
    icon: <Moon className="w-4 h-4" />,
    value: 'NEUTRAL',
    description: 'Neutral lighting',
  },
  {
    id: 'colorful_studio',
    name: 'Colorful Studio',
    icon: <Sparkles className="w-4 h-4" />,
    value: 'COLORFUL_STUDIO',
    description: 'Vibrant studio lighting',
  },
  {
    id: 'venice_sunset',
    name: 'Venice Sunset',
    icon: <Sun className="w-4 h-4" />,
    value: 'VENICE_SUNSET',
    description: 'Warm sunset ambiance',
  },
  {
    id: 'green_point_park',
    name: 'Green Point Park',
    icon: <TreePine className="w-4 h-4" />,
    value: 'GREEN_POINT_PARK',
    description: 'Outdoor park setting',
  },
  {
    id: 'snowy_field',
    name: 'Snowy Field',
    icon: <Moon className="w-4 h-4" />,
    value: 'SNOWY_FIELD',
    description: 'Winter outdoor scene',
  },
  {
    id: 'wide_street',
    name: 'Wide Street',
    icon: <Building2 className="w-4 h-4" />,
    value: 'WIDE_STREET',
    description: 'Urban street scene',
  },
];

export function EnvironmentSelector({ viewport }: EnvironmentSelectorProps) {
  const [selectedEnv, setSelectedEnv] = useState<string>('default_studio');
  const [isOpen, setIsOpen] = useState(false);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [groundPlaneEnabled, setGroundPlaneEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Show status message temporarily
  const showStatus = useCallback((message: string) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(null), 2000);
  }, []);

  // Initialize with current viewport settings
  useEffect(() => {
    if (!viewport) return;
    
    try {
      // Get current shadow state
      if ('shadows' in viewport) {
        setShadowsEnabled(!!(viewport as any).shadows);
      }
      // Get current ground plane state
      if ('groundPlane' in viewport) {
        setGroundPlaneEnabled(!!(viewport as any).groundPlane);
      }
    } catch (err) {
      console.log('[Environment] Could not read initial settings');
    }
  }, [viewport]);

  const handleEnvironmentChange = useCallback(
    async (envId: string) => {
      if (!viewport) return;

      const env = ENVIRONMENT_OPTIONS.find((e) => e.id === envId);
      if (!env) return;

      try {
        setSelectedEnv(envId);
        setIsOpen(false);

        // Get the actual enum value from ENVIRONMENT_MAP
        const envMapValue = (ENVIRONMENT_MAP as any)?.[env.value];
        
        if (envMapValue !== undefined) {
          // Use the enum value directly
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/immutability
          (viewport as any).environmentMap = envMapValue;
          showStatus(`Environment: ${env.name}`);
          console.log('[Environment] Updated with enum value:', env.value, '=', envMapValue);
        } else {
          // Fallback: try string value
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/immutability
          (viewport as any).environmentMap = env.value;
          showStatus(`Environment: ${env.name}`);
          console.log('[Environment] Updated with string value:', env.value);
        }
      } catch (err) {
        console.error('[Environment] Change error:', err);
        showStatus('Environment change failed');
      }
    },
    [viewport, showStatus]
  );

  const handleToggleShadows = useCallback(async () => {
    if (!viewport) return;

    try {
      const newState = !shadowsEnabled;
      setShadowsEnabled(newState);

      // Try updateSettingsAsync first
      if (typeof (viewport as any).updateSettingsAsync === 'function') {
        await (viewport as any).updateSettingsAsync({
          shadows: newState,
        });
        showStatus(`Shadows: ${newState ? 'On' : 'Off'}`);
        console.log('[Environment] Shadows updated via updateSettingsAsync:', newState);
      }
      // Fallback: direct property
      else if ('shadows' in viewport) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/immutability
        (viewport as any).shadows = newState;
        showStatus(`Shadows: ${newState ? 'On' : 'Off'}`);
        console.log('[Environment] Shadows updated via direct assignment:', newState);
      }
    } catch (err) {
      console.error('[Environment] Shadow toggle error:', err);
      setShadowsEnabled(!shadowsEnabled); // Revert on error
    }
  }, [viewport, shadowsEnabled, showStatus]);

  const handleToggleGroundPlane = useCallback(async () => {
    if (!viewport) return;

    try {
      const newState = !groundPlaneEnabled;
      setGroundPlaneEnabled(newState);

      // Try updateSettingsAsync first
      if (typeof (viewport as any).updateSettingsAsync === 'function') {
        await (viewport as any).updateSettingsAsync({
          groundPlane: newState,
        });
        showStatus(`Ground Plane: ${newState ? 'On' : 'Off'}`);
        console.log('[Environment] Ground plane updated via updateSettingsAsync:', newState);
      }
      // Fallback: direct property
      else if ('groundPlane' in viewport) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/immutability
        (viewport as any).groundPlane = newState;
        showStatus(`Ground Plane: ${newState ? 'On' : 'Off'}`);
        console.log('[Environment] Ground plane updated via direct assignment:', newState);
      }
    } catch (err) {
      console.error('[Environment] Ground plane toggle error:', err);
      setGroundPlaneEnabled(!groundPlaneEnabled); // Revert on error
    }
  }, [viewport, groundPlaneEnabled, showStatus]);

  const selectedOption = ENVIRONMENT_OPTIONS.find((e) => e.id === selectedEnv);

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <div className="flex flex-col gap-2 items-end">
        {/* Status Message */}
        {statusMessage && (
          <div className="px-3 py-1.5 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-lg text-xs text-emerald-400 animate-fade-in">
            {statusMessage}
          </div>
        )}

        {/* Environment Selector */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={!viewport}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 backdrop-blur-sm border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedOption?.icon}
            <span>{selectedOption?.name || 'Environment'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute bottom-full right-0 mb-2 py-2 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-xl min-w-[220px] max-h-[400px] overflow-y-auto">
              <div className="px-3 py-1 text-xs text-zinc-500 uppercase tracking-wide">
                Environment
              </div>
              {ENVIRONMENT_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleEnvironmentChange(option.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors ${
                    selectedEnv === option.id
                      ? 'text-white bg-zinc-800'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {option.icon}
                  <div className="text-left flex-1">
                    <div>{option.name}</div>
                    <div className="text-xs text-zinc-500">{option.description}</div>
                  </div>
                  {selectedEnv === option.id && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                </button>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-zinc-800" />

              {/* Additional Options */}
              <div className="px-3 py-1 text-xs text-zinc-500 uppercase tracking-wide">
                Options
              </div>
              
              {/* Shadows Toggle */}
              <button
                onClick={handleToggleShadows}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <span>Shadows</span>
                <div
                  className={`w-8 h-4 rounded-full transition-colors ${
                    shadowsEnabled ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 mt-0.5 rounded-full bg-white transition-transform ${
                      shadowsEnabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </button>

              {/* Ground Plane Toggle */}
              <button
                onClick={handleToggleGroundPlane}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                <span>Ground Plane</span>
                <div
                  className={`w-8 h-4 rounded-full transition-colors ${
                    groundPlaneEnabled ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 mt-0.5 rounded-full bg-white transition-transform ${
                      groundPlaneEnabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
