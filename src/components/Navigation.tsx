'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import ThemeToggle from './ThemeToggle';

interface NavPage {
  title: string;
  slug: string;
}

interface NavLink {
  name: string;
  href: string;
  tab?: string;
}

export default function Navbar({ activeTab, setActiveTab }: { activeTab?: string, setActiveTab?: (tab: string) => void }) {
  const [dynamicPages, setDynamicPages] = useState<NavPage[]>([]);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [siteConfig, setSiteConfig] = useState<{ name: string; logo_url?: string }>({ name: 'NIEM' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
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
          { name: 'หลักสูตร', href: '/', tab: 'courses' },
          { name: 'บทความ', href: '/blog' },
          { name: 'ระบบงาน', href: '/systems' },
          { name: 'ตรวจสอบวุฒิ', href: '#verification', tab: 'home' },
        ]);
      }

      const { data: site } = await supabase.from('settings').select('*').eq('key', 'site_config').single();
      if (site && site.value) setSiteConfig(site.value);
    };
    fetchNavData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled ? 'glass' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="h-16 flex items-center justify-between">
            {/* Logo / Wordmark */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-[var(--accent-ink)] tracking-tight">N</span>
                </div>
              </div>
              {siteConfig.logo_url ? (
                <img src={siteConfig.logo_url} alt={siteConfig.name} className="h-5 w-auto" />
              ) : (
                <span className="text-sm font-medium tracking-tight text-[var(--text-primary)]">
                  {siteConfig.name}
                  <span className="text-[var(--text-secondary)] ml-1.5 hidden sm:inline">Training Center</span>
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    if (link.tab) setActiveTab?.(link.tab);
                    if (link.href.startsWith('#')) {
                      e.preventDefault();
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`relative text-[13px] font-medium tracking-tight transition-colors ${
                    activeTab === link.tab
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.name}
                  {activeTab === link.tab && (
                    <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-[var(--accent)]" />
                  )}
                </Link>
              ))}
              {dynamicPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/${page.slug}`}
                  className="text-[13px] font-medium tracking-tight text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {page.title}
                </Link>
              ))}
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-1">
              <div className="hidden md:flex items-center gap-1 mr-2">
                <button className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors" aria-label="Search">
                  <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />
                </button>
                <button className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors" aria-label="Account">
                  <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
                </button>
                <ThemeToggle />
              </div>

              <Link
                href="/admin"
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--surface-ink)] text-[var(--bg-primary)] text-[12px] font-medium tracking-tight hover:opacity-90 transition-opacity"
              >
                เข้าสู่ระบบ
              </Link>

              {/* Mobile toggles */}
              <div className="lg:hidden flex items-center gap-1">
                <ThemeToggle />
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-full text-[var(--text-primary)]"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X className="w-5 h-5" strokeWidth={1.6} /> : <Menu className="w-5 h-5" strokeWidth={1.6} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker rule */}
        {scrolled && <div className="rule" />}
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[90] bg-[var(--bg-primary)] transition-opacity duration-500 lg:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col pt-24 px-6 pb-16 overflow-y-auto">
          <div className="kicker mb-8">Menu</div>
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.tab) setActiveTab?.(link.tab);
                  setIsMenuOpen(false);
                  if (link.href.startsWith('#')) {
                    e.preventDefault();
                    setTimeout(() => {
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }, 280);
                  }
                }}
                className="group flex items-baseline justify-between py-5 border-b border-[var(--rule)] text-[var(--text-primary)]"
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-2xl font-medium tracking-tight">{link.name}</span>
                </span>
                <span className="text-[var(--text-tertiary)] group-hover:text-[var(--accent-deep)] dark:group-hover:text-[var(--accent)] transition-colors">→</span>
              </Link>
            ))}
            {dynamicPages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-baseline justify-between py-5 border-b border-[var(--rule)] text-[var(--text-primary)] text-2xl font-medium tracking-tight"
              >
                {page.title}
                <span className="text-[var(--text-tertiary)]">→</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-12 flex items-center justify-between">
            <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="btn-ink px-6 py-3 text-sm">
              เข้าสู่ระบบผู้ดูแล
            </Link>
            <div className="kicker">RAL 1016</div>
          </div>
        </div>
      </div>
    </>
  );
}
