import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/10"
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Grainz3D
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link href="#features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link href="#how-it-works" className="hover:text-white transition-colors">
          How it Works
        </Link>
        <Link href="#gallery" className="hover:text-white transition-colors">
          Gallery
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/configurator"
          className="px-4 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-zinc-200 transition-colors"
        >
          Launch App
        </Link>
      </div>
    </motion.header>
  );
}
