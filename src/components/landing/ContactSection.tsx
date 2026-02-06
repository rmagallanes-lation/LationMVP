import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mail, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const ContactSection = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(t('landing.contact.form.success'));
    setFormData({ name: "", email: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section
      id="contact"
      className="py-24 bg-primary text-primary-foreground dark:bg-gradient-section dark:text-foreground relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={ref}>
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

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground dark:text-foreground mb-6 leading-tight">
              {t('landing.contact.titlePrimary')} <br />
              <span className="text-accent">{t('landing.contact.titleAccent')}</span>
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/80 dark:text-muted-foreground mb-10 leading-relaxed">
              {t('landing.contact.subtitle')}
            </p>

            {/* Contact Options */}
            <div className="space-y-4">
              <motion.a
                href="mailto:hello@lation.io"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-accent/10 hover:bg-accent/20 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60 dark:text-muted-foreground">{t('landing.contact.email.label')}</p>
                  <p className="font-semibold text-primary-foreground dark:text-foreground">hello@lation.io</p>
                </div>
              </motion.a>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-accent/10"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60 dark:text-muted-foreground">{t('landing.contact.response.label')}</p>
                  <p className="font-semibold text-primary-foreground dark:text-foreground">{t('landing.contact.response.time')}</p>
                </div>
              </motion.div>
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
              className="bg-primary-foreground/5 dark:bg-card/60 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-primary-foreground/10 dark:border-border"
            >
              <h3 className="text-2xl font-bold text-primary-foreground dark:text-foreground mb-6">
                {t('landing.contact.form.title')}
              </h3>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary-foreground/80 dark:text-muted-foreground mb-2">
                      {t('landing.contact.form.name')}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('landing.contact.form.namePlaceholder')}
                      required
                      className="bg-primary-foreground/10 dark:bg-background/60 border-primary-foreground/20 dark:border-border text-primary-foreground dark:text-foreground placeholder:text-primary-foreground/40 dark:placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary-foreground/80 dark:text-muted-foreground mb-2">
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
                      className="bg-primary-foreground/10 dark:bg-background/60 border-primary-foreground/20 dark:border-border text-primary-foreground dark:text-foreground placeholder:text-primary-foreground/40 dark:placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-primary-foreground/80 dark:text-muted-foreground mb-2">
                    {t('landing.contact.form.company')}
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t('landing.contact.form.companyPlaceholder')}
                    className="bg-primary-foreground/10 dark:bg-background/60 border-primary-foreground/20 dark:border-border text-primary-foreground dark:text-foreground placeholder:text-primary-foreground/40 dark:placeholder:text-muted-foreground focus:border-accent focus:ring-accent"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary-foreground/80 dark:text-muted-foreground mb-2">
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
                    className="bg-primary-foreground/10 dark:bg-background/60 border-primary-foreground/20 dark:border-border text-primary-foreground dark:text-foreground placeholder:text-primary-foreground/40 dark:placeholder:text-muted-foreground focus:border-accent focus:ring-accent resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  {isSubmitting ? (
                    t('landing.contact.form.sending')
                  ) : (
                    <>
                      {t('landing.contact.form.submit')}
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-primary-foreground/50 dark:text-muted-foreground text-center mt-6">
                {t('landing.contact.form.privacy')}
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
