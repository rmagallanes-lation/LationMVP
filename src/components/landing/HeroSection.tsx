import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionContainer } from "@/components/landing/Section";
import {
  getHeroFeatures,
  getHeroPreviewCards,
} from "@/components/landing/landing-content";

export const HeroSection = () => {
  const { t } = useTranslation();
  const features = getHeroFeatures(t);
  const previewCards = getHeroPreviewCards(t);

  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-background pt-20 pb-12">
      <SectionContainer>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
              {t('landing.hero.titlePrimary')}{" "}
              <span className="text-accent">{t('landing.hero.titleAccent')}</span>
            </h1>

            <p className="text-base text-muted-foreground mb-7 max-w-xl mx-auto lg:mx-0">
              {t('landing.hero.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-3 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center lg:justify-start">
              <Button
                variant="hero"
                size="xl"
                onClick={handleScrollToContact}
              >
                {t('landing.hero.cta')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="hidden lg:block">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
                <div className="w-2 h-2 rounded-full bg-border" />
              </div>
              <div className="space-y-3">
                {previewCards.map((card) => (
                  <div
                    key={card.title}
                    className={`flex items-center justify-between p-3 rounded-lg ${card.cardClassName}`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{card.title}</p>
                      <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs rounded font-medium ${card.badgeClassName}`}
                    >
                      {card.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};
