import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wider text-zinc-400 border border-zinc-800 rounded-full bg-zinc-900/50 backdrop-blur-sm">
            BETA RELEASE v0.1
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          Parametric Design, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
            Democratized.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-10 text-lg text-zinc-400 md:text-xl"
        >
          Craft complex, algorithmic 3D forms directly in your browser. No CAD skills required. Just slide, customize, and export.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/configurator"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-black transition-all bg-white rounded-full hover:bg-zinc-200 hover:scale-105"
          >
            Start Configuring
          </Link>
          <Link
            href="#gallery"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white transition-all border border-zinc-800 rounded-full bg-zinc-900/50 hover:bg-zinc-800 hover:scale-105 backdrop-blur-sm"
          >
            View Gallery
          </Link>
        </motion.div>

        {/* Visual Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mt-20 mx-auto max-w-5xl aspect-video rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden shadow-2xl shadow-zinc-950/50"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-zinc-900/20 to-transparent animate-pulse"></div>
             {/* This would be where a 3D preview or video loop goes */}
             <div className="z-10 text-zinc-600 font-mono text-sm">
                [ Interactive 3D Preview Placeholder ]
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
