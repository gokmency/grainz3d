'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ModelConfig, MODELS } from '@/lib/config';
import { Box, ChevronDown, Check, Layers } from 'lucide-react';

interface ModelSelectorProps {
  currentModel: ModelConfig | null;
  onModelChange: (model: ModelConfig) => void;
  disabled?: boolean;
}

export function ModelSelector({ currentModel, onModelChange, disabled }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if only one model
  if (MODELS.length <= 1) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 w-full px-3 py-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-sm text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Layers className="w-4 h-4 text-zinc-400" />
        <span className="flex-1 text-left truncate">
          {currentModel?.name || 'Select Model'}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-[300px] overflow-y-auto">
          <div className="px-3 py-1.5 text-xs text-zinc-500 uppercase tracking-wide border-b border-zinc-800 mb-1">
            Available Models ({MODELS.length})
          </div>
          
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelChange(model);
                setIsOpen(false);
              }}
              className={`flex items-start gap-3 w-full px-3 py-2.5 text-sm transition-colors ${
                currentModel?.id === model.id
                  ? 'bg-emerald-900/30 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {model.thumbnail ? (
                <Image
                  src={model.thumbnail}
                  alt={model.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded object-cover bg-zinc-800"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                  <Box className="w-5 h-5 text-zinc-500" />
                </div>
              )}
              
              <div className="flex-1 text-left min-w-0">
                <div className="font-medium truncate">{model.name}</div>
                {model.description && (
                  <div className="text-xs text-zinc-500 truncate mt-0.5">
                    {model.description}
                  </div>
                )}
              </div>
              
              {currentModel?.id === model.id && (
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
