import { useRef } from "react";
import { useInView } from "framer-motion";
import { Zap, Shield, BarChart3, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section, SectionContainer } from "@/components/landing/Section";

export const AboutSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Zap,
      title: t('landing.about.features.fast.title'),
      description: t('landing.about.features.fast.description'),
    },
    {
      icon: Shield,
      title: t('landing.about.features.expert.title'),
      description: t('landing.about.features.expert.description'),
    },
    {
      icon: BarChart3,
      title: t('landing.about.features.ai.title'),
      description: t('landing.about.features.ai.description'),
    },
    {
      icon: Clock,
      title: t('landing.about.features.scalable.title'),
      description: t('landing.about.features.scalable.description'),
    },
  ];

  return (
    <Section id="about">
      <SectionContainer ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            style={{
              opacity: isInView ? 1 : 0,
              transition: "opacity 150ms ease",
            }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {t('landing.about.titlePrimary')}{" "}
              <span className="text-accent">{t('landing.about.titleAccent')}</span>
            </h2>
            <p className="text-base text-muted-foreground mb-4">
              {t('landing.about.description1')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('landing.about.description2')}
            </p>
          </div>

          {/* Right Content - Feature Cards */}
          <div
            className="grid sm:grid-cols-2 gap-4"
            style={{
              opacity: isInView ? 1 : 0,
              transition: "opacity 150ms ease 75ms",
            }}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 bg-card rounded-lg border border-border hover:border-accent/40 transition-colors duration-150"
              >
                <div className="w-9 h-9 rounded bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-150">
                  <feature.icon className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </Section>
  );
};
