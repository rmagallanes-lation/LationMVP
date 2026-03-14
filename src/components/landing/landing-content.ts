import type { TFunction } from "i18next";
import type { LucideIcon } from "lucide-react";
import { Github, Linkedin, Mail, MessageSquare, Twitter } from "lucide-react";

type HeroPreviewCard = {
  title: string;
  subtitle: string;
  badge: string;
  cardClassName: string;
  badgeClassName: string;
};

type HeroFloatStat = {
  value: string;
  label: string;
};

type ContactCard = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  interactive?: boolean;
};

type FooterLink = {
  label: string;
  href: string;
};

type FooterLinks = {
  product: FooterLink[];
  company: FooterLink[];
  resources: FooterLink[];
  legal: FooterLink[];
};

const getHeroFeatures = (t: TFunction) => [
  t("landing.hero.features.expert"),
  t("landing.hero.features.aiPowered"),
  t("landing.hero.features.reports"),
];

const getHeroPreviewCards = (t: TFunction): HeroPreviewCard[] => [
  {
    title: t("landing.hero.preview.cards.first.title"),
    subtitle: t("landing.hero.preview.cards.first.subtitle"),
    badge: t("landing.hero.preview.cards.first.badge"),
    cardClassName: "bg-secondary/50",
    badgeClassName: "bg-primary/10 dark:bg-accent/15 text-primary dark:text-accent",
  },
  {
    title: t("landing.hero.preview.cards.second.title"),
    subtitle: t("landing.hero.preview.cards.second.subtitle"),
    badge: t("landing.hero.preview.cards.second.badge"),
    cardClassName: "bg-muted/50",
    badgeClassName: "bg-success/15 text-success",
  },
  {
    title: t("landing.hero.preview.cards.third.title"),
    subtitle: t("landing.hero.preview.cards.third.subtitle"),
    badge: t("landing.hero.preview.cards.third.badge"),
    cardClassName: "bg-muted/30",
    badgeClassName: "bg-accent/10 text-accent",
  },
];

const heroFloatingStat: HeroFloatStat = { value: "98%", label: "Accuracy Rate" };
const heroFloatingBadge: HeroFloatStat = { value: "24h", label: "Avg. SLA" };

const getContactCards = (t: TFunction): ContactCard[] => [
  {
    icon: Mail,
    label: t("landing.contact.email.label"),
    value: "hello@lation.io",
    href: "mailto:hello@lation.io",
    interactive: true,
  },
  {
    icon: MessageSquare,
    label: t("landing.contact.response.label"),
    value: t("landing.contact.response.time"),
  },
];

const getFooterSocialLinks = () => [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@lation.io", label: "Email" },
];

const getFooterLinks = (t: TFunction): FooterLinks => ({
  product: [
    { label: t("landing.footer.columns.product.features"), href: "#services" },
    { label: t("landing.footer.columns.product.enterprises"), href: "#contact" },
    { label: t("landing.footer.columns.product.api"), href: "#" },
  ],
  company: [
    { label: t("landing.footer.columns.company.about"), href: "#about" },
    { label: t("landing.footer.columns.company.careers"), href: "#" },
    { label: t("landing.footer.columns.company.blog"), href: "#" },
    { label: t("landing.footer.columns.company.press"), href: "#" },
  ],
  resources: [
    { label: t("landing.footer.columns.resources.documentation"), href: "#" },
    { label: t("landing.footer.columns.resources.helpCenter"), href: "#" },
    { label: t("landing.footer.columns.resources.contact"), href: "#contact" },
    { label: t("landing.footer.columns.resources.status"), href: "#" },
  ],
  legal: [
    { label: t("landing.footer.columns.legal.privacy"), href: "#" },
    { label: t("landing.footer.columns.legal.terms"), href: "#" },
    { label: t("landing.footer.columns.legal.security"), href: "/security" },
    { label: t("landing.footer.columns.legal.cookies"), href: "#" },
  ],
});

export {
  getContactCards,
  getFooterLinks,
  getFooterSocialLinks,
  getHeroFeatures,
  getHeroPreviewCards,
  heroFloatingBadge,
  heroFloatingStat,
};
