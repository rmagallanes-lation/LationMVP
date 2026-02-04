import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// Placeholder client logos - replace with actual logos
const clients = [
  { name: "TechCorp", initial: "TC" },
  { name: "InnovateLab", initial: "IL" },
  { name: "DataFlow", initial: "DF" },
  { name: "CloudScale", initial: "CS" },
  { name: "DevForce", initial: "DV" },
  { name: "ByteWorks", initial: "BW" },
  { name: "CodeNinja", initial: "CN" },
  { name: "StackPro", initial: "SP" },
];

export const ClientsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="clients" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
            Trusted By Leaders
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Companies That <span className="text-primary">Trust Us</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From startups to enterprises, leading companies rely on Lation for their technical hiring needs.
          </p>
        </motion.div>

        {/* Logo Carousel */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary/30 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Container */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{ x: [0, -1200] }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate logos for seamless loop */}
              {[...clients, ...clients, ...clients].map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center w-40 h-20 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{client.initial}</span>
                    </div>
                    <span className="font-semibold text-foreground">{client.name}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Testimonial Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12 relative">
            {/* Quote Mark */}
            <div className="absolute top-6 left-8 text-6xl text-primary/10 font-serif leading-none">
              "
            </div>
            
            <p className="text-lg md:text-xl text-foreground italic mb-6 relative z-10">
              Lation transformed our hiring process. Their expert interviewers and 
              detailed reports helped us make confident decisions and hire top talent faster than ever.
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">JD</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Jane Doe</p>
                <p className="text-sm text-muted-foreground">VP of Engineering, TechCorp</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
