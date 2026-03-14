import { Link } from "react-router-dom";
import lationLogoDark from "@/assets/lation-logo-dark.png";
import { useTranslation } from "react-i18next";
import { getFooterLinks, getFooterSocialLinks } from "@/components/landing/landing-content";

export const Footer = () => {
  const { t } = useTranslation();
  const footerLinks = getFooterLinks(t);
  const socialLinks = getFooterSocialLinks();

  return (
    <footer className="bg-black text-primary-foreground pt-14 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <img src={lationLogoDark} alt="Lation" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-primary-foreground/70 mb-5 max-w-xs">
              {t('landing.footer.tagline')}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center hover:bg-accent/40 transition-colors duration-150"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-4 text-accent">{t('landing.footer.columns.product.title')}</p>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold mb-4 text-accent">{t('landing.footer.columns.company.title')}</p>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold mb-4 text-accent">{t('landing.footer.columns.resources.title')}</p>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-150">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold mb-4 text-accent">{t('landing.footer.columns.legal.title')}</p>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-primary-foreground/50">
              {t('landing.footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <p className="text-xs text-primary-foreground/50">
              {t('landing.footer.madeWith')} <span className="text-accent">❤️</span> {t('landing.footer.forHiring')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
