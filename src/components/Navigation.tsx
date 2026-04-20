'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Menu, X, ChevronDown, UserCircle, Bell } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface NavPage {
  title: string;
  slug: string;
}

export default function Navbar({ activeTab, setActiveTab }: { activeTab?: string, setActiveTab?: (tab: string) => void }) {
  const [dynamicPages, setDynamicPages] = useState<NavPage[]>([]);
  const [navLinks, setNavLinks] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>({ name: 'NIEM Center', logo_url: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchNavData = async () => {
      // Fetch Dynamic Pages
      const { data: pages } = await supabase
        .from('pages')
        .select('title, slug')
        .eq('status', 'Published')
        .order('id', { ascending: true });
      if (pages) setDynamicPages(pages);

      // Fetch Nav Order
      const { data: nav } = await supabase.from('settings').select('*').eq('key', 'navigation').single();
      if (nav && nav.value) {
        setNavLinks(nav.value);
      } else {
        setNavLinks([
          { name: 'หน้าแรก', href: '/', tab: 'home' },
          { name: 'หลักสูตร', href: '/', tab: 'courses' },
          { name: 'บทความ (Blog)', href: '/blog', tab: 'blog' },
          { name: 'ระบบสารสนเทศ', href: '/systems', tab: 'systems' },
          { name: 'ค้นหาใบประกาศฯ', href: '/', tab: 'cert' },
        ]);
      }

      // Fetch Site Config
      const { data: site } = await supabase.from('settings').select('*').eq('key', 'site_config').single();
      if (site && site.value) setSiteConfig(site.value);
    };
    fetchNavData();
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-2 px-4' : 'py-6 px-6'}`}>
      <div className={`max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 overflow-hidden ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white' : 'bg-slate-900 shadow-2xl'}`}>
        <div className="px-6 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className={`p-2 rounded-xl transition-all duration-500 ${scrolled ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white/10'}`}>
              {siteConfig.logo_url ? (
                <img src={siteConfig.logo_url} alt={siteConfig.name} className="h-8 w-auto" />
              ) : (
                <Activity className={`w-7 h-7 transform group-hover:rotate-12 transition-transform ${scrolled ? 'text-white' : 'text-blue-400'}`} />
              )}
            </div>
            <div className="ml-3 flex flex-col">
              <span className={`font-black text-2xl tracking-tighter uppercase leading-none ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                {siteConfig.name.split(' ')[0]}
              </span>
              <span className={`font-bold text-[9px] tracking-[0.3em] uppercase leading-none mt-1.5 ${scrolled ? 'text-blue-600' : 'text-blue-400/80'}`}>
                {siteConfig.name.split(' ').slice(1).join(' ') || 'Center'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={() => {
                  if (link.tab) setActiveTab?.(link.tab);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative group flex items-center ${
                  activeTab === link.tab 
                    ? (scrolled ? 'text-blue-600' : 'text-white') 
                    : (scrolled ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white')
                }`}
              >
                {link.name}
                {activeTab === link.tab && (
                  <span className={`absolute bottom-1 left-5 right-5 h-0.5 rounded-full ${scrolled ? 'bg-blue-600' : 'bg-blue-400'}`} />
                )}
              </Link>
            ))}
            
            {/* Dynamic Pages Dropdown */}
            {dynamicPages.length > 0 && (
              <div className="relative group">
                <button className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center ${scrolled ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}>
                  ข้อมูลเพิ่มเติม <ChevronDown className="w-4 h-4 ml-1 opacity-50 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                  <div className={`p-3 rounded-2xl border ${scrolled ? 'bg-white border-slate-100 shadow-xl' : 'bg-slate-800 border-white/10 shadow-2xl overflow-hidden'}`}>
                    {dynamicPages.map(page => (
                      <Link key={page.slug} href={`/${page.slug}`} className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${scrolled ? 'hover:bg-blue-50 text-slate-700 hover:text-blue-600' : 'hover:bg-white/5 text-slate-300 hover:text-white'}`}>
                        {page.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="ml-6 flex items-center space-x-3">
              <button className={`p-2.5 rounded-xl transition-all ${scrolled ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-900' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <Bell className="w-5 h-5" />
              </button>
              <button className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all transform active:scale-95 ${
                scrolled 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700' 
                  : 'bg-white text-slate-900 hover:bg-blue-50 shadow-2xl'
              }`}>
                User Portal
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-3 rounded-xl transition-all ${scrolled ? 'bg-slate-100 text-slate-900' : 'bg-white/10 text-white'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-x-4 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden lg:hidden ${isMenuOpen ? 'top-28 opacity-100' : 'top-[-100%] opacity-0'}`}>
        <div className={`p-6 rounded-[2.5rem] border shadow-2xl ${scrolled ? 'bg-white/95 backdrop-blur-2xl border-white' : 'bg-slate-900/95 backdrop-blur-2xl border-white/5'}`}>
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={() => {
                  if (link.tab) setActiveTab?.(link.tab);
                  setIsMenuOpen(false);
                }}
                className={`block px-6 py-4 rounded-2xl text-base font-bold transition-all ${
                  activeTab === link.tab 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                    : (scrolled ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-400 hover:bg-white/5 hover:text-white')
                }`}
              >
                {link.name}
              </Link>
            ))}
            {dynamicPages.map(page => (
              <Link 
                key={page.slug} 
                href={`/${page.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-6 py-4 rounded-2xl text-base font-bold transition-all ${scrolled ? 'text-slate-600 hover:bg-slate-50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                {page.title}
              </Link>
            ))}
            <div className="pt-6">
              <button className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-3xl shadow-2xl shadow-blue-600/40">
                User Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
