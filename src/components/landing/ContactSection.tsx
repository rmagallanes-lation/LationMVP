import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Send, Sparkles } from "lucide-react";
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
    <Section
      id="contact"
      tone="gradient"
      className="text-foreground dark:text-foreground"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 dark:bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/5 dark:bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <SectionContainer className="relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-accent/20 mb-8 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-accent" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground dark:text-foreground mb-6 leading-tight">
              {t('landing.contact.titlePrimary')} <br />
              <span className="text-accent">{t('landing.contact.titleAccent')}</span>
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground dark:text-muted-foreground mb-10 leading-relaxed">
              {t('landing.contact.subtitle')}
            </p>

            {/* Contact Options */}
            <div className="space-y-4">
              {contactCards.map((card, index) => {
                const interactionClasses = card.interactive
                  ? "hover:bg-accent/20 transition-colors group cursor-pointer"
                  : "";
                const iconHoverClasses = card.interactive ? "group-hover:bg-accent/30" : "";

                if (card.href) {
                  return (
                    <motion.a
                      key={card.label}
                      href={card.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl bg-accent/10 ${interactionClasses}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-colors ${iconHoverClasses}`}
                      >
                        <card.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                          {card.label}
                        </p>
                        <p className="font-semibold text-foreground dark:text-foreground">
                          {card.value}
                        </p>
                      </div>
                    </motion.a>
                  );
                }

                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-accent/10 ${interactionClasses}`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-colors ${iconHoverClasses}`}
                    >
                      <card.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="font-semibold text-foreground dark:text-foreground">
                        {card.value}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Content - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-card/80 dark:bg-card/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-border dark:border-border"
            >
              <h3 className="text-2xl font-bold text-foreground dark:text-foreground mb-6">
                {t('landing.contact.form.title')}
              </h3>

              {!contactFormAvailable && (
                <Alert className="mb-6 border-amber-500/40 bg-amber-500/10">
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

              <fieldset disabled={!contactFormAvailable} className="space-y-5 disabled:opacity-70">
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

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground/80 dark:text-muted-foreground mb-2">
                      {t('landing.contact.form.name')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('landing.contact.form.namePlaceholder')}
                      required
                      className="bg-background/80 dark:bg-background/60 border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground/80 dark:text-muted-foreground mb-2">
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
                      className="bg-background/80 dark:bg-background/60 border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground/80 dark:text-muted-foreground mb-2">
                    {t('landing.contact.form.company')}
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('landing.contact.form.companyPlaceholder')}
                    className="bg-background/80 dark:bg-background/60 border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/80 dark:text-muted-foreground mb-2">
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
                    className="bg-background/80 dark:bg-background/60 border-border dark:border-border text-foreground dark:text-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground focus:border-accent focus:ring-accent resize-none"
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
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
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

              <p className="text-xs text-muted-foreground dark:text-muted-foreground text-center mt-6">
                {t('landing.contact.form.privacy')}
              </p>
            </form>
          </motion.div>
        </div>
      </SectionContainer>
    </Section>
  );
};
