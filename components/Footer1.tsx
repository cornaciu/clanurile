import Link from "next/link";
import { Facebook, Twitter, Instagram, Github, type LucideIcon } from "lucide-react";

interface LinkItem {
  href: string;
  label: string;
}

interface SocialLink {
  href: string;
  icon: LucideIcon;
  name: string;
}

interface Footer1Props {
  aboutUsTitle?: string;
  aboutUsDescription?: string;
  quickLinksTitle?: string;
  quickLinks?: LinkItem[];
  contactUsTitle?: string;
  address?: string;
  email?: string;
  phone?: string;
  followUsTitle?: string;
  socialLinks?: SocialLink[];
  copyrightText?: string;
}

const Footer1 = ({
  aboutUsTitle = "About Us",
  aboutUsDescription = "We are a company dedicated to providing excellent services and products to our customers.",
  quickLinksTitle = "Quick Links",
  quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ],
  contactUsTitle = "Contact Us",
  address = "123 Main St, Anytown, USA 12345",
  email = "info@example.com",
  phone = "(123) 456-7890",
  followUsTitle = "Follow Us",
  socialLinks = [
    { href: "/example-url", icon: Facebook, name: "Facebook" },
    { href: "/example-url", icon: Twitter, name: "Twitter" },
    { href: "/example-url", icon: Instagram, name: "Instagram" },
    { href: "/example-url", icon: Github, name: "GitHub" },
  ],
  copyrightText = `© ${new Date().getFullYear()} SERP. All rights reserved.`,
}: Footer1Props) => {
return (
    <footer className="bg-gray-1000 py-20 px-12 text-gray-400">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{aboutUsTitle}</h3>
          <p className="text-sm">{aboutUsDescription}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{quickLinksTitle}</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{contactUsTitle}</h3>
          <p className="text-sm">{address}</p>
          <p className="text-sm">Email: {email}</p>
          <p className="text-sm">Phone: {phone}</p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{followUsTitle}</h3>
          <div className="flex space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-white"
              >
                <link.icon size={24} />
                <span className="sr-only">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-700 pt-8 text-center">
        <p className="text-sm">{copyrightText}</p>
      </div>
    </footer>
  );
}
export { Footer1 };