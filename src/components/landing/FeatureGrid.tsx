import { motion } from 'framer-motion';
import { Cpu, Zap, Download } from 'lucide-react';

const features = [
  {
    title: "Powered by Grasshopper",
    description: "Built on top of Rhino & Grasshopper logic, giving you industrial-grade parametric capabilities without the learning curve.",
    icon: Cpu,
    colSpan: "md:col-span-2",
  },
  {
    title: "Real-time Rendering",
    description: "Instant visual feedback. Our WebGL viewer powered by ShapeDiver ensures what you see is what you get.",
    icon: Zap,
    colSpan: "md:col-span-1",
  },
  {
    title: "Export Ready",
    description: "Download production-ready STL and OBJ files instantly. Compatible with 3D printing and CNC milling.",
    icon: Download,
    colSpan: "md:col-span-1",
  },
  {
    title: "Cloud Processing",
    description: "Complex geometry calculations happen in the cloud, keeping your browser fast and responsive.",
    icon: Cpu, // Reusing icon for simplicity or add another if needed
    colSpan: "md:col-span-2",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-24 bg-black relative">
       <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25"></div>
      <div className="container px-4 mx-auto relative z-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Under the Hood
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400">
            Grainz3D bridges the gap between complex algorithmic design and accessible user interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 auto-rows-[minmax(200px,auto)]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative p-8 overflow-hidden border border-zinc-800 rounded-3xl bg-zinc-900/20 hover:bg-zinc-900/40 transition-colors ${feature.colSpan}`}
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="p-3 mb-4 w-fit rounded-xl bg-zinc-800/50 text-white">
                  <feature.icon size={24} />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold text-white group-hover:text-zinc-200">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Glass effect gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
