'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';

interface NavPage {
  title: string;
  slug: string;
}

export default function Navbar({ activeTab, setActiveTab }: { activeTab?: string, setActiveTab?: (tab: string) => void }) {
  const [dynamicPages, setDynamicPages] = useState<NavPage[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('niem_pages');
    if (saved) {
      setDynamicPages(JSON.parse(saved).filter((p: any) => p.status === 'Published'));
    }
  }, []);

  return (
    <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex items-center cursor-pointer">
            <Activity className="w-8 h-8 mr-2 text-red-400" />
            <div>
              <span className="font-bold text-xl tracking-wider">NIEM</span>
              <span className="font-light text-blue-200 ml-1">TRAINING CENTER</span>
            </div>
          </Link>
          <div className="hidden md:flex space-x-1 items-center font-sans">
            <Link href="/" onClick={() => setActiveTab?.('home')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'home' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>หน้าแรก</Link>
            <Link href="/" onClick={() => setActiveTab?.('courses')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'courses' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>หลักสูตร</Link>
            <Link href="/" onClick={() => setActiveTab?.('cert')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'cert' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>ค้นหาใบประกาศฯ</Link>
            
            {/* Dynamic Pages */}
            {dynamicPages.map(page => (
              <Link key={page.slug} href={`/${page.slug}`} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
                {page.title}
              </Link>
            ))}

            <button className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-bold transition-colors shadow-sm">เข้าสู่ระบบ</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
