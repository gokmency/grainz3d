import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Select a Template",
    description: "Choose from our curated library of parametric definitions, ranging from architectural forms to wearable accessories."
  },
  {
    number: "02",
    title: "Tweak Parameters",
    description: "Use intuitive sliders to adjust dimensions, density, patterns, and complexity. Watch your model update in real-time."
  },
  {
    number: "03",
    title: "Export & Manufacture",
    description: "Happy with your design? Download the watertight mesh file and send it directly to your 3D printer."
  }
];

export default function Steps() {
  return (
    <section id="how-it-works" className="py-24 bg-zinc-950 border-y border-zinc-900">
      <div className="container px-4 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
              From Idea to Object <br /> in Minutes.
            </h2>
            <p className="mb-12 text-lg text-zinc-400">
              No need to learn Grasshopper or code. We&apos;ve packaged the complexity into a simple 3-step workflow.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 text-xl font-mono font-bold text-black bg-white rounded-full">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                    <p className="text-zinc-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
             className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50"
          >
             {/* Abstract visual for the steps */}
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-3/4 h-3/4 border border-zinc-700/50 rounded-full animate-[spin_10s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]"></div>
                </div>
                <div className="absolute w-1/2 h-1/2 border border-zinc-700/50 rounded-full animate-[spin_15s_linear_infinite_reverse]">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-zinc-500 rounded-full"></div>
                </div>
                 <div className="absolute w-1/4 h-1/4 border border-zinc-700/50 rounded-full animate-[spin_5s_linear_infinite]">
                   <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-zinc-700 rounded-full"></div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
