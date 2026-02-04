import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Shield, BarChart3, Clock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get comprehensive technical evaluations within 24 hours. Our streamlined process ensures you never miss a great candidate.",
  },
  {
    icon: Shield,
    title: "Expert Interviewers",
    description: "Our certified technical interviewers have years of industry experience across various tech stacks and domains.",
  },
  {
    icon: BarChart3,
    title: "AI-Powered Insights",
    description: "Leverage artificial intelligence to generate targeted questions and provide standardized, unbiased evaluations.",
  },
  {
    icon: Clock,
    title: "Scalable Process",
    description: "Whether you're hiring one engineer or building a team, our platform scales with your needs effortlessly.",
  },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      <div className="container mx-auto px-4 md:px-6" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent font-semibold text-sm uppercase tracking-wider mb-4 block">
              About Lation
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Transforming How Companies{" "}
              <span className="text-accent">Hire Technical Talent</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Lation bridges the gap between companies and top technical talent through 
              standardized, expert-led interview processes. We combine human expertise 
              with AI-driven insights to deliver the most accurate candidate evaluations.
            </p>
            <p className="text-muted-foreground mb-8">
              Our platform supports recruiters and hiring managers with comprehensive 
              technical assessments, detailed PDF reports, and data-driven recommendations 
              that help you make confident hiring decisions.
            </p>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
