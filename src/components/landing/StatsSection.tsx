import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Calendar, Award, Timer } from "lucide-react";

const stats = [
  {
    icon: Calendar,
    value: 10000,
    suffix: "+",
    label: "Interviews Completed",
    description: "Technical assessments conducted",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Active Clients",
    description: "Companies trust Lation",
  },
  {
    icon: Award,
    value: 150,
    suffix: "+",
    label: "Certified Interviewers",
    description: "Expert technical evaluators",
  },
  {
    icon: Timer,
    value: 24,
    suffix: "h",
    label: "Average SLA",
    description: "From request to report",
  },
];

const CountUpAnimation = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="stats" className="py-24 bg-gradient-section relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-4 block">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Numbers That <span className="text-accent">Speak</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trusted by hundreds of companies worldwide to deliver exceptional technical interviews.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="relative group"
            >
              <div className="bg-card rounded-2xl border border-border p-8 text-center hover:border-accent/30 hover:shadow-xl transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-accent/10 mx-auto mb-6 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <stat.icon className="w-7 h-7 text-accent" />
                </div>

                {/* Value */}
                <p className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  <CountUpAnimation target={stat.value} suffix={stat.suffix} />
                </p>

                {/* Label */}
                <p className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>

                {/* Decorative gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
