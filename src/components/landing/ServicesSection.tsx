import { useRef } from "react";
import { useInView } from "framer-motion";
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
    <Section id="services" tone="muted">
      <SectionContainer ref={ref}>
        <div
          className="mb-12"
          style={{ opacity: isInView ? 1 : 0, transition: "opacity 150ms ease" }}
        >
          <SectionHeader
            label={t('landing.services.label')}
            title={t('landing.services.titlePrimary')}
            titleAccent={t('landing.services.titleAccent')}
            subtitle={t('landing.services.subtitle')}
            align="center"
          />
        </div>

        <SectionGrid
          className="md:grid-cols-2"
          style={{ opacity: isInView ? 1 : 0, transition: "opacity 150ms ease 75ms" }}
        >
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-card rounded-lg border border-border p-7 hover:border-accent/30 transition-colors duration-150 h-full"
            >
              <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center mb-5">
                <service.icon className="w-5 h-5 text-accent" />
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </SectionGrid>
      </SectionContainer>
    </Section>
  );
};
