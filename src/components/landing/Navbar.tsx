import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import lationLogoLight from "@/assets/lation-logo-light.png";
import lationLogoDark from "@/assets/lation-logo-dark.png";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        isScrolled
          ? "bg-background border-b border-border py-3"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src={lationLogoLight}
              alt="Lation"
              className="block dark:hidden h-14 md:h-16 w-auto"
            />
            <img
              src={lationLogoDark}
              alt="Lation"
              className="hidden dark:block h-14 md:h-16 w-auto"
            />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};
