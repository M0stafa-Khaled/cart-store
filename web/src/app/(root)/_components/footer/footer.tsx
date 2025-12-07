"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  HeadphonesIcon,
} from "lucide-react";

const FEATURES_BAR = [
  {
    title: "Free Shipping",
    description: "On orders over $50",
    icon: Truck,
    bg: "bg-blue-500/10",
    color: "text-blue-400",
  },
  {
    title: "Secure Payment",
    description: "100% protected",
    icon: Shield,
    bg: "bg-green-500/10",
    color: "text-green-400",
  },
  {
    title: "24/7 Support",
    description: "Dedicated support",
    icon: HeadphonesIcon,
    bg: "bg-purple-500/10",
    color: "text-purple-400",
  },
  {
    title: "Easy Returns",
    description: "30-day guarantee",
    icon: CreditCard,
    bg: "bg-orange-500/10",
    color: "text-orange-400",
  },
];

const SOCIAL_LINKS = [
  {
    href: "#",
    hoverBg: "hover:bg-sky-500",
    icon: Twitter,
  },
  {
    href: "#",
    hoverBg: "hover:bg-pink-600",
    icon: Instagram,
  },
  {
    href: "#",
    hoverBg: "hover:bg-red-600",
    icon: Youtube,
  },
  {
    href: "#",
    hoverBg: "hover:bg-blue-600",
    icon: Facebook,
  },
];

const QUICK_LINKS = [
  {
    href: "#",
    title: "Shop",
  },
  {
    href: "#",
    title: "About Us",
  },
  {
    href: "#",
    title: "Contact",
  },
  {
    href: "#",
    title: "Blog",
  },
];

const CUSTOMER_LINKS = [
  {
    href: "#",
    title: "FAQ",
  },
  {
    href: "#",
    title: "Shipping Info",
  },
  {
    href: "#",
    title: "Returns",
  },
  {
    href: "#",
    title: "Track Order",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-100 border border-t">
      <div className="container">
        <div className="border-b border-slate-300">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {FEATURES_BAR.map((feat) => (
                <div key={feat.title} className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 ${feat.bg} rounded-full flex items-center justify-center`}
                  >
                    <feat.icon className={`w-6 h-6 ${feat.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{feat.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-muted-foreground">
              <h3 className="text-2xl font-bold mb-4 text-main">Cart Store</h3>
              <p className="mb-4">
                Your one-stop shop for quality products at unbeatable prices.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">123 Store St, Cairo, Egypt</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+201019065964</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">support@cartstore.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-main transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
              <ul className="space-y-2">
                {CUSTOMER_LINKS.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-main transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
              <div className="flex gap-3 mb-6">
                {SOCIAL_LINKS.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className={`w-10 h-10 bg-slate-100 group rounded-full flex items-center justify-center transition-colors ${link.hoverBg}`}
                  >
                    <link.icon className="w-5 h-5 group-hover:text-white" />
                  </Link>
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                Stay connected for exclusive deals and updates
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                © 2025 Cart Store. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <Link
                  href="/privacy"
                  className="hover:text-main transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-main transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/cookies"
                  className="hover:text-main transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
