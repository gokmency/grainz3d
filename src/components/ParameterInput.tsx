'use client';

import { useState, useCallback, useEffect } from 'react';
import { IParameterApi } from '@shapediver/viewer';
import { Info } from 'lucide-react';

interface ParameterInputProps {
  parameter: IParameterApi<unknown>;
  onValueChange: (value: string | number | boolean) => void;
}

/**
 * Dynamically renders the correct input type based on parameter type
 */
export function ParameterInput({
  parameter,
  onValueChange,
}: ParameterInputProps) {
  const paramType = parameter.type;
  const displayName = parameter.displayname || parameter.name;
  const tooltip = parameter.tooltip;

  // Render the appropriate input based on parameter type
  switch (paramType) {
    case 'Bool':
      return (
        <BoolInput
          parameter={parameter}
          displayName={displayName}
          tooltip={tooltip}
          onValueChange={onValueChange}
        />
      );

    case 'Int':
    case 'Float':
    case 'Even':
    case 'Odd':
      return (
        <NumberInput
          parameter={parameter}
          displayName={displayName}
          tooltip={tooltip}
          onValueChange={onValueChange}
          isFloat={paramType === 'Float'}
        />
      );

    case 'Color':
      return (
        <ColorInput
          parameter={parameter}
          displayName={displayName}
          tooltip={tooltip}
          onValueChange={onValueChange}
        />
      );

    case 'StringList':
      return (
        <SelectInput
          parameter={parameter}
          displayName={displayName}
          tooltip={tooltip}
          onValueChange={onValueChange}
        />
      );

    case 'String':
    default:
      // Check if it has choices (dropdown)
      if (parameter.choices && parameter.choices.length > 0) {
        return (
          <SelectInput
            parameter={parameter}
            displayName={displayName}
            tooltip={tooltip}
            onValueChange={onValueChange}
          />
        );
      }
      // Default to text input
      return (
        <TextInput
          parameter={parameter}
          displayName={displayName}
          tooltip={tooltip}
          onValueChange={onValueChange}
        />
      );
  }
}

// ====================
// Input Components
// ====================

interface InputProps {
  parameter: IParameterApi<unknown>;
  displayName: string;
  tooltip?: string;
  onValueChange: (value: string | number | boolean) => void;
}

/**
 * Label with optional tooltip
 */
