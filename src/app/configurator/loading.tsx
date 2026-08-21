import { Loader2 } from "lucide-react";

export default function ConfiguratorLoading() {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-10 h-10 text-zinc-600 animate-spin" />
        <span className="text-zinc-500 text-sm">Loading configurator...</span>
      </div>
    </div>
  );
}
