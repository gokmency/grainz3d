'use client';

import { Suspense } from 'react';
import { AnimatedCharactersLoginPage } from '@/components/ui/animated-characters-login-page';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
        </div>
      }
    >
      <AnimatedCharactersLoginPage brandName="Grainz3D" />
    </Suspense>
  );
}
