'use client';

import { useState, useEffect, useCallback } from 'react';
import { ISessionApi, IOutputApi } from '@shapediver/viewer';
import {
  BarChart3,
  Scale,
  Ruler,
  Box,
  Layers,
  ChevronDown,
  RefreshCw,
  Loader2,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface OutputsPanelProps {
  session: ISessionApi | null;
}

interface OutputValue {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  type: 'number' | 'text' | 'area' | 'volume' | 'weight' | 'length';
}

// Icon mapping for common output types
function getOutputIcon(name: string): React.ReactNode {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('area') || lowerName.includes('alan')) {
    return <Layers className="w-4 h-4" />;
  }
  if (lowerName.includes('volume') || lowerName.includes('hacim')) {
    return <Box className="w-4 h-4" />;
  }
  if (lowerName.includes('weight') || lowerName.includes('ağırlık') || lowerName.includes('mass')) {
    return <Scale className="w-4 h-4" />;
  }
  if (lowerName.includes('length') || lowerName.includes('width') || lowerName.includes('height') || 
      lowerName.includes('uzunluk') || lowerName.includes('genişlik') || lowerName.includes('yükseklik')) {
    return <Ruler className="w-4 h-4" />;
  }
  
  return <BarChart3 className="w-4 h-4" />;
}

// Unit detection based on output name
function getOutputUnit(name: string): string | undefined {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('area') || lowerName.includes('alan')) {
    return 'm²';
  }
  if (lowerName.includes('volume') || lowerName.includes('hacim')) {
    return 'm³';
  }
  if (lowerName.includes('weight') || lowerName.includes('ağırlık') || lowerName.includes('mass')) {
    return 'kg';
  }
  if (lowerName.includes('length') || lowerName.includes('width') || lowerName.includes('height') ||
      lowerName.includes('uzunluk') || lowerName.includes('genişlik') || lowerName.includes('yükseklik')) {
    return 'mm';
  }
  if (lowerName.includes('price') || lowerName.includes('fiyat') || lowerName.includes('cost')) {
    return '₺';
  }
  
  return undefined;
}

// Format output type
function getOutputType(name: string): OutputValue['type'] {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('area')) return 'area';
  if (lowerName.includes('volume')) return 'volume';
  if (lowerName.includes('weight') || lowerName.includes('mass')) return 'weight';
  if (lowerName.includes('length') || lowerName.includes('width') || lowerName.includes('height')) return 'length';
  
  return 'number';
}

export function OutputsPanel({ session }: OutputsPanelProps) {
  const [outputs, setOutputs] = useState<OutputValue[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Extract and format outputs from session
  const refreshOutputs = useCallback(async () => {
    if (!session) return;

    setIsLoading(true);
    
    try {
      const sessionOutputs = Object.values(session.outputs) as IOutputApi[];
      const formattedOutputs: OutputValue[] = [];

      for (const output of sessionOutputs) {
        // Skip geometry outputs, only show data outputs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((output.content && output.content.length > 0) || (output as any).data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const content = output.content?.[0] || { data: (output as any).data };
          
          // Check if it's a data output (not geometry)
          if (content.data !== undefined) {
            const name = output.name || output.id;
            const value = content.data;
            
            // Only add numeric or string values
            if (typeof value === 'number' || typeof value === 'string') {
              formattedOutputs.push({
                id: output.id,
                name: name,
                value: typeof value === 'number' ? parseFloat(value.toFixed(2)) : value,
                unit: getOutputUnit(name),
                icon: getOutputIcon(name),
                type: getOutputType(name),
              });
            }
          }
        }
      }

      setOutputs(formattedOutputs);
    } catch (err) {
      console.error('Error refreshing outputs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Initial load and subscribe to updates
  useEffect(() => {
    refreshOutputs();

    // Set up output update listener if available
    if (session) {
      const handleUpdate = () => {
        refreshOutputs();
      };

      // Listen for customization complete events
      // Note: The actual event name may vary based on ShapeDiver version
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session as any).on?.('customization.complete', handleUpdate);
      } catch {
        // Fallback: refresh on interval
      }

      return () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (session as any).off?.('customization.complete', handleUpdate);
        } catch {
          // Ignore cleanup errors
        }
      };
    }
  }, [session, refreshOutputs]);

  // Don't render if no outputs
  if (outputs.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-zinc-800">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            Computed Values
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              refreshOutputs();
            }}
            disabled={isLoading}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Refresh values"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
          </button>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-slide-down">
          {outputs.map((output) => (
            <OutputItem key={output.id} output={output} />
          ))}
        </div>
      )}
    </div>
  );
}

interface OutputItemProps {
  output: OutputValue;
}

function OutputItem({ output }: OutputItemProps) {
  const formattedValue =
    typeof output.value === 'number'
      ? output.value.toLocaleString('tr-TR', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : output.value;

  return (
    <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-zinc-700/50 rounded text-zinc-400">
          {output.icon}
        </div>
        <span className="text-sm text-zinc-300">{output.name}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-mono font-medium text-zinc-100">
          {formattedValue}
        </span>
        {output.unit && (
          <span className="text-xs text-zinc-500">{output.unit}</span>
        )}
      </div>
    </div>
  );
}
