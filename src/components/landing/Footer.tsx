import { Link } from "react-router-dom";
import lationLogoDark from "@/assets/lation-logo-dark.png";
import { useTranslation } from "react-i18next";
import { getFooterLinks, getFooterSocialLinks } from "@/components/landing/landing-content";

export const Footer = () => {
  const { t } = useTranslation();
  const footerLinks = getFooterLinks(t);
  const socialLinks = getFooterSocialLinks();

  return (
    <footer className="bg-black text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <span className="inline-flex items-center">
                <img
                  src={lationLogoDark}
                  alt="Lation"
                  className="h-12 w-auto"
                />
              </span>
            </Link>
            <p className="text-primary-foreground mb-6 max-w-xs">
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
                    className="text-primary-foreground hover:text-primary-foreground transition-colors text-sm"
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
                    className="text-primary-foreground hover:text-primary-foreground transition-colors text-sm"
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
                    className="text-primary-foreground hover:text-primary-foreground transition-colors text-sm"
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
                    className="text-primary-foreground hover:text-primary-foreground transition-colors text-sm"
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
            <p className="text-primary-foreground text-sm">
              {t('landing.footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <p className="text-primary-foreground text-sm">
              {t('landing.footer.madeWith')} <span className="text-accent">❤️</span> {t('landing.footer.forHiring')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
