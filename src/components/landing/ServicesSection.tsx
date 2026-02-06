import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Brain, Video, BarChart } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ServicesSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: FileText,
      title: t('landing.services.items.interviews.title'),
      description: t('landing.services.items.interviews.description'),
      features: t('landing.services.items.interviews.features', { returnObjects: true }) as string[],
    },
    {
      icon: Brain,
      title: t('landing.services.items.ai.title'),
      description: t('landing.services.items.ai.description'),
      features: t('landing.services.items.ai.features', { returnObjects: true }) as string[],
    },
    {
      icon: Video,
      title: t('landing.services.items.teams.title'),
      description: t('landing.services.items.teams.description'),
      features: t('landing.services.items.teams.features', { returnObjects: true }) as string[],
    },
    {
      icon: BarChart,
      title: t('landing.services.items.reports.title'),
      description: t('landing.services.items.reports.description'),
      features: t('landing.services.items.reports.features', { returnObjects: true }) as string[],
    },
  ];

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
            {t('landing.services.label')}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('landing.services.titlePrimary')}{" "}
            <span className="text-accent">{t('landing.services.titleAccent')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('landing.services.subtitle')}
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
