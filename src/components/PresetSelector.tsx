'use client';

import { useState, useCallback, useEffect } from 'react';
import { ISessionApi, IParameterApi } from '@shapediver/viewer';
import {
  Bookmark,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  Star,
  Loader2,
} from 'lucide-react';

interface PresetSelectorProps {
  session: ISessionApi | null;
  parameters: IParameterApi<unknown>[];
  onApplyPreset: (preset: Preset) => void;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  values: Record<string, string | number | boolean>;
  isDefault?: boolean;
  createdAt: number;
}

// Local storage key for presets
const PRESETS_STORAGE_KEY = 'shapediver-presets';

// Default presets (can be customized per model)
const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Original configuration',
    values: {},
    isDefault: true,
    createdAt: 0,
  },
];

export function PresetSelector({
  session,
  parameters,
  onApplyPreset,
}: PresetSelectorProps) {
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (stored) {
        const parsedPresets = JSON.parse(stored) as Preset[];
        setPresets([...DEFAULT_PRESETS, ...parsedPresets]);
      }
    } catch (err) {
      console.error('Error loading presets:', err);
    }
  }, []);

  // Save presets to localStorage
  const savePresets = useCallback((presetsToSave: Preset[]) => {
    try {
      // Only save non-default presets
      const customPresets = presetsToSave.filter((p) => !p.isDefault);
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(customPresets));
    } catch (err) {
      console.error('Error saving presets:', err);
    }
  }, []);

  // Create new preset from current configuration
  const handleCreatePreset = useCallback(() => {
    if (!session || !newPresetName.trim()) return;

    // Collect current parameter values
    const values: Record<string, string | number | boolean> = {};
    parameters.forEach((param) => {
      if (param.value !== undefined) {
        values[param.id] = param.value as string | number | boolean;
      }
    });

    const newPreset: Preset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      values,
      createdAt: Date.now(),
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    savePresets(updatedPresets);
    
    setNewPresetName('');
    setIsCreating(false);
    setSelectedPreset(newPreset.id);
  }, [session, parameters, newPresetName, presets, savePresets]);

  // Apply preset
  const handleApplyPreset = useCallback(
    async (preset: Preset) => {
      if (!session) return;

      setIsApplying(true);
      setSelectedPreset(preset.id);
      setIsOpen(false);

      try {
        // For default preset, reset to default values
        if (preset.isDefault) {
          parameters.forEach((param) => {
            if (param.defval !== undefined) {
              param.value = param.defval;
            }
          });
        } else {
          // Apply preset values
          Object.entries(preset.values).forEach(([id, value]) => {
            const param = session.parameters[id];
            if (param) {
              param.value = value;
            }
          });
        }

        // Trigger customization
        await session.customize();
        onApplyPreset(preset);
      } catch (err) {
        console.error('Error applying preset:', err);
      } finally {
        setIsApplying(false);
      }
    },
    [session, parameters, onApplyPreset]
  );

  // Delete preset
  const handleDeletePreset = useCallback(
    (presetId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      
      const updatedPresets = presets.filter((p) => p.id !== presetId);
      setPresets(updatedPresets);
      savePresets(updatedPresets);
      
      if (selectedPreset === presetId) {
        setSelectedPreset(null);
      }
    },
    [presets, selectedPreset, savePresets]
  );

  const selectedPresetData = presets.find((p) => p.id === selectedPreset);

  return (
    <div className="relative">
      {/* Preset Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!session}
        className="flex items-center gap-2 w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 hover:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Bookmark className="w-4 h-4 text-zinc-400" />
        <span className="flex-1 text-left truncate">
          {isApplying ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Applying...
            </span>
          ) : selectedPresetData ? (
            selectedPresetData.name
          ) : (
            'Select Preset'
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {/* Presets List */}
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                selectedPreset === preset.id
                  ? 'text-white bg-zinc-800'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              {preset.isDefault ? (
                <Star className="w-4 h-4 text-amber-500" />
              ) : (
                <Bookmark className="w-4 h-4 text-zinc-500" />
              )}
              <span className="flex-1 text-left truncate">{preset.name}</span>
              {selectedPreset === preset.id && (
                <Check className="w-4 h-4 text-emerald-500" />
              )}
              {!preset.isDefault && (
                <button
                  onClick={(e) => handleDeletePreset(preset.id, e)}
                  className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete preset"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </button>
          ))}

          {/* Divider */}
          <div className="my-1 border-t border-zinc-800" />

          {/* Create New Preset */}
          {isCreating ? (
            <div className="px-3 py-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  placeholder="Preset name..."
                  className="flex-1 px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300 placeholder-zinc-500 outline-none focus:border-zinc-600"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreatePreset();
                    if (e.key === 'Escape') setIsCreating(false);
                  }}
                />
                <button
                  onClick={handleCreatePreset}
                  disabled={!newPresetName.trim()}
                  className="px-2 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Save Current as Preset</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
