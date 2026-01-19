'use client';

import { useMemo } from 'react';
import { IParameterApi } from '@shapediver/viewer';
import { ParameterInput } from './ParameterInput';
import { ChevronDown } from 'lucide-react';

interface ParameterPanelProps {
  parameters: IParameterApi<unknown>[];
  onParameterChange: (id: string, value: string | number | boolean) => void;
}

interface GroupedParameters {
  [groupName: string]: IParameterApi<unknown>[];
}

export function ParameterPanel({
  parameters,
  onParameterChange,
}: ParameterPanelProps) {
  // Group parameters by their group property
  const groupedParams = useMemo(() => {
    const groups: GroupedParameters = {};
    
    parameters.forEach((param) => {
      const groupName = param.group?.name || 'General';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(param);
    });

    // Sort parameters within each group by order
    Object.keys(groups).forEach((groupName) => {
      groups[groupName].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });

    return groups;
  }, [parameters]);

  const groupNames = Object.keys(groupedParams).sort((a, b) => {
    // Keep "General" at the top
    if (a === 'General') return -1;
    if (b === 'General') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="divide-y divide-zinc-800">
      {groupNames.map((groupName) => (
        <ParameterGroup
          key={groupName}
          name={groupName}
          parameters={groupedParams[groupName]}
          onParameterChange={onParameterChange}
        />
      ))}
    </div>
  );
}

interface ParameterGroupProps {
  name: string;
  parameters: IParameterApi<unknown>[];
  onParameterChange: (id: string, value: string | number | boolean) => void;
}

function ParameterGroup({
  name,
  parameters,
  onParameterChange,
}: ParameterGroupProps) {
  return (
    <details className="group" open>
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-zinc-800/50 transition-colors">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
          {name}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-4 space-y-4">
        {parameters.map((param) => (
          <ParameterInput
            key={param.id}
            parameter={param}
            onValueChange={(value) => onParameterChange(param.id, value)}
          />
        ))}
      </div>
    </details>
  );
}
