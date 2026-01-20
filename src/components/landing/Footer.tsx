import Link from 'next/link';
import { Github, Twitter, Disc } from 'lucide-react'; // Using Disc as a placeholder for Discord if needed, or generic

export default function Footer() {
  return (
    <footer className="py-12 bg-black border-t border-zinc-900">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">Grainz3D</span>
            <span className="text-sm text-zinc-500">© 2024</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Github size={20} />
            </Link>
             <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Disc size={20} />
            </Link>
          </div>

          <div className="text-sm text-zinc-600">
            Built with <span className="text-zinc-400">ShapeDiver</span> & <span className="text-zinc-400">Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
