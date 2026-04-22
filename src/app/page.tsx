'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { NewsSkeleton, StatsSkeleton, SearchSkeleton } from '@/components/Skeleton';
import {
  Search, Users, Award, TrendingUp, ArrowUpRight, Sparkles, Loader2,
  ArrowRight, Shield, GraduationCap, AlertCircle, Plus,
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface CourseItem { id: number; name: string; category: string; status: string; }
interface SearchResult { name?: string; course?: string; date?: string; status?: string; error?: string; }
interface HeroData { title?: string; subtitle?: string; button_text?: string; button2_text?: string; }
interface NewsItem { id: number; title: string; slug: string; category: string; created_at?: string; summary?: string; }

function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export default function App() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [searchCert, setSearchCert] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const [coursesList, setCoursesList] = useState<CourseItem[]>([]);
  const [dbNews, setDbNews] = useState<NewsItem[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  const [stats, setStats] = useState({ staffCount: 0, courseCount: 0, staffGrowth: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [clock, setClock] = useState<string>('');

  const heroReveal = useScrollReveal(0.1);
  const featuresReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' BKK');
    };
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const { data: courses } = await supabase.from('courses').select('*').limit(6);
        if (courses) setCoursesList(courses);

        const { data: news } = await supabase.from('blogs').select('*').eq('status', 'Published').order('created_at', { ascending: false }).limit(3);
        if (news) setDbNews(news);

        const { data: hero } = await supabase.from('settings').select('*').eq('key', 'hero').single();
        if (hero && hero.value) setHeroData(hero.value);

        const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
        const { data: settings } = await supabase.from('settings').select('*').in('key', ['staff_count', 'staff_growth']);

        const staffSetting = settings?.find(s => s.key === 'staff_count');
        const growthSetting = settings?.find(s => s.key === 'staff_growth');

        setStats({
          staffCount: staffSetting?.value || 0,
          courseCount: courseCount || 0,
          staffGrowth: growthSetting?.value || 0,
        });
      } catch (error) {
        console.error(error);
        showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
      } finally {
        setTimeout(() => setIsLoading(false), 400);
      }
    };
    fetchHomeData();
  }, [showToast]);

  const handleSearchCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCert.trim()) {
      showToast('กรุณากรอกรหัสใบประกาศนียบัตร', 'warning');
      return;
    }
    if (searchCert === 'NIEM-2026-001') {
      setSearchResult({ name: 'นาย เต้ (Paramedic)', course: 'Technical Rescue Instructor', date: '12 เม.ย. 2026', status: 'Valid' });
      showToast('พบข้อมูลใบประกาศนียบัตร', 'success');
    } else {
      setSearchResult({ error: 'ไม่พบข้อมูล' });
      showToast('ไม่พบข้อมูลใบประกาศนียบัตร', 'error');
    }
  };

  const handleAiRecommendation = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true); setAiError(''); setAiResponse('');
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const prompt = `คุณคือผู้เชี่ยวชาญด้านการแพทย์ฉุกเฉิน (EMS) และกู้ภัย ของสถาบันการแพทย์ฉุกเฉิน... แนะนำหลักสูตรสั้นๆ สำหรับคนที่มีเป้าหมาย: "${aiQuery}"`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'แนะนำให้ลองตรวจสอบข้อมูลเพิ่มเติมที่หน้าหลักสูตร';
      setAiResponse(responseText);
      showToast('AI วิเคราะห์เส้นทางสำเร็จ', 'success');
    } catch {
      setAiError('เกิดข้อผิดพลาดในการประมวลผล');
      showToast('เกิดข้อผิดพลาดในการเชื่อมต่อ AI', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="w-full overflow-x-hidden pt-16">
        {activeTab === 'home' && (
          <>
            {/* ——————— HERO ——————— */}
            <section
              ref={heroReveal.ref}
              className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 pb-24 md:pt-20 md:pb-32"
            >
              {/* Top status bar */}
              <div className={`flex items-center justify-between pb-8 border-b border-[var(--rule)] transition-all duration-700 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <div className="flex items-center gap-4">
                  <span className="kicker-accent flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]" />
                    </span>
                    เปิดรับสมัครรอบใหม่
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-6 kicker">
                  <span>TH · EN</span>
                  <span>{clock}</span>
                  <span>№ 2026 / Q2</span>
                </div>
              </div>

              {/* Display */}
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 pt-14 md:pt-20 transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="lg:col-span-8">
                  <div className="kicker mb-6">Issue 01 — ศูนย์ฝึกอบรม NIEM</div>
                  <h1 className="display-hero text-[var(--text-primary)]">
                    {heroData?.title || 'ยกระดับมาตรฐาน'}
                    <br />
                    <span className="serif-italic accent-text">การแพทย์ฉุกเฉิน</span>
                    <br />
                    สู่ความเป็นเลิศ
                    <span className="inline-block w-3 h-3 rounded-full bg-[var(--accent)] align-top ml-3 mt-4 md:mt-8" />
                  </h1>
                </div>

                <div className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-[var(--rule)] flex flex-col justify-end">
                  <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-md mb-8">
                    {heroData?.subtitle || 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ เปิดหลักสูตรรับรองมาตรฐานสากล สำหรับบุคลากรกู้ชีพและกู้ภัยทั่วประเทศ'}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="btn-primary px-6 py-3 text-sm flex items-center gap-2 group"
                    >
                      {heroData?.button_text || 'ดูหลักสูตรทั้งหมด'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.8} />
                    </button>
                    <a
                      href="#verification"
                      className="btn-ghost px-6 py-3 text-sm flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" strokeWidth={1.6} />
                      {heroData?.button2_text || 'ตรวจสอบวุฒิ'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Ticker row */}
              <div className="mt-20 md:mt-28 pt-6 border-t border-[var(--rule)] grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Accreditation', value: 'ISO / สพฉ.' },
                  { label: 'Pathway', value: 'EMR → Paramedic' },
                  { label: 'Language', value: 'ไทย · English' },
                  { label: 'Format', value: 'On-site · Online' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="kicker mb-2">{item.label}</div>
                    <div className="text-sm md:text-base font-medium text-[var(--text-primary)] tracking-tight">{item.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ——————— FEATURE GRID ——————— */}
            <section
              id="ai-pathway"
              ref={featuresReveal.ref}
              className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-24"
            >
              <div className="flex items-baseline justify-between mb-10 md:mb-14">
                <div>
                  <div className="kicker mb-3">01 — Core Services</div>
                  <h2 className="display-lg text-[var(--text-primary)]">สิ่งที่ NIEM มอบให้คุณ</h2>
                </div>
                <Link href="/" className="hidden md:flex link-ed text-sm">
                  ทั้งหมด <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.8} />
                </Link>
              </div>

              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 transition-all duration-700 ${featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {/* AI Pathway — large editorial card */}
                <article className="lg:col-span-7 ed-card-feature relative overflow-hidden p-8 md:p-12 flex flex-col min-h-[480px] md:min-h-[560px]">
                  <div className="flex items-start justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center">
                        <Sparkles className="w-4 h-4" strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="kicker-accent">Feature № 01</div>
                        <div className="text-[13px] text-[var(--text-secondary)]">AI Career Pathway</div>
                      </div>
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] font-mono">/ai-pathway</div>
                  </div>

                  <div className="flex-grow flex flex-col justify-center max-w-xl">
                    <h3 className="display-lg text-[var(--text-primary)] mb-4">
                      เส้นทางอาชีพ<br />
                      <span className="serif-italic accent-text">วิเคราะห์ด้วย AI</span>
                    </h3>
                    <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-8">
                      บอกเป้าหมายของคุณ ระบบจะแนะนำหลักสูตร ลำดับ และเวลาโดยประมาณ — เพื่อให้ก้าวสู่วิชาชีพกู้ชีพได้อย่างแม่นยำ
                    </p>

                    {isLoading ? <SearchSkeleton /> : (
                      <div className="space-y-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            placeholder="พิมพ์เป้าหมายของคุณ เช่น: อยากเป็น Paramedic"
                            className="ed-input w-full pl-5 pr-14 py-4 rounded-full text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleAiRecommendation()}
                          />
                          <button
                            onClick={handleAiRecommendation}
                            disabled={isAiLoading || !aiQuery.trim()}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full btn-primary flex items-center justify-center disabled:opacity-40"
                            aria-label="Analyze"
                          >
                            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />}
                          </button>
                        </div>

                        {aiResponse && (
                          <div className="mt-6 pt-6 border-t border-[var(--rule)] animate-fade-in-up">
                            <div className="kicker-accent mb-3">AI Analysis</div>
                            <div className="text-sm md:text-base leading-relaxed text-[var(--text-primary)]">{aiResponse}</div>
                          </div>
                        )}
                        {aiError && <div className="text-rose-500 text-sm">{aiError}</div>}
                      </div>
                    )}
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[var(--accent-glow)] blur-3xl pointer-events-none opacity-70" />
                </article>

                {/* Verification — dark ink card */}
                <article
                  id="verification"
                  className="lg:col-span-5 ed-card-feature relative overflow-hidden p-8 md:p-12 flex flex-col min-h-[480px] md:min-h-[560px]"
                  style={{ background: 'var(--surface-ink)', color: 'var(--bg-primary)' }}
                >
                  <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />

                  <div className="relative flex items-start justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" strokeWidth={1.6} />
                      </div>
                      <div>
                        <div className="kicker-accent" style={{ color: 'var(--accent)' }}>Feature № 02</div>
                        <div className="text-[13px] text-white/60">Certificate Verify</div>
                      </div>
                    </div>
                    <div className="text-xs text-white/40 font-mono">/verify</div>
                  </div>

                  <div className="relative flex-grow flex flex-col justify-center">
                    <h3 className="display-md text-white mb-3">
                      ตรวจสอบวุฒิบัตร<br />
                      <span className="serif-italic text-[var(--accent)]">อย่างเป็นทางการ</span>
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
                      กรอกรหัสวุฒิบัตรเพื่อยืนยันสถานะและรายละเอียดผู้ถือใบรับรอง
                    </p>

                    {isLoading ? (
                      <div className="w-full"><SearchSkeleton /></div>
                    ) : (
                      <form onSubmit={handleSearchCert} className="w-full">
                        <div className="relative">
                          <Search className="w-4 h-4 absolute left-5 top-1/2 -translate-y-1/2 text-white/40" strokeWidth={1.6} />
                          <input
                            type="text"
                            value={searchCert}
                            onChange={(e) => setSearchCert(e.target.value)}
                            placeholder="NIEM-2026-001"
                            className="w-full pl-12 pr-5 py-4 rounded-full bg-white/5 text-white placeholder-white/30 outline-none border border-white/10 focus:border-[var(--accent)]/60 transition text-sm font-mono tracking-tight"
                          />
                        </div>
                        <button
                          type="submit"
                          className="mt-3 w-full py-4 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] font-medium text-sm tracking-tight hover:bg-[var(--accent-bright)] transition"
                        >
                          ค้นหาวุฒิบัตร
                        </button>
                      </form>
                    )}

                    {searchResult && !isLoading && (
                      <div className="relative mt-6 pt-6 border-t border-white/10 animate-fade-in-up">
                        {searchResult.error ? (
                          <div className="flex items-center gap-2 text-rose-400 text-sm">
                            <AlertCircle className="w-4 h-4" strokeWidth={1.8} /> {searchResult.error}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="kicker-accent" style={{ color: 'var(--accent)' }}>สถานะ — {searchResult.status}</span>
                            </div>
                            <div className="text-xl font-medium text-white tracking-tight">{searchResult.name}</div>
                            <div className="text-sm text-white/60">{searchResult.course}</div>
                            <div className="text-xs text-white/40 font-mono pt-2">Issued {searchResult.date}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Big watermark */}
                  <div className="absolute right-0 bottom-0 text-[120px] md:text-[160px] leading-none font-medium tracking-tight select-none pointer-events-none text-white opacity-[0.04]">
                    CERT
                  </div>
                </article>
              </div>
            </section>

            {/* ——————— STATS + NEWS ——————— */}
            <section
              ref={statsReveal.ref}
              className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-24"
            >
              <div className="flex items-baseline justify-between mb-10 md:mb-14">
                <div>
                  <div className="kicker mb-3">02 — Live from the Center</div>
                  <h2 className="display-lg text-[var(--text-primary)]">ตัวเลขและเรื่องราว</h2>
                </div>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 transition-all duration-700 ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                {/* Stat 1 */}
                <div className="md:col-span-4">
                  {isLoading ? <StatsSkeleton /> : (
                    <div className="ed-card p-8 md:p-10 h-full flex flex-col justify-between min-h-[280px]">
                      <div className="flex items-start justify-between mb-8">
                        <div className="kicker">Staff Active</div>
                        <Users className="w-5 h-5 text-[var(--text-tertiary)]" strokeWidth={1.4} />
                      </div>
                      <div>
                        <div className="text-6xl md:text-7xl font-medium tracking-[-0.04em] text-[var(--text-primary)]">
                          {stats.staffCount > 0 ? stats.staffCount.toLocaleString() : '—'}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-[var(--text-secondary)]">เจ้าหน้าที่ทีมรุก</div>
                          {stats.staffGrowth > 0 && (
                            <div className="flex items-center gap-1 text-xs accent-text font-medium">
                              <TrendingUp className="w-3 h-3" strokeWidth={2} /> +{stats.staffGrowth}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stat 2 */}
                <div className="md:col-span-4">
                  {isLoading ? <StatsSkeleton /> : (
                    <div className="ed-card p-8 md:p-10 h-full flex flex-col justify-between min-h-[280px]" style={{ background: 'var(--accent)', color: 'var(--accent-ink)', borderColor: 'var(--accent)' }}>
                      <div className="flex items-start justify-between mb-8">
                        <div className="text-[0.7rem] font-semibold tracking-[0.16em] uppercase text-[var(--accent-ink)]/70">Courses Certified</div>
                        <GraduationCap className="w-5 h-5 opacity-60" strokeWidth={1.4} />
                      </div>
                      <div>
                        <div className="text-6xl md:text-7xl font-medium tracking-[-0.04em]">
                          {stats.courseCount > 0 ? stats.courseCount : '—'}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm opacity-80">หลักสูตรรับรอง</div>
                          <div className="flex items-center gap-1 text-xs font-medium">
                            <Award className="w-3 h-3" strokeWidth={2} /> Certified
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Latest news */}
                <div className="md:col-span-4">
                  {isLoading ? <NewsSkeleton /> : (
                    dbNews[0] ? (
                      <Link href={`/blog/${dbNews[0].slug}`} className="ed-card hover-lift block p-8 md:p-10 h-full min-h-[280px] relative overflow-hidden">
                        <div className="flex items-start justify-between mb-8">
                          <div className="kicker">Latest Article</div>
                          <ArrowUpRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent-deep)] transition-colors" strokeWidth={1.4} />
                        </div>
                        <div className="kicker-accent mb-3">{dbNews[0].category}</div>
                        <h3 className="display-md text-[var(--text-primary)] leading-tight line-clamp-3">
                          {dbNews[0].title}
                        </h3>
                        <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--accent-ink)]">
                          <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
                        </div>
                      </Link>
                    ) : (
                      <div className="ed-card p-8 md:p-10 h-full min-h-[280px] flex flex-col justify-center">
                        <Plus className="w-8 h-8 text-[var(--text-tertiary)] mb-4" strokeWidth={1.2} />
                        <div className="text-sm text-[var(--text-secondary)]">ยังไม่มีบทความใหม่</div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Secondary news row */}
              {dbNews.length > 1 && !isLoading && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {dbNews.slice(1, 3).map((news) => (
                    <Link key={news.id} href={`/blog/${news.slug}`} className="group flex items-start gap-5 py-5 border-t border-[var(--rule)] hover:border-[var(--rule-strong)] transition-colors">
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-tertiary)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-ink)] transition-colors">
                        <ArrowUpRight className="w-5 h-5" strokeWidth={1.6} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="kicker-accent mb-1">{news.category}</div>
                        <div className="text-base font-medium text-[var(--text-primary)] tracking-tight leading-snug line-clamp-2">
                          {news.title}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* ——————— TRUST STRIP ——————— */}
            <section className="border-y border-[var(--rule)] bg-[var(--bg-tertiary)]/60 overflow-hidden">
              <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-8 md:py-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="kicker">Accredited by</div>
                  <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-[var(--text-primary)]">
                    <span className="text-sm md:text-base font-medium tracking-tight">สถาบันการแพทย์ฉุกเฉินแห่งชาติ</span>
                    <span className="text-[var(--rule-strong)]">·</span>
                    <span className="text-sm md:text-base font-medium tracking-tight">กระทรวงสาธารณสุข</span>
                    <span className="text-[var(--rule-strong)]">·</span>
                    <span className="text-sm md:text-base font-medium tracking-tight">ISO 9001 : 2015</span>
                    <span className="text-[var(--rule-strong)]">·</span>
                    <span className="text-sm md:text-base font-medium tracking-tight serif-italic accent-text">RAL 1016</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ——————— CTA ——————— */}
            <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-24 md:py-32">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7">
                  <div className="kicker mb-5">03 — Next Step</div>
                  <h2 className="display-hero text-[var(--text-primary)]">
                    พร้อมก้าว<br />
                    <span className="serif-italic accent-text">สู่บทถัดไป</span>?
                  </h2>
                </div>
                <div className="md:col-span-5 md:border-l md:border-[var(--rule)] md:pl-8 flex flex-col justify-end">
                  <p className="text-base text-[var(--text-secondary)] leading-relaxed mb-8">
                    เปิดรับสมัครหลักสูตรรอบ Q2 / 2026 จำนวนจำกัด สมัครเลยวันนี้เพื่อรับสิทธิ์ทุนสนับสนุน
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/" className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
                      สมัครเรียน <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
                    </Link>
                    <Link href="/blog" className="btn-ghost px-6 py-3 text-sm">
                      อ่านบทความ
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab !== 'home' && (
          <div className="max-w-7xl mx-auto px-6 py-40 text-center animate-fade-in-up">
            <div className="ed-card p-16 md:p-24 inline-flex flex-col items-center">
              <Loader2 className="w-6 h-6 text-[var(--text-secondary)] animate-spin mb-6" strokeWidth={1.5} />
              <div className="kicker mb-3">Section</div>
              <h2 className="display-md text-[var(--text-primary)] mb-3">{activeTab}</h2>
              <p className="text-[var(--text-secondary)] mb-8">กำลังโหลดข้อมูลส่วนนี้</p>
              <button onClick={() => setActiveTab('home')} className="btn-ghost px-5 py-2.5 text-sm">
                ← กลับหน้าแรก
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
