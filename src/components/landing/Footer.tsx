import { Link } from "react-router-dom";
import { Linkedin, Twitter, Github, Mail } from "lucide-react";
import lationLogo from "@/assets/lation-logo.png";
import { useTranslation } from "react-i18next";

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@lation.io", label: "Email" },
];

export const Footer = () => {
  const { t } = useTranslation();

  const footerLinks = {
    product: [
      { label: t('landing.footer.columns.product.features'), href: "#services" },
      { label: t('landing.footer.columns.product.enterprises'), href: "#contact" },
      { label: t('landing.footer.columns.product.api'), href: "#" },
    ],
    company: [
      { label: t('landing.footer.columns.company.about'), href: "#about" },
      { label: t('landing.footer.columns.company.careers'), href: "#" },
      { label: t('landing.footer.columns.company.blog'), href: "#" },
      { label: t('landing.footer.columns.company.press'), href: "#" },
    ],
    resources: [
      { label: t('landing.footer.columns.resources.documentation'), href: "#" },
      { label: t('landing.footer.columns.resources.helpCenter'), href: "#" },
      { label: t('landing.footer.columns.resources.contact'), href: "#contact" },
      { label: t('landing.footer.columns.resources.status'), href: "#" },
    ],
    legal: [
      { label: t('landing.footer.columns.legal.privacy'), href: "#" },
      { label: t('landing.footer.columns.legal.terms'), href: "#" },
      { label: t('landing.footer.columns.legal.security'), href: "#" },
      { label: t('landing.footer.columns.legal.cookies'), href: "#" },
    ],
  };

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img
                src={lationLogo}
                alt="Lation"
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-xs">
              {t('landing.footer.tagline')}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">{t('landing.footer.columns.product.title')}</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">{t('landing.footer.columns.company.title')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">{t('landing.footer.columns.resources.title')}</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">{t('landing.footer.columns.legal.title')}</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/50 text-sm">
              {t('landing.footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <p className="text-primary-foreground/50 text-sm">
              {t('landing.footer.madeWith')} <span className="text-accent">❤️</span> {t('landing.footer.forHiring')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