function InputLabel({
  displayName,
  tooltip,
}: {
  displayName: string;
  tooltip?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <label className="text-xs font-medium text-zinc-300">{displayName}</label>
      {tooltip && (
        <div className="group relative">
          <Info className="w-3 h-3 text-zinc-500 cursor-help" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Boolean toggle switch
 */
function BoolInput({ parameter, displayName, tooltip, onValueChange }: InputProps) {
  const [checked, setChecked] = useState(() => {
    const val = parameter.value;
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return false;
  });

  const handleChange = useCallback(() => {
    const newValue = !checked;
    setChecked(newValue);
    onValueChange(newValue);
  }, [checked, onValueChange]);

  useEffect(() => {
    const val = parameter.value;
    if (typeof val === 'boolean') setChecked(val);
    else if (typeof val === 'string') setChecked(val.toLowerCase() === 'true');
  }, [parameter.value]);

  return (
    <div>
      <InputLabel displayName={displayName} tooltip={tooltip} />
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
          checked ? 'bg-emerald-600' : 'bg-zinc-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

/**
 * Number input with range slider
 */
function NumberInput({
  parameter,
  displayName,
  tooltip,
  onValueChange,
  isFloat,
}: InputProps & { isFloat?: boolean }) {
  const min = parameter.min ?? 0;
  const max = parameter.max ?? 100;
  const decimalPlaces = parameter.decimalplaces ?? (isFloat ? 2 : 0);
  const step = isFloat ? Math.pow(10, -decimalPlaces) : 1;

  const [value, setValue] = useState(() => {
    const val = parameter.value;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val) || min;
    return min;
  });

  const handleChange = useCallback(
    (newValue: number) => {
      const clampedValue = Math.min(max, Math.max(min, newValue));
      const roundedValue = isFloat
        ? parseFloat(clampedValue.toFixed(decimalPlaces))
        : Math.round(clampedValue);
      setValue(roundedValue);
      onValueChange(roundedValue);
    },
    [min, max, isFloat, decimalPlaces, onValueChange]
  );

  useEffect(() => {
    const val = parameter.value;
    if (typeof val === 'number') setValue(val);
    else if (typeof val === 'string') setValue(parseFloat(val) || min);
  }, [parameter.value, min]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <InputLabel displayName={displayName} tooltip={tooltip} />
        <span className="text-xs font-mono text-zinc-500">
          {isFloat ? value.toFixed(decimalPlaces) : value}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(parseFloat(e.target.value))}
          className="flex-1 h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer slider-thumb"
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-zinc-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

/**
 * Color picker input
 */
function ColorInput({
  parameter,
  displayName,
  tooltip,
  onValueChange,
}: InputProps) {
  const [color, setColor] = useState(() => {
    const val = parameter.value;
    if (typeof val === 'string') {
      // Handle various color formats
      if (val.startsWith('#')) return val;
      if (val.startsWith('0x')) return '#' + val.slice(2);
      return '#' + val;
    }
    return '#ffffff';
  });

  const handleChange = useCallback(
    (newColor: string) => {
      setColor(newColor);
      // ShapeDiver expects colors without the # prefix
      onValueChange(newColor.replace('#', ''));
    },
    [onValueChange]
  );

  useEffect(() => {
    const val = parameter.value;
    if (typeof val === 'string') {
      if (val.startsWith('#')) setColor(val);
      else if (val.startsWith('0x')) setColor('#' + val.slice(2));
      else setColor('#' + val);
    }
  }, [parameter.value]);

  return (
    <div>
      <InputLabel displayName={displayName} tooltip={tooltip} />
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => handleChange(e.target.value)}
            className="w-10 h-10 rounded border-2 border-zinc-700 cursor-pointer bg-transparent"
          />
        </div>
        <input
          type="text"
          value={color.toUpperCase()}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 px-2 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-zinc-300 uppercase focus:outline-none focus:border-zinc-600"
          maxLength={7}
        />
      </div>
    </div>
  );
}

/**
 * Select dropdown for StringList and parameters with choices
 */
function SelectInput({
  parameter,
  displayName,
  tooltip,
  onValueChange,
}: InputProps) {
  const choices = parameter.choices || [];
  
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const val = parameter.value;
    if (typeof val === 'string') {
      const idx = parseInt(val, 10);
      if (!isNaN(idx) && idx >= 0 && idx < choices.length) return idx;
      // Try to find by value match
      const foundIdx = choices.findIndex((c) => c === val);
      return foundIdx >= 0 ? foundIdx : 0;
    }
    if (typeof val === 'number') return val;
    return 0;
  });

  const handleChange = useCallback(
    (newIndex: number) => {
      setSelectedIndex(newIndex);
      // ShapeDiver expects the index as string
      onValueChange(newIndex.toString());
    },
    [onValueChange]
  );

  useEffect(() => {
    const val = parameter.value;
    if (typeof val === 'string') {
      const idx = parseInt(val, 10);
      if (!isNaN(idx) && idx >= 0 && idx < choices.length) {
        setSelectedIndex(idx);
      }
    } else if (typeof val === 'number') {
      setSelectedIndex(val);
    }
  }, [parameter.value, choices.length]);

  if (choices.length === 0) {
    return (
      <div>
        <InputLabel displayName={displayName} tooltip={tooltip} />
        <span className="text-xs text-zinc-500">No options available</span>
      </div>
    );
  }

  return (
    <div>
      <InputLabel displayName={displayName} tooltip={tooltip} />
      <select
        value={selectedIndex}
        onChange={(e) => handleChange(parseInt(e.target.value, 10))}
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300 focus:outline-none focus:border-zinc-600 cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        {choices.map((choice, index) => (
          <option key={index} value={index}>
            {choice}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Text input for string parameters
 */
function TextInput({
  parameter,
  displayName,
  tooltip,
  onValueChange,
}: InputProps) {
  const [value, setValue] = useState(() => {
    const val = parameter.value;
    return typeof val === 'string' ? val : String(val);
  });

  const handleChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      onValueChange(newValue);
    },
    [onValueChange]
  );

  useEffect(() => {
    const val = parameter.value;
    setValue(typeof val === 'string' ? val : String(val));
  }, [parameter.value]);

  return (
    <div>
      <InputLabel displayName={displayName} tooltip={tooltip} />
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
        placeholder="Enter value..."
      />
    </div>
  );
}
