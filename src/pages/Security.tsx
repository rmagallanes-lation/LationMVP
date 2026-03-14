import { ShieldCheck, Gauge, BugOff, Globe, ScanSearch } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

const iconMap = {
  turnstile: ShieldCheck,
  rateLimit: Gauge,
  honeypot: BugOff,
  originChecks: Globe,
  crawlGovernance: ScanSearch,
} as const;

const itemOrder = [
  "turnstile",
  "rateLimit",
  "honeypot",
  "originChecks",
  "crawlGovernance",
] as const;

const Security = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full border border-accent/30 px-3 py-1 text-xs font-semibold text-accent">
              {t("landing.securityPage.badge")}
            </p>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-foreground">
              {t("landing.securityPage.title")}
            </h1>
            <p className="mt-4 text-muted-foreground">{t("landing.securityPage.description")}</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {itemOrder.map((itemKey) => {
              const Icon = iconMap[itemKey];
              return (
                <article key={itemKey} className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent/10">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">
                    {t(`landing.securityPage.items.${itemKey}.title`)}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`landing.securityPage.items.${itemKey}.description`)}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-lg border border-border bg-muted/40 p-5 max-w-3xl">
            <h2 className="text-base font-semibold text-foreground">
              {t("landing.securityPage.footnoteTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("landing.securityPage.footnoteDescription")}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
