import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Section, SectionContainer, SectionHeader } from "@/components/landing/Section";

export const ClientsSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  return (
    <Section id="clients" tone="muted">
      <SectionContainer ref={ref}>
        <div
          className="mb-12"
          style={{ opacity: isInView ? 1 : 0, transition: "opacity 150ms ease" }}
        >
          <SectionHeader
            label={t('landing.clients.label')}
            title={t('landing.clients.title')}
            subtitle={t('landing.clients.subtitle')}
            align="center"
          />
        </div>

        {/* Logo Carousel */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
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
            {[...clients, ...clients, ...clients].map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center w-40 h-16 bg-card rounded-lg border border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-primary dark:text-accent font-bold text-xs">
                      {client.initial}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{client.name}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Testimonial */}
        <div
          className="mt-14 max-w-2xl mx-auto"
          style={{
            opacity: isInView ? 1 : 0,
            transition: "opacity 150ms ease 75ms",
          }}
        >
          <div className="bg-card rounded-lg border border-border p-8">
            <p className="text-base text-foreground mb-6 leading-relaxed">
              "{t('landing.clients.testimonial.quote')}"
            </p>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary dark:text-accent font-bold text-xs">JD</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {t('landing.clients.testimonial.author')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('landing.clients.testimonial.position')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </Section>
  );
};
