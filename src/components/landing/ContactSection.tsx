import { useInView } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Section, SectionContainer } from "@/components/landing/Section";
import { getContactCards } from "@/components/landing/landing-content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { contactConfigError, isContactFormConfigured, runtimeConfig } from "@/lib/runtime-config";
import { TurnstileWidget } from "@/components/landing/TurnstileWidget";

function resolveLeadEndpoint() {
  const apiUrl = runtimeConfig.apiUrl?.trim();
  if (!apiUrl) {
    return "/api/lead";
  }

  return `${apiUrl.replace(/\/+$/, "")}/api/contact`;
}

export const ContactSection = () => {
  const { t } = useTranslation();
  const contactCards = getContactCards(t);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const contactFormAvailable = isContactFormConfigured && Boolean(runtimeConfig.turnstileSiteKey);
  const showTechnicalConfigHint =
    import.meta.env.DEV || import.meta.env.VITE_SHOW_CONTACT_CONFIG_HINT === "true";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const leadEndpoint = resolveLeadEndpoint();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    website: "",
  });

  const handleTurnstileTokenChange = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!contactFormAvailable) {
      toast.error(t('landing.contact.form.disabledToast'));
      setIsSubmitting(false);
      return;
    }

    // Honeypot check for spam
    const honeypot = formData.website.trim();
    if (honeypot) {
      toast.success(t('landing.contact.form.success'));
      setFormData({ name: "", email: "", company: "", message: "", website: "" });
      setIsSubmitting(false);
      return;
    }

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error(t('landing.contact.form.error'));
      setIsSubmitting(false);
      return;
    }

    if (!turnstileToken) {
      toast.error(t('landing.contact.form.error'));
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || "",
        message: formData.message.trim(),
        website: formData.website.trim(),
        turnstileToken,
      };

      const response = await fetch(leadEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          setTurnstileResetSignal((current) => current + 1);
        }
        throw new Error("lead_submission_failed");
      }

      toast.success(t('landing.contact.form.success'));
      setFormData({ name: "", email: "", company: "", message: "", website: "" });
      setTurnstileResetSignal((current) => current + 1);
    } catch (error) {
      void error;
      toast.error(t('landing.contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Section id="contact" tone="muted">
      <SectionContainer ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <div
            style={{ opacity: isInView ? 1 : 0, transition: "opacity 150ms ease" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {t('landing.contact.titlePrimary')}{" "}
              <span className="text-accent">{t('landing.contact.titleAccent')}</span>
            </h2>

            <p className="text-base text-muted-foreground mb-8">
              {t('landing.contact.subtitle')}
            </p>

            <div className="space-y-3">
              {contactCards.map((card) => {
                const interactionClasses = card.interactive
                  ? "hover:border-accent/40 transition-colors duration-150 group cursor-pointer"
                  : "";

                if (card.href) {
                  return (
                    <a
                      key={card.label}
                      href={card.href}
                      className={`flex items-center gap-4 p-4 rounded-lg border border-border bg-card ${interactionClasses}`}
                    >
                      <div className="w-9 h-9 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <card.icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{card.label}</p>
                        <p className="text-sm font-semibold text-foreground">{card.value}</p>
                      </div>
                    </a>
                  );
                }

                return (
                  <div
                    key={card.label}
                    className={`flex items-center gap-4 p-4 rounded-lg border border-border bg-card ${interactionClasses}`}
                  >
                    <div className="w-9 h-9 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <card.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                      <p className="text-sm font-semibold text-foreground">{card.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Form */}
          <div
            style={{ opacity: isInView ? 1 : 0, transition: "opacity 150ms ease 75ms" }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-lg p-7 border border-border"
            >
              <p className="text-lg font-bold text-foreground mb-5">
                {t('landing.contact.form.title')}
              </p>

              {!contactFormAvailable && (
                <Alert className="mb-5 border-amber-500/40 bg-amber-500/10">
                  <AlertTriangle className="h-4 w-4 !text-amber-700 dark:!text-amber-300" />
                  <AlertTitle className="text-amber-900 dark:text-amber-100">
                    {t('landing.contact.form.disabledTitle')}
                  </AlertTitle>
                  <AlertDescription className="text-amber-800/90 dark:text-amber-100/90">
                    <p>{t('landing.contact.form.disabledMessage')}</p>
                    {contactConfigError && showTechnicalConfigHint && (
                      <p className="mt-1 text-xs">
                        {t('landing.contact.form.disabledAdminHint', { error: contactConfigError })}
                      </p>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <fieldset disabled={!contactFormAvailable} className="space-y-4 disabled:opacity-70">
                {/* Honeypot field - hidden from users, catches bots */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                      {t('landing.contact.form.name')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('landing.contact.form.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                      {t('landing.contact.form.email')}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('landing.contact.form.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
                    {t('landing.contact.form.company')}
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('landing.contact.form.companyPlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                    {t('landing.contact.form.message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('landing.contact.form.messagePlaceholder')}
                    rows={4}
                    required
                    className="resize-none"
                  />
                </div>

                {runtimeConfig.turnstileSiteKey && (
                  <TurnstileWidget
                    siteKey={runtimeConfig.turnstileSiteKey}
                    onTokenChange={handleTurnstileTokenChange}
                    resetSignal={turnstileResetSignal}
                  />
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !contactFormAvailable || !turnstileToken}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSubmitting ? (
                    t('landing.contact.form.sending')
                  ) : !contactFormAvailable ? (
                    t('landing.contact.form.unavailable')
                  ) : (
                    <>
                      {t('landing.contact.form.submit')}
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </fieldset>

              <p className="text-xs text-muted-foreground text-center mt-5">
                {t('landing.contact.form.privacy')}
              </p>
            </form>
          </div>
        </div>
      </SectionContainer>
    </Section>
  );
};
