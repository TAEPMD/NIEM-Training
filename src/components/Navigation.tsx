'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Menu, X } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface NavPage {
  title: string;
  slug: string;
}

export default function Navbar({ activeTab, setActiveTab }: { activeTab?: string, setActiveTab?: (tab: string) => void }) {
  const [dynamicPages, setDynamicPages] = useState<NavPage[]>([]);
  const [navLinks, setNavLinks] = useState<any[]>([
    { name: 'หน้าแรก', href: '/', tab: 'home' },
    { name: 'หลักสูตร', href: '/', tab: 'courses' },
    { name: 'บทความ (Blog)', href: '/blog', tab: 'blog' },
    { name: 'ระบบสารสนเทศ', href: '/systems', tab: 'systems' },
    { name: 'ค้นหาใบประกาศฯ', href: '/', tab: 'cert' },
  ]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<any>({ name: 'Niem Center', logo_url: '' });

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
      if (nav && nav.value) setNavLinks(nav.value);

      // Fetch Site Config
      const { data: site } = await supabase.from('settings').select('*').eq('key', 'site_config').single();
      if (site && site.value) setSiteConfig(site.value);
    };
    fetchNavData();
  }, []);

  return (
    <nav className="bg-blue-900 text-white shadow-xl sticky top-0 z-50 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <Link href="/" className="flex items-center cursor-pointer group">
            {siteConfig.logo_url ? (
              <img src={siteConfig.logo_url} alt={siteConfig.name} className="h-10 w-auto mr-3" />
            ) : (
              <Activity className="w-9 h-9 mr-3 text-red-500 transform group-hover:rotate-12 transition-transform" />
            )}
            <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter uppercase leading-none">{siteConfig.name.split(' ')[0]}</span>
              <span className="font-bold text-blue-400 text-[10px] tracking-[0.3em] uppercase leading-none mt-1">{siteConfig.name.split(' ').slice(1).join(' ') || 'Center'}</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-1 items-center font-sans">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                onClick={() => {
                  if (link.tab) setActiveTab?.(link.tab);
                }}
                className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  activeTab === link.tab 
                    ? 'bg-white text-blue-900 shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {dynamicPages.map(page => (
              <Link key={page.slug} href={`/${page.slug}`} className="px-4 py-2.5 rounded-2xl text-sm font-bold text-blue-100 hover:text-white hover:bg-white/10 transition-all">
                {page.title}
              </Link>
            ))}

            <button className="ml-6 px-7 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 transform hover:-translate-y-0.5">
              User Portal
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-blue-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[80vh] border-t border-blue-800' : 'max-h-0'}`}>
        <div className="px-4 pt-4 pb-8 space-y-2 bg-blue-950/50 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              onClick={() => {
                if (link.tab) setActiveTab?.(link.tab);
                setIsMenuOpen(false);
              }}
              className={`block px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                activeTab === link.tab 
                  ? 'bg-blue-600 text-white' 
                  : 'text-blue-100 hover:bg-white/5'
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
              className="block px-5 py-4 rounded-2xl text-base font-bold text-blue-100 hover:bg-white/5 transition-all"
            >
              {page.title}
            </Link>
          ))}
          <div className="pt-4 px-2">
            <button className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-blue-900/40">
              User Portal
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

