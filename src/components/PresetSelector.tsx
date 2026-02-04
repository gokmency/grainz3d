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
import {
  getPresets,
  createPreset,
  deletePreset,
  togglePresetFavorite,
} from '@/app/presets/actions';

interface PresetSelectorProps {
  session: ISessionApi | null;
  parameters: IParameterApi<unknown>[];
  modelId: string;
  onApplyPreset: (preset: Preset) => void;
}

export interface Preset {
  id: string;
  name: string;
  description?: string;
  values: Record<string, string | number | boolean>;
  isDefault?: boolean;
  isFavorite?: boolean;
  createdAt: number;
}

const DEFAULT_PRESET: Preset = {
  id: 'default',
  name: 'Default',
  description: 'Original configuration',
  values: {},
  isDefault: true,
  isFavorite: false,
  createdAt: 0,
};

export function PresetSelector({
  session,
  parameters,
  modelId,
  onApplyPreset,
}: PresetSelectorProps) {
  const [presets, setPresets] = useState<Preset[]>([DEFAULT_PRESET]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load presets from Supabase when model changes
  useEffect(() => {
    if (!modelId) {
      setPresets([DEFAULT_PRESET]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    getPresets(modelId)
      .then((data) => {
        if (!cancelled) {
          setPresets([DEFAULT_PRESET, ...data]);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Error loading presets:', err);
          setError('Failed to load presets');
          setPresets([DEFAULT_PRESET]);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [modelId]);

  // Create new preset
  const handleCreatePreset = useCallback(async () => {
    if (!session || !newPresetName.trim()) return;

    const values: Record<string, string | number | boolean> = {};
    parameters.forEach((param) => {
      if (param.value !== undefined) {
        values[param.id] = param.value as string | number | boolean;
      }
    });

    const result = await createPreset(modelId, newPresetName.trim(), values);

    if (result?.error) {
      setError(result.error);
      return;
    }

    const newPreset: Preset = {
      id: result.id!,
      name: newPresetName.trim(),
      values,
      isDefault: false,
      isFavorite: false,
      createdAt: Date.now(),
    };

    setPresets((prev) => [...prev, newPreset]);
    setNewPresetName('');
    setIsCreating(false);
    setSelectedPreset(newPreset.id);
    setError(null);
  }, [session, parameters, newPresetName, modelId]);

  // Apply preset
  const handleApplyPreset = useCallback(
    async (preset: Preset) => {
      if (!session) return;

      setIsApplying(true);
      setSelectedPreset(preset.id);
      setIsOpen(false);

      try {
        if (preset.isDefault) {
          parameters.forEach((param) => {
            if (param.defval !== undefined) {
              param.value = param.defval;
            }
          });
        } else {
          Object.entries(preset.values).forEach(([id, value]) => {
            const param = session.parameters[id];
            if (param) {
              param.value = value;
            }
          });
        }

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
    async (presetId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      const result = await deletePreset(presetId);
      if (result?.error) {
        setError(result.error);
        return;
      }

      setPresets((prev) => prev.filter((p) => p.id !== presetId));
      if (selectedPreset === presetId) {
        setSelectedPreset(null);
      }
      setError(null);
    },
    [selectedPreset]
  );

  // Toggle favorite
  const handleToggleFavorite = useCallback(
    async (presetId: string, e: React.MouseEvent) => {
      e.stopPropagation();

      const preset = presets.find((p) => p.id === presetId);
      if (!preset || preset.isDefault) return;

      const newFavorite = !preset.isFavorite;
      const result = await togglePresetFavorite(presetId, newFavorite);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setPresets((prev) =>
        prev.map((p) =>
          p.id === presetId ? { ...p, isFavorite: newFavorite } : p
        )
      );
      setError(null);
    },
    [presets]
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
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading...
            </span>
          ) : isApplying ? (
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

      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}

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
                <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
              ) : (
                <button
                  onClick={(e) => handleToggleFavorite(preset.id, e)}
                  className="flex-shrink-0 p-0.5 text-zinc-500 hover:text-amber-500 transition-colors"
                  title={preset.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {preset.isFavorite ? (
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ) : (
                    <Star className="w-4 h-4" />
                  )}
                </button>
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
