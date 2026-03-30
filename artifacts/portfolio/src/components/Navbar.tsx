"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 300);
  };

  return (
    <>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'py-4 glass-panel border-b border-white/10 shadow-lg' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => scrollTo(e, '#home')}
            className="text-2xl font-bold font-display tracking-tighter flex items-center gap-2 group"
          >
            <span className="text-primary group-hover:text-glow transition-all">A</span>
            <span className="text-foreground">Morgan</span>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse ml-1"></span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollTo(e, item.href)}
                    className="text-sm font-medium font-display tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors relative group py-2"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              className="px-5 py-2.5 rounded-lg border-2 border-primary/50 text-primary font-display text-sm font-bold uppercase tracking-wider hover:bg-primary/10 hover:border-primary transition-all box-glow-hover"
            >
              Resume
            </a>
          </nav>

          {/* Mobile Toggle — always on top */}
          <button
            className="md:hidden text-foreground p-2 z-[100] relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay — outside header so it covers everything */}
      <div
        className={`
          md:hidden fixed inset-0 z-[90] flex flex-col justify-center items-center gap-8
          bg-background/98 backdrop-blur-2xl
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
        `}
      >
        <ul className="flex flex-col items-center gap-10">
          {navItems.map((item, index) => (
            <li
              key={item.label}
              style={{
                transitionDelay: mobileMenuOpen ? `${index * 60}ms` : '0ms',
                transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: mobileMenuOpen ? 1 : 0,
                transition: 'transform 0.3s ease, opacity 0.3s ease',
              }}
            >
              <a
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className="text-3xl font-display font-bold text-foreground hover:text-primary transition-colors tracking-wider"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div
          style={{
            transitionDelay: mobileMenuOpen ? '240ms' : '0ms',
            transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity: mobileMenuOpen ? 1 : 0,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
        >
          <a
            href="#contact"
            onClick={(e) => scrollTo(e, '#contact')}
            className="mt-4 px-8 py-3 rounded-lg border-2 border-primary text-primary font-display font-bold uppercase tracking-wider hover:bg-primary/10 transition-all"
          >
            Resume
          </a>
        </div>
      </div>
    </>
  );
}
