'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

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

export default function ConfiguratorPage() {
  return <ShapeDiverViewer />;
}
