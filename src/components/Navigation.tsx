'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Menu, X, Search, User } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import ThemeToggle from './ThemeToggle';

interface NavPage {
  title: string;
  slug: string;
}

export default function Navbar({ activeTab, setActiveTab }: { activeTab?: string, setActiveTab?: (tab: string) => void }) {
  const [dynamicPages, setDynamicPages] = useState<NavPage[]>([]);
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>({ name: 'NIEM', logo_url: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchNavData = async () => {
      const { data: pages } = await supabase.from('pages').select('title, slug').eq('status', 'Published').order('id', { ascending: true });
      if (pages) setDynamicPages(pages);

      const { data: nav } = await supabase.from('settings').select('*').eq('key', 'navigation').single();
      if (nav && nav.value) {
        setNavLinks(nav.value);
      } else {
        setNavLinks([
          { name: 'หน้าแรก', href: '/', tab: 'home' },
          { name: 'AI Pathway', href: '#ai-pathway', tab: 'home' },
          { name: 'การตรวจสอบ', href: '#verification', tab: 'home' },
          { name: 'หลักสูตร', href: '/', tab: 'courses' },
          { name: 'บทความ', href: '#news', tab: 'home' },
          { name: 'สถิติ', href: '#stats', tab: 'home' },
        ]);
      }

      const { data: site } = await supabase.from('settings').select('*').eq('key', 'site_config').single();
      if (site && site.value) setSiteConfig(site.value);
    };
    fetchNavData();
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'apple-glass border-b border-[var(--apple-border)]' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 flex items-center justify-between text-[var(--text-primary)]">
            {/* Logo */}
            <Link href="/" className="flex items-center group opacity-90 hover:opacity-100 transition-opacity">
              {siteConfig.logo_url ? (
                <img src={siteConfig.logo_url} alt={siteConfig.name} className="h-5 w-auto" />
              ) : (
                <Activity className="w-5 h-5 text-[var(--text-primary)]" />
              )}
              {/* Optional Name */}
              {/* <span className="ml-2 font-semibold text-sm tracking-tight">{siteConfig.name}</span> */}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 text-xs tracking-tight">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  onClick={(e) => { 
                    if (link.tab) setActiveTab?.(link.tab);
                    // Smooth scroll for anchor links
                    if (link.href.startsWith('#')) {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`opacity-80 hover:opacity-100 transition-opacity ${activeTab === link.tab ? 'font-semibold opacity-100' : 'font-medium'}`}
                >
                  {link.name}
                </Link>
              ))}
              {dynamicPages.map(page => (
                <Link key={page.slug} href={`/${page.slug}`} className="opacity-80 hover:opacity-100 transition-opacity font-medium">
                  {page.title}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-4 opacity-80">
               <ThemeToggle />
               <button className="hover:opacity-100 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"><Search className="w-4 h-4" /></button>
               <button className="hover:opacity-100 transition-opacity p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full"><User className="w-4 h-4" /></button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="opacity-80 hover:opacity-100 transition-opacity p-2">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu */}
      <div className={`fixed inset-0 z-50 bg-[var(--bg-primary)] transition-transform duration-500 ease-in-out px-6 pt-24 pb-12 overflow-y-auto ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
         <div className="flex flex-col space-y-6 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={(e) => {
                  if (link.tab) setActiveTab?.(link.tab);
                  setIsMenuOpen(false);
                  // Smooth scroll for anchor links
                  if (link.href.startsWith('#')) {
                    e.preventDefault();
                    setTimeout(() => {
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }
                }}
                className={`border-b border-[var(--apple-border)] pb-4 ${activeTab === link.tab ? 'text-[var(--accent)]' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            {dynamicPages.map(page => (
              <Link 
                key={page.slug} 
                href={`/${page.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="border-b border-[var(--apple-border)] pb-4"
              >
                {page.title}
              </Link>
            ))}
         </div>
      </div>
    </>
  );
}
