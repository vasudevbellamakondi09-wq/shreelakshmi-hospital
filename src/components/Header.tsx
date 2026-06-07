/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LucideIcon from './LucideIcon';
import HospitalLogo from './HospitalLogo';

interface HeaderProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Header({ onNavigate, activeSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About Us' },
    { id: 'departments', label: 'Departments' },
    { id: 'doctors', label: 'Our Doctors' },
    { id: 'book', label: 'Book Appointment' }
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-100 py-3' 
          : 'bg-white py-5 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            id="brand-logo"
            onClick={() => handleItemClick('hero')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-1 rounded-full bg-slate-50 border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-slate-200 transition-all duration-300">
              <HospitalLogo size="2.5rem" className="group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div>
              <span className="text-xl font-bold font-sans tracking-tight text-slate-800 group-hover:text-sky-700 transition-colors">
                Shrilakshmi
              </span>
              <span className="text-xs block font-bold text-sky-600 tracking-wider uppercase font-mono leading-none">
                Hospital
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleItemClick(item.id)}
                className={`text-sm font-semibold tracking-wide transition-colors relative py-2 ${
                  activeSection === item.id 
                    ? 'text-sky-600' 
                    : 'text-slate-500 hover:text-sky-600'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Contact Details & Appointment Fast Action */}
          <div id="quick-contact" className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="bg-slate-50 p-2 rounded-full border border-slate-100">
                <LucideIcon name="phone" className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold leading-none">
                  24/7 Helpline
                </span>
                <a href="tel:+918029994444" className="text-xs font-bold text-slate-700 hover:text-sky-600">
                  +91 80 2999 4444
                </a>
              </div>
            </div>

            <button
              id="cta-header-book"
              onClick={() => handleItemClick('book')}
              className="bg-sky-650 hover:bg-sky-700 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden">
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-nav-panel" className="md:hidden bg-white border-t border-slate-100 shadow-xl absolute top-full left-0 right-0 py-4 px-6 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`mob-nav-${item.id}`}
              onClick={() => handleItemClick(item.id)}
              className={`block w-full text-left py-2 font-medium transition-colors ${
                activeSection === item.id 
                  ? 'text-sky-650 bg-sky-50 rounded-lg px-3' 
                  : 'text-slate-600 hover:text-sky-650 px-3'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-4 px-3">
            <div className="flex items-center gap-3">
              <LucideIcon name="phone" className="w-5 h-5 text-sky-500" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold leading-none">
                  Emergency Line
                </span>
                <a href="tel:+918029994444" className="text-sm font-semibold text-slate-700">
                  +91 80 2999 4444
                </a>
              </div>
            </div>
            <button
              id="mob-cta-header-book"
              onClick={() => handleItemClick('book')}
              className="w-full bg-sky-600 text-white font-semibold py-2.5 rounded-xl uppercase tracking-wider text-xs shadow-md"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
