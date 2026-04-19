'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface NavPage {
  title: string;
  slug: string;
}

export default function Navbar({ activeTab, setActiveTab }: { activeTab?: string, setActiveTab?: (tab: string) => void }) {
  const [dynamicPages, setDynamicPages] = useState<NavPage[]>([]);

  useEffect(() => {
    const fetchPages = async () => {
      const { data } = await supabase
        .from('pages')
        .select('title, slug')
        .eq('status', 'Published')
        .order('id', { ascending: true });
      if (data) setDynamicPages(data);
    };
    fetchPages();
  }, []);

  return (
    <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex items-center cursor-pointer">
            <Activity className="w-8 h-8 mr-2 text-red-400" />
            <div>
              <span className="font-bold text-xl tracking-wider uppercase">Niem</span>
              <span className="font-light text-blue-200 ml-1 text-xs tracking-widest uppercase">Center</span>
            </div>
          </Link>
          <div className="hidden md:flex space-x-1 items-center font-sans tracking-tight">
            <Link href="/" onClick={() => setActiveTab?.('home')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'home' ? 'bg-white/10 text-white' : 'text-blue-200 hover:text-white hover:bg-white/5'}`}>หน้าแรก</Link>
            <Link href="/" onClick={() => setActiveTab?.('courses')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-white/10 text-white' : 'text-blue-200 hover:text-white hover:bg-white/5'}`}>หลักสูตร</Link>
            <Link href="/blog" className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'blog' ? 'bg-white/10 text-white' : 'text-blue-200 hover:text-white hover:bg-white/5'}`}>บทความ (Blog)</Link>
            <Link href="/" onClick={() => setActiveTab?.('cert')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'cert' ? 'bg-white/10 text-white' : 'text-blue-200 hover:text-white hover:bg-white/5'}`}>ค้นหาใบประกาศฯ</Link>
            
            {/* Dynamic Pages */}
            {dynamicPages.map(page => (
              <Link key={page.slug} href={`/${page.slug}`} className="px-4 py-2 rounded-xl text-sm font-bold text-blue-200 hover:text-white hover:bg-white/5 transition-all">
                {page.title}
              </Link>
            ))}

            <button className="ml-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">User Portal</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
