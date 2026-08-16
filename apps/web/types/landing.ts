import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isHighlighted?: boolean;
}

export interface BrandLogo {
  name: string;
  symbol?: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}
