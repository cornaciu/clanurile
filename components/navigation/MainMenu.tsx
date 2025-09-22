// components/navigation/Nav1.tsx
'use client';

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

interface MainMenuProps {
  logoSrc?: string;
  logoAlt?: string;
  logoText?: string;
  logoLinkHref?: string;
}

export function MainMenu({
  logoSrc,
  logoAlt,
  logoText,
  logoLinkHref,
}: MainMenuProps) {
  const router = useRouter();
  
  const defaultLogoSrc =
    "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/3932163b-825d-4a66-22d7-a64cd0ed1300/public";
  const defaultLogoAlt = "Serp Arrow Logo";
  const defaultLogoText = "Serp";
  const defaultLogoLinkHref = "/";

  const currentLogoSrc = logoSrc ?? defaultLogoSrc;
  const currentLogoAlt = logoAlt ?? defaultLogoAlt;
  const currentLogoText = logoText ?? defaultLogoText;
  const currentLogoLinkHref = logoLinkHref ?? defaultLogoLinkHref;

  const handleLogout = async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        router.push('/login');
    } catch (error) {
        console.error("Eroare la delogare:", error);
    }
  };

  const navigationItems = [
    { name: "Acasă", href: "/" },
    { name: "Misiuni", href: "/crimes" },
    { name: "Profil", href: "/profile/me" },
  ];

  return (
    <header className="border-b border-gray-700 bg-gray-900 text-white w-full">
      <nav className="container mx-auto flex h-18 items-center justify-between px-12">


        {/* Desktop Navigation */}
        <div className="hidden items-center gap-12 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm transition-colors hover:text-gray-300"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-12 md:flex">
            <Button variant="ghost" asChild>
                <Link href="/login">Autentificare</Link>
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
                Delogare
            </Button>
        </div>
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-7" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gray-900 text-white border-gray-700">
            <div className="mt-8 flex flex-col gap-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm transition-colors hover:text-gray-300"
                >
                  {item.name}
                </Link>
              ))}
              <hr className="my-4" />
              <Button variant="ghost" asChild className="justify-start">
                <Link href="/login">Autentificare</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Înregistrare</Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="justify-start">
                Delogare
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}