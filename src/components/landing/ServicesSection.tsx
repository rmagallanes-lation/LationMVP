import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Brain, Video, BarChart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section, SectionContainer, SectionGrid, SectionHeader } from "@/components/landing/Section";

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
    <Section id="services">
      <SectionContainer ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <SectionHeader
            label={t('landing.services.label')}
            title={t('landing.services.titlePrimary')}
            titleAccent={t('landing.services.titleAccent')}
            subtitle={t('landing.services.subtitle')}
            align="center"
          />
        </motion.div>

        {/* Services Grid */}
        <SectionGrid className="md:grid-cols-2">
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
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
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
        </SectionGrid>
      </SectionContainer>
    </Section>
  );
};
