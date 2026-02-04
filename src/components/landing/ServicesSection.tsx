import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Brain, Video, BarChart } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "Technical Interviews",
    description: "Expert-led technical interviews tailored to your job requirements. Our interviewers assess coding skills, system design, and problem-solving abilities.",
    features: ["Live coding sessions", "System design discussions", "Behavioral assessment"],
  },
  {
    icon: Brain,
    title: "AI-Powered Questions",
    description: "Our AI analyzes job descriptions to generate targeted technical questions, ensuring comprehensive and relevant candidate evaluations.",
    features: ["Job-specific questions", "Adaptive difficulty", "Standardized scoring"],
  },
  {
    icon: Video,
    title: "Microsoft Teams Integration",
    description: "Seamless video interviews with automatic scheduling, calendar integration, and meeting recordings for later review.",
    features: ["Auto-scheduled meetings", "Recording & playback", "Multi-party support"],
  },
  {
    icon: BarChart,
    title: "Detailed PDF Reports",
    description: "Comprehensive evaluation reports with skill assessments, scores, and hiring recommendations delivered within 24 hours.",
    features: ["Skill-by-skill breakdown", "Comparative scoring", "Clear recommendations"],
  },
];

export const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 md:px-6" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-4 block">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Complete Interview <span className="text-accent">Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            End-to-end technical interview services designed to help you hire the best talent efficiently.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group relative"
            >
              <div className="bg-card rounded-2xl border border-border p-8 hover:border-accent/30 hover:shadow-xl transition-all duration-300 h-full">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-primary-foreground transition-all duration-300">
                  <service.icon className="w-7 h-7 text-accent group-hover:text-primary-foreground transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
