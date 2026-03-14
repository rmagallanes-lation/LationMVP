import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Calendar, Award, Timer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Section, SectionContainer, SectionGrid, SectionHeader } from "@/components/landing/Section";

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
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      icon: Calendar,
      value: 5000,
      suffix: "+",
      label: t('landing.stats.interviewsCompleted'),
      description: t('landing.stats.descriptions.interviews'),
    },
    {
      icon: Users,
      value: 20,
      suffix: "+",
      label: t('landing.stats.activeClients'),
      description: t('landing.stats.descriptions.clients'),
    },
    {
      icon: Award,
      value: 50,
      suffix: "+",
      label: t('landing.stats.interviewers'),
      description: t('landing.stats.descriptions.interviewers'),
    },
    {
      icon: Timer,
      value: 12,
      suffix: "h",
      label: t('landing.stats.sla'),
      description: t('landing.stats.descriptions.sla'),
    },
  ];

  return (
    <Section id="stats">
      <SectionContainer ref={ref}>
        <div
          className="mb-12"
          style={{ opacity: isInView ? 1 : 0, transition: "opacity 150ms ease" }}
        >
          <SectionHeader
            label={t('landing.stats.label')}
            title={t('landing.stats.title')}
            subtitle={t('landing.stats.subtitle')}
            align="center"
          />
        </div>

        <SectionGrid
          className="md:grid-cols-2 lg:grid-cols-4"
          style={{ opacity: isInView ? 1 : 0, transition: "opacity 150ms ease 75ms" }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-lg border border-border p-6 text-center hover:border-accent/30 transition-colors duration-150 flex flex-col"
            >
              <div className="w-10 h-10 rounded bg-accent/10 mx-auto mb-4 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>

              <p className="text-4xl font-bold text-foreground mb-1">
                <CountUpAnimation target={stat.value} suffix={stat.suffix} />
              </p>

              <p className="text-sm font-semibold text-foreground mb-1 leading-snug">
                {stat.label}
              </p>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </SectionGrid>
      </SectionContainer>
    </Section>
  );
};
