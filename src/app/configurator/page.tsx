'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getDefaultModel, getModelById } from '@/lib/config';

// Dynamically import the ShapeDiver viewer with SSR disabled
// This is required because the @shapediver/viewer library uses browser APIs
const ShapeDiverViewer = dynamic(
  () => import('@/components/ShapeDiverViewer').then((mod) => mod.ShapeDiverViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-zinc-600 animate-spin" />
          <span className="text-zinc-500 text-sm">Initializing Viewer...</span>
        </div>
      </div>
    ),
  }
);

function ConfiguratorContent() {
  const searchParams = useSearchParams();
  const modelId = searchParams.get('model');
  const initialModel = modelId ? getModelById(modelId) : getDefaultModel();

  return <ShapeDiverViewer initialModel={initialModel ?? undefined} />;
}

export default function ConfiguratorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-zinc-950">
          <Loader2 className="w-10 h-10 text-zinc-600 animate-spin" />
        </div>
      }
    >
      <ConfiguratorContent />
    </Suspense>
  );
}
