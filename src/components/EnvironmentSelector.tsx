'use client';

import { useState, useCallback } from 'react';
import { IViewportApi } from '@shapediver/viewer';
import { Sun, Moon, Sparkles, Building2, TreePine, Warehouse, ChevronDown } from 'lucide-react';

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

// ShapeDiver environment map options
const ENVIRONMENT_OPTIONS: EnvironmentOption[] = [
  {
    id: 'studio',
    name: 'Studio',
    icon: <Sparkles className="w-4 h-4" />,
    value: 'photo_studio',
    description: 'Clean studio lighting',
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    icon: <Sun className="w-4 h-4" />,
    value: 'outdoor',
    description: 'Natural daylight',
  },
  {
    id: 'night',
    name: 'Night',
    icon: <Moon className="w-4 h-4" />,
    value: 'night',
    description: 'Night environment',
  },
  {
    id: 'urban',
    name: 'Urban',
    icon: <Building2 className="w-4 h-4" />,
    value: 'urban',
    description: 'City environment',
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: <TreePine className="w-4 h-4" />,
    value: 'nature',
    description: 'Forest environment',
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    icon: <Warehouse className="w-4 h-4" />,
    value: 'warehouse',
    description: 'Industrial setting',
  },
];

export function EnvironmentSelector({ viewport }: EnvironmentSelectorProps) {
  const [selectedEnv, setSelectedEnv] = useState<string>('studio');
  const [isOpen, setIsOpen] = useState(false);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [groundPlaneEnabled, setGroundPlaneEnabled] = useState(true);

  const handleEnvironmentChange = useCallback(
    (envId: string) => {
      if (!viewport) return;

      const env = ENVIRONMENT_OPTIONS.find((e) => e.id === envId);
      if (!env) return;

      try {
        setSelectedEnv(envId);
        setIsOpen(false);

        // Update viewport environment
        // Note: The actual API may vary based on ShapeDiver version
        if (viewport.environmentMap !== undefined) {
          // Try to set environment map if supported
          (viewport as any).environmentMap = env.value;
        }
        
        // Alternative approach using lighting settings
        if ((viewport as any).lighting) {
          (viewport as any).lighting.environment = env.value;
        }
      } catch (err) {
        console.error('Environment change error:', err);
      }
    },
    [viewport]
  );

  const handleToggleShadows = useCallback(() => {
    if (!viewport) return;

    try {
      const newState = !shadowsEnabled;
      setShadowsEnabled(newState);

      // Toggle shadows - ShapeDiver API expects boolean
      if ('shadows' in viewport) {
        (viewport as any).shadows = newState;
      }
    } catch (err) {
      console.error('Shadow toggle error:', err);
    }
  }, [viewport, shadowsEnabled]);

  const handleToggleGroundPlane = useCallback(() => {
    if (!viewport) return;

    try {
      const newState = !groundPlaneEnabled;
      setGroundPlaneEnabled(newState);

      // Toggle ground plane - ShapeDiver API expects boolean
      if ('groundPlane' in viewport) {
        (viewport as any).groundPlane = newState;
      }
    } catch (err) {
      console.error('Ground plane toggle error:', err);
    }
  }, [viewport, groundPlaneEnabled]);

  const selectedOption = ENVIRONMENT_OPTIONS.find((e) => e.id === selectedEnv);

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <div className="flex flex-col gap-2">
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
            <div className="absolute bottom-full right-0 mb-2 py-2 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 rounded-lg shadow-xl min-w-[200px]">
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
                  <div className="text-left">
                    <div>{option.name}</div>
                    <div className="text-xs text-zinc-500">{option.description}</div>
                  </div>
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
