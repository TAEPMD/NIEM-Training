'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { CardSkeleton, HeroSkeleton, NewsSkeleton, StatsSkeleton, SearchSkeleton } from '@/components/Skeleton';
import { 
  Search, Users, Award, Building2, TrendingUp, ChevronRight, Activity, Sparkles, Loader2, 
  ArrowRight, Zap, Shield, GraduationCap, HeartPulse, Stethoscope, Ambulance, AlertCircle
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface CourseItem { id: number; name: string; category: string; status: string; }
interface SearchResult { name?: string; course?: string; date?: string; status?: string; error?: string; }

// 3D Tilt Card Component
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');
  const [shinePosition, setShinePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setShinePosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  }, []);

  return (
    <div
      ref={cardRef}
      className={`card-tilt ${className}`}
      style={{ 
        transform: transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${shinePosition.x}% ${shinePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`
        }}
      />
      {children}
    </div>
  );
}

// Scroll Reveal Hook
function useScrollReveal(threshold = 0.1) {
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export default function App() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [searchCert, setSearchCert] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  // AI Features State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const [coursesList, setCoursesList] = useState<CourseItem[]>([]);
  const [dbNews, setDbNews] = useState<any[]>([]);
  
  const [heroData, setHeroData] = useState<any>({ 
    title: 'ศูนย์ฝึกอบรม', 
    subtitle: 'ยกระดับมาตรฐานการแพทย์ฉุกเฉินนอกโรงพยาบาล สู่ความเป็นเลิศทางวิชาการและทักษะการกู้ชีพสากล', 
    button_text: 'ดูเพิ่มเติม',
    button2_text: 'ระบบตรวจสอบ'
  });

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  
  // Scroll reveal refs
  const heroReveal = useScrollReveal(0.1);
  const featuresReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const { data: courses } = await supabase.from('courses').select('*').limit(6);
        if (courses) setCoursesList(courses);

        const { data: news } = await supabase.from('blogs').select('*').eq('status', 'Published').order('created_at', { ascending: false }).limit(2);
        if (news) setDbNews(news);

        const { data: hero } = await supabase.from('settings').select('*').eq('key', 'hero').single();
        if (hero && hero.value) setHeroData(hero.value);
        
        showToast('ยินดีต้อนรับสู่ NIEM Training', 'info');
      } catch (error) {
        showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
      } finally {
        // Simulate loading for demo purposes - remove in production if data loads instantly
        setTimeout(() => setIsLoading(false), 800);
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
    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const prompt = `คุณคือผู้เชี่ยวชาญด้านการแพทย์ฉุกเฉิน (EMS) และกู้ภัย ของสถาบันการแพทย์ฉุกเฉิน... แนะนำหลักสูตรสั้นๆ สำหรับคนที่มีเป้าหมาย: "${aiQuery}"`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "แนะนำให้ลองตรวจสอบข้อมูลเพิ่มเติมที่หน้าหลักสูตร";
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

      <main className="pt-12 w-full overflow-x-hidden">
        {activeTab === 'home' && (
          <div className="space-y-4">
            
            {/* Hero Section - New Design with Gradient & Parallax */}
            <section 
              ref={heroReveal.ref}
              className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden"
              style={{
                background: 'var(--gradient-hero)'
              }}
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent)]/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] animate-pulse delay-1000" />
                <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] animate-float" />
              </div>

              {/* Hero Content */}
              <div className={`relative z-10 max-w-5xl mx-auto transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in-up">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm font-medium text-white/90">พร้อมด้วย AI วิเคราะห์เส้นทางอาชีพ</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white">
                  <span className="block">ก้าวสู่ความเป็น</span>
                  <span className="gradient-text">เลิศทางการแพทย์</span>
                </h1>
                
                <p className="text-lg md:text-xl lg:text-2xl font-medium text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
                  {heroData.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 stagger-children">
                  <button 
                    onClick={() => setActiveTab('courses')} 
                    className="group btn-gradient text-white px-8 py-4 rounded-full font-semibold text-base md:text-lg flex items-center gap-2 animate-glow-pulse"
                  >
                    {heroData.button_text}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setActiveTab('cert')} 
                    className="group px-8 py-4 rounded-full font-semibold text-base md:text-lg text-white border border-white/30 hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    {heroData.button2_text}
                  </button>
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute bottom-20 left-10 hidden lg:block animate-float">
                <HeartPulse className="w-12 h-12 text-[var(--accent)]/40" />
              </div>
              <div className="absolute top-1/3 right-10 hidden lg:block animate-float delay-500">
                <Stethoscope className="w-10 h-10 text-blue-400/40" />
              </div>
              <div className="absolute bottom-1/3 left-20 hidden lg:block animate-float delay-1000">
                <Ambulance className="w-10 h-10 text-purple-400/30" />
              </div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
                <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                  <div className="w-1 h-2 bg-white/60 rounded-full" />
                </div>
              </div>
            </section>

            {/* Main Features Grid - 3D Tilt Cards */}
            <section 
              ref={featuresReveal.ref}
              className="bg-[var(--bg-primary)] py-8 max-w-[1400px] mx-auto px-4 md:px-6"
            >
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 transition-all duration-700 ${featuresReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                
                {/* AI Assistant Card - With 3D Tilt */}
                <TiltCard className="group">
                  <div className="apple-card gradient-card-1 p-8 sm:p-10 md:p-14 text-center flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] w-full relative overflow-hidden hover-lift">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-[var(--accent)]/20 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4">
                      <span className="gradient-text">AI</span> Pathway
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] font-medium mb-8 md:mb-10 px-2">วิเคราะห์เส้นทางอนาคตของคุณด้วย AI</p>
                    
                    {isLoading ? (
                      <SearchSkeleton />
                    ) : (
                      <div className="w-full max-w-sm md:max-w-md flex flex-col gap-3 md:gap-4 relative z-10">
                        <div className="relative">
                          <input 
                            type="text" 
                            value={aiQuery} 
                            onChange={(e) => setAiQuery(e.target.value)} 
                            placeholder="เช่น: ต้องการเป็น Paramedic..." 
                            className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-full bg-[var(--bg-primary)] border-2 border-transparent focus:border-[var(--accent)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none transition text-center text-sm md:text-base shadow-inner" 
                            onKeyDown={(e) => e.key === 'Enter' && handleAiRecommendation()} 
                          />
                          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                        </div>
                        <button 
                          onClick={handleAiRecommendation} 
                          disabled={isAiLoading || !aiQuery.trim()} 
                          className="btn-gradient text-white w-full py-3.5 md:py-4 rounded-full font-medium transition flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> เริ่มการวิเคราะห์</>}
                        </button>
                      </div>
                    )}

                    {aiResponse && !isLoading && (
                      <div className="mt-6 md:mt-8 text-left bg-white dark:bg-[#0a0a0a] p-5 md:p-6 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-md animate-fade-in-up shadow-lg border border-[var(--apple-border)]">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                          <span className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider">AI Analysis</span>
                        </div>
                        <div className="text-sm md:text-base font-medium leading-relaxed text-[var(--text-primary)]">{aiResponse}</div>
                      </div>
                    )}
                    {aiError && !isLoading && <div className="mt-3 md:mt-4 text-rose-500 text-xs md:text-sm font-medium">{aiError}</div>}
                  </div>
                </TiltCard>

                {/* Verification Card - With 3D Tilt */}
                <TiltCard className="group">
                  <div className="apple-card p-8 sm:p-10 md:p-14 text-center flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] w-full relative overflow-hidden hover-lift" style={{ background: 'var(--gradient-dark-card)' }}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                      }} />
                    </div>
                    
                    {/* Icon */}
                    <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4 text-white">
                      การ<span className="text-[var(--accent)]">ตรวจสอบ</span>
                    </h3>
                    <p className="relative z-10 text-base sm:text-lg md:text-xl text-white/60 font-medium mb-8 md:mb-10 px-2">ยืนยันวุฒิบัตรอย่างเป็นทางการ</p>
                    
                    {isLoading ? (
                      <div className="w-full max-w-sm md:max-w-md"><SearchSkeleton /></div>
                    ) : (
                      <form onSubmit={handleSearchCert} className="w-full max-w-sm md:max-w-md relative z-10">
                        <div className="relative group/input">
                          <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/input:text-[var(--accent)] transition-colors" />
                          <input 
                            type="text" 
                            value={searchCert} 
                            onChange={(e) => setSearchCert(e.target.value)} 
                            placeholder="CERTIFICATE ID (ลอง: NIEM-2026-001)" 
                            className="w-full pl-12 pr-5 py-3.5 md:py-4 rounded-full bg-white/10 text-white placeholder-white/40 focus:bg-white/20 outline-none transition text-sm font-medium border border-white/10 focus:border-[var(--accent)]/50 backdrop-blur-sm" 
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="mt-3 md:mt-4 bg-white text-black hover:bg-[var(--accent)] hover:text-white w-full py-3.5 md:py-4 rounded-full font-medium transition-all duration-300 text-sm md:text-base flex items-center justify-center gap-2"
                        >
                          <Search className="w-4 h-4" /> ค้นหา
                        </button>
                      </form>
                    )}

                    {searchResult && !isLoading && (
                      <div className="mt-6 md:mt-8 text-left bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-md animate-fade-in-up relative z-10 border border-white/10">
                        {searchResult.error ? (
                          <div className="flex items-center gap-2 text-rose-400 font-medium text-sm md:text-base">
                            <AlertCircle className="w-5 h-5" /> {searchResult.error}
                          </div>
                        ) : (
                          <div className="space-y-3">
                             <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-500" />
                               <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">สถานะ: <span className="text-emerald-400 ml-1">{searchResult.status}</span></span>
                             </div>
                             <div className="text-lg md:text-xl font-bold text-white leading-none">{searchResult.name}</div>
                             <div className="text-xs md:text-sm text-white/50 leading-tight">{searchResult.course}</div>
                             <div className="text-[10px] md:text-xs text-white/40 pt-2 border-t border-white/10">ออกเมื่อ {searchResult.date}</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Faded Background Word */}
                    <div className="absolute font-bold text-[100px] md:text-[160px] text-white opacity-[0.03] bottom-[-20px] md:bottom-0 right-4 md:right-10 select-none pointer-events-none transform translate-y-1/4">
                      CERT
                    </div>
                  </div>
                </TiltCard>

              </div>
            </section>

            {/* Secondary Grid Features - Scroll Reveal */}
            <section 
              ref={statsReveal.ref}
              className="bg-[var(--bg-primary)] py-4 max-w-[1400px] mx-auto px-4 md:px-6"
            >
              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 transition-all duration-700 delay-200 ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                
                {/* News card */}
                {isLoading ? (
                  <NewsSkeleton />
                ) : (
                  dbNews.slice(0,1).map(news => (
                    <TiltCard key={news.id} className="group cursor-pointer">
                      <div className="apple-card gradient-card-2 p-8 md:p-10 flex flex-col justify-between min-h-[350px] md:min-h-[400px] hover-lift">
                         <div>
                           <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-[10px] md:text-xs font-semibold mb-3 uppercase tracking-wider">{news.category}</span>
                           <h4 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors">{news.title}</h4>
                         </div>
                         <Link href={`/blog/${news.slug}`} className="group/link text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center font-medium mt-8 md:mt-10 transition-colors text-sm md:text-base">
                           อ่านต่อ <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                         </Link>
                      </div>
                    </TiltCard>
                  ))
                )}

                {/* Stat block 1 */}
                {isLoading ? (
                  <StatsSkeleton />
                ) : (
                  <TiltCard className="group">
                    <div className="apple-card gradient-card-3 p-8 md:p-10 flex flex-col justify-center items-center text-center min-h-[350px] md:min-h-[400px] hover-lift hover-glow">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                         <Users className="w-7 h-7 text-white" />
                       </div>
                       <div className="text-5xl sm:text-6xl font-bold tracking-tight gradient-text">4.5K</div>
                       <div className="text-[var(--text-secondary)] font-medium mt-2 text-sm md:text-base">เจ้าหน้าที่ทีมรุก</div>
                       <div className="mt-4 flex items-center gap-1 text-xs text-emerald-500 font-medium">
                         <TrendingUp className="w-3 h-3" /> +12% จากปีที่แล้ว
                       </div>
                    </div>
                  </TiltCard>
                )}

                {/* Stat block 2 */}
                {isLoading ? (
                  <StatsSkeleton />
                ) : (
                  <TiltCard className="group">
                    <div className="apple-card p-8 md:p-10 flex flex-col justify-center items-center text-center min-h-[350px] md:min-h-[400px] hover-lift border border-[var(--apple-border)]" style={{ background: 'var(--gradient-card-1)' }}>
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[var(--accent)]/20">
                         <GraduationCap className="w-7 h-7 text-white" />
                       </div>
                       <div className="text-5xl sm:text-6xl font-bold tracking-tight text-[var(--text-primary)]">86</div>
                       <div className="text-[var(--text-secondary)] font-medium mt-2 text-sm md:text-base">หลักสูตรรับรอง</div>
                       <div className="mt-4 flex items-center gap-1 text-xs text-emerald-500 font-medium">
                         <Award className="w-3 h-3" /> มาตรฐานสากล
                       </div>
                    </div>
                  </TiltCard>
                )}

              </div>
            </section>

            {/* Trust Section - New Addition */}
            <section className="bg-[var(--bg-primary)] py-12 max-w-[1400px] mx-auto px-4 md:px-6">
              <div className="apple-card p-8 md:p-12 text-center" style={{ background: 'var(--gradient-dark-card)' }}>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">ได้รับการรับรองโดย</h3>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
                  <div className="flex items-center gap-2 text-white/80">
                    <Building2 className="w-8 h-8" />
                    <span className="font-semibold">สถาบันการแพทย์ฉุกเฉินแห่งชาติ</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Shield className="w-8 h-8" />
                    <span className="font-semibold">มาตรฐานสากล ISO</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Award className="w-8 h-8" />
                    <span className="font-semibold">กระทรวงสาธารณสุข</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {activeTab !== 'home' && (
          <div className="max-w-7xl mx-auto px-6 py-40 text-center animate-fade-in-up">
             <div className="bg-white rounded-3xl p-20 shadow-sm border border-[var(--apple-border)] inline-flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-[var(--text-secondary)] animate-spin mb-6" />
                <h2 className="text-2xl font-bold tracking-tight mb-2">กำลังโหลด {activeTab}...</h2>
                <p className="text-[var(--text-secondary)] font-medium mb-8">โปรดรอสักครู่เพื่อตรวจสอบข้อมูล</p>
                <button onClick={() => setActiveTab('home')} className="bg-[var(--bg-primary)] px-6 py-2 rounded-full font-medium hover:bg-[#e5e5ea] transition">
                  กลับหน้าแรก
                </button>
             </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
