'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Activity, Globe, FileText, ShieldAlert,
  ArrowUpRight, Search, Loader2,
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface SystemItem {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  url: string;
  updated_at: string;
}

export default function SystemsPage() {
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSystems = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('systems')
        .select('*')
        .order('id', { ascending: true });
      if (data) setSystems(data);
      setLoading(false);
    };
    fetchSystems();
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldAlert': return ShieldAlert;
      case 'Globe': return Globe;
      case 'FileText': return FileText;
      default: return Activity;
    }
  };

  const filtered = systems.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans flex flex-col text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Masthead */}
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 md:pt-20 pb-14">
          <div className="flex items-center justify-between pb-6 border-b border-[var(--rule)]">
            <div className="kicker">Directory · Digital Infrastructure</div>
            <div className="kicker hidden sm:block">Section 03</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 md:pt-16">
            <div className="lg:col-span-8">
              <h1 className="display-hero text-[var(--text-primary)]">
                ระบบสารสนเทศ<br />
                <span className="serif-italic accent-text">NIEM Center</span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-[var(--rule)] flex flex-col justify-end">
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                ช่องทางเข้าสู่ระบบงานและฐานข้อมูลของสถาบันการแพทย์ฉุกเฉินแห่งชาติ เพื่อให้บุคลากรปฏิบัติงานได้อย่างรวดเร็วและปลอดภัย
              </p>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-10">
          <div className="pt-6 border-t border-[var(--rule)] flex items-center gap-4">
            <div className="relative flex-grow max-w-xl">
              <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" strokeWidth={1.6} />
              <input
                type="text"
                placeholder="ค้นหาชื่อระบบ เช่น ITEMS, EMS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ed-input w-full pl-12 pr-5 py-3 rounded-full text-sm"
              />
            </div>
            <div className="kicker hidden md:block">{filtered.length} / {systems.length} รายการ</div>
          </div>
        </section>

        {/* Grid */}
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-6 h-6 text-[var(--text-secondary)] animate-spin mb-4" strokeWidth={1.5} />
              <div className="kicker">Loading systems</div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((system, idx) => {
                const Icon = getIcon(system.icon_name);
                return (
                  <a
                    key={system.id}
                    href={system.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group ed-card hover-lift p-8 flex flex-col min-h-[260px] relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-10">
                      <div className="w-11 h-11 rounded-2xl bg-[var(--bg-tertiary)] text-[var(--text-primary)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)] transition-colors">
                        <Icon className="w-5 h-5" strokeWidth={1.6} />
                      </div>
                      <div className="kicker text-[var(--text-tertiary)]">№ {String(idx + 1).padStart(2, '0')}</div>
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-xl md:text-2xl font-medium tracking-tight text-[var(--text-primary)] mb-2 group-hover:accent-text transition-colors">
                        {system.name}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                        {system.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[var(--rule)] flex items-center justify-between">
                      <span className="kicker-accent">Access Portal</span>
                      <ArrowUpRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent-deep)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" strokeWidth={1.6} />
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="ed-card p-16 text-center">
              <div className="kicker mb-3">No Results</div>
              <h2 className="display-md text-[var(--text-primary)] mb-2">ไม่พบระบบที่ค้นหา</h2>
              <p className="text-[var(--text-secondary)]">ลองเปลี่ยนคำค้นหาหรือดูรายการทั้งหมด</p>
            </div>
          )}
        </section>

        {/* Banner */}
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-24">
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-16 lg:p-20"
            style={{ background: 'var(--surface-ink)' }}
          >
            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-8">
                <div className="kicker-accent mb-5" style={{ color: 'var(--accent)' }}>แจ้งปัญหา / ขอเพิ่มระบบ</div>
                <h2 className="display-lg text-white">
                  ต้องการเพิ่มระบบเข้าสู่<br />
                  <span className="serif-italic" style={{ color: 'var(--accent)' }}>ฐานข้อมูลส่วนกลาง?</span>
                </h2>
                <p className="mt-6 text-white/60 leading-relaxed max-w-xl">
                  หากพบปัญหาในการเข้าใช้งาน หรือต้องการเพิ่มระบบใหม่เข้าสู่หน้ารวม โปรดแจ้งฝ่ายเทคโนโลยีสารสนเทศ NIEM
                </p>
              </div>
              <div className="md:col-span-4 flex items-end md:justify-end">
                <button className="btn-primary px-6 py-3.5 text-sm flex items-center gap-2">
                  ติดต่อแจ้งความประสงค์ <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
