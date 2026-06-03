'use client';

import Link from 'next/link';
import { useState } from 'react';

interface PrecisionNavbarProps {
  variant?: 'dark' | 'transparent';
}

export function PrecisionNavbar({ variant = 'dark' }: PrecisionNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/proyectos', label: 'Proyectos' },
    { href: '/#activo', label: 'El Activo' },
    { href: '/#tokenizacion', label: 'Tokenización' },
    { href: '/#estructura', label: 'Estructura' },
    { href: '/#gobernanza', label: 'Gobernanza' },
  ];

  const bgClass = variant === 'dark' 
    ? 'bg-[#0a111f]/95 border-b border-white/10' 
    : 'bg-[#0a111f]/70 border-b border-white/5';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-6 h-6 rounded bg-[#c5a46d] group-hover:bg-white transition-colors" />
          <div>
            <span className="font-semibold tracking-[-0.6px] text-[21px] text-white">PACHA</span>
            <span className="font-light tracking-[-0.6px] text-[21px] text-white/65">NOVA</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-[-0.1px]">
          {navLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              className="text-white/75 hover:text-white transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            href="/login" 
            className="px-5 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Acceder
          </Link>
          <Link 
            href="/demo/start" 
            className="bg-white hover:bg-[#c5a46d] hover:text-white text-[#0a111f] px-7 py-2.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.985]"
          >
            Explorar Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-white/70"
          aria-label="Menú"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a111f]/98 px-6 py-8 text-sm">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link href="/login" className="text-white/70 hover:text-white py-1">Acceder</Link>
              <Link 
                href="/demo/start" 
                className="bg-white text-[#0a111f] text-center py-3 rounded-2xl font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Explorar Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
