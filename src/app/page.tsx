'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  Search, Users, Award, Building2, TrendingUp, ChevronRight, Activity, Sparkles, Loader2, Link as LinkIcon
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface CourseItem { id: number; name: string; category: string; status: string; }
interface SearchResult { name?: string; course?: string; date?: string; status?: string; error?: string; }

export default function App() {
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

  useEffect(() => {
    const fetchHomeData = async () => {
      const { data: courses } = await supabase.from('courses').select('*').limit(6);
      if (courses) setCoursesList(courses);

      const { data: news } = await supabase.from('blogs').select('*').eq('status', 'Published').order('created_at', { ascending: false }).limit(2);
      if (news) setDbNews(news);

      const { data: hero } = await supabase.from('settings').select('*').eq('key', 'hero').single();
      if (hero && hero.value) setHeroData(hero.value);
    };

    fetchHomeData();
  }, []);

  const handleSearchCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCert === 'NIEM-2026-001') {
      setSearchResult({ name: 'นาย เต้ (Paramedic)', course: 'Technical Rescue Instructor', date: '12 เม.ย. 2026', status: 'Valid' });
    } else {
      setSearchResult({ error: 'ไม่พบข้อมูล' });
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
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "แนะนำให้ลองตรวจสอบข้อมูลเพิ่มเติมที่หน้าหลักสูตร");
    } catch {
      setAiError('เกิดข้อผิดพลาดในการประมวลผล');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="pt-12 w-full">
        {activeTab === 'home' && (
          <div className="space-y-4">
            
            {/* Hero Banner 1 - High Contrast Apple Style */}
            <section className="bg-black text-[#f5f5f7] pt-32 md:pt-40 pb-20 md:pb-32 text-center animate-fade-in-up flex flex-col items-center">
               <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
                 <h2 className="text-lg md:text-2xl font-semibold mb-3 tracking-tight opacity-90">{heroData.title}</h2>
                 <h1 className="text-[2.5rem] sm:text-6xl md:text-8xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.05]">
                    ก้าวสู่ความเป็นเลิศ<br className="hidden sm:block"/>ทางการแพทย์
                 </h1>
                 <p className="text-lg md:text-2xl font-medium text-[#86868b] max-w-2xl mx-auto mb-8 md:mb-12 leading-snug px-2">
                    {heroData.subtitle}
                 </p>
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                    <button onClick={() => setActiveTab('courses')} className="w-full sm:w-auto bg-[#f5f5f7] text-black px-8 py-3.5 md:py-4 rounded-full font-medium text-base md:text-lg hover:bg-white transition-colors">
                      {heroData.button_text}
                    </button>
                    <button onClick={() => setActiveTab('cert')} className="w-full sm:w-auto mt-2 sm:mt-0 text-[#2997ff] hover:text-[#5cade6] font-medium text-base md:text-lg flex items-center justify-center transition-colors">
                      {heroData.button2_text} <ChevronRight className="w-5 h-5 ml-1"/>
                    </button>
                 </div>
               </div>
               
               {/* Minimalist Graphic Element */}
               <div className="mt-16 md:mt-24 w-11/12 md:w-4/5 lg:w-3/4 max-w-5xl h-[250px] sm:h-[300px] md:h-[400px] border-t border-l border-r border-[#1c1c1e] rounded-t-[2rem] md:rounded-t-[3rem] bg-gradient-to-b from-[#1c1c1e] to-black relative flex items-center justify-center overflow-hidden">
                  <Activity className="w-32 h-32 md:w-48 md:h-48 text-[#2997ff] opacity-80" strokeWidth={1} />
               </div>
            </section>

            {/* Content Grid - Feature Cards (Like Apple Product Grid) */}
            <section className="bg-[var(--bg-primary)] py-4 max-w-[1400px] mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                {/* AI Assistant Card */}
                <div className="apple-card p-8 sm:p-10 md:p-14 text-center flex flex-col items-center justify-center animate-scale-in delay-100 min-h-[400px] md:min-h-[500px] bg-white w-full">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4">AI Pathway</h3>
                  <p className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] font-medium mb-8 md:mb-10 px-2">วิเคราะห์เส้นทางอนาคตของคุณด้วย AI</p>
                  
                  <div className="w-full max-w-sm md:max-w-md flex flex-col gap-3 md:gap-4 relative z-10">
                    <input 
                      type="text" 
                      value={aiQuery} 
                      onChange={(e) => setAiQuery(e.target.value)} 
                      placeholder="เป้าหมายของคุณ..." 
                      className="w-full px-5 md:px-6 py-3.5 md:py-4 rounded-full bg-[var(--bg-primary)] border-none text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition text-center text-sm md:text-base" 
                      onKeyDown={(e) => e.key === 'Enter' && handleAiRecommendation()} 
                    />
                    <button onClick={handleAiRecommendation} disabled={isAiLoading || !aiQuery.trim()} className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white w-full py-3.5 md:py-4 rounded-full font-medium transition flex items-center justify-center text-sm md:text-base">
                      {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'เริ่มการวิเคราะห์'}
                    </button>
                  </div>

                  {aiResponse && (
                    <div className="mt-6 md:mt-8 text-left bg-[var(--bg-primary)] p-5 md:p-6 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-md animate-fade-in-up">
                      <div className="text-sm md:text-base font-medium leading-relaxed">{aiResponse}</div>
                    </div>
                  )}
                  {aiError && <div className="mt-3 md:mt-4 text-red-500 text-xs md:text-sm">{aiError}</div>}
                </div>

                {/* Verification Card */}
                <div className="apple-card p-8 sm:p-10 md:p-14 text-center flex flex-col items-center justify-center bg-black text-white animate-scale-in delay-200 min-h-[400px] md:min-h-[500px] w-full relative overflow-hidden">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4">การตรวจสอบ</h3>
                  <p className="text-base sm:text-lg md:text-xl text-[#86868b] font-medium mb-8 md:mb-10 relative z-10 px-2">ยืนยันวุฒิบัตรอย่างเป็นทางการ</p>
                  
                  <form onSubmit={handleSearchCert} className="w-full max-w-sm md:max-w-md relative z-10">
                    <div className="relative">
                      <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-5 top-1/2 -translate-y-1/2 text-[#86868b]" />
                      <input 
                        type="text" 
                        value={searchCert} 
                        onChange={(e) => setSearchCert(e.target.value)} 
                        placeholder="CERTIFICATE ID" 
                        className="w-full pl-12 pr-5 py-3.5 md:py-4 rounded-full bg-[#1c1c1e] text-white placeholder-[#86868b] focus:ring-2 focus:ring-white outline-none transition text-sm font-medium border-none" 
                        required 
                      />
                    </div>
                    <button type="submit" className="mt-3 md:mt-4 bg-white text-black hover:bg-[#e8e8ed] w-full py-3.5 md:py-4 rounded-full font-medium transition text-sm md:text-base">
                      ค้นหา
                    </button>
                  </form>

                  {searchResult && (
                    <div className="mt-6 md:mt-8 text-left bg-[#1c1c1e] p-5 md:p-6 rounded-2xl md:rounded-3xl w-full max-w-sm md:max-w-md animate-fade-in-up relative z-10">
                      {searchResult.error ? (
                        <div className="text-red-400 font-medium text-sm md:text-base">{searchResult.error}</div>
                      ) : (
                        <div className="space-y-2 md:space-y-3">
                           <div className="text-[#86868b] text-[10px] md:text-xs font-semibold uppercase tracking-wider">สถานะ: <span className="text-green-500 ml-1">{searchResult.status}</span></div>
                           <div className="text-lg md:text-xl font-bold leading-none">{searchResult.name}</div>
                           <div className="text-xs md:text-sm text-[#86868b] leading-tight mt-1">{searchResult.course}</div>
                           <div className="text-[10px] md:text-xs text-[#86868b] mt-2 block opacity-70">ออกเมื่อ {searchResult.date}</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Faded Background Word */}
                  <div className="absolute font-bold text-[120px] md:text-[180px] text-white opacity-[0.03] bottom-[-20px] md:bottom-0 right-4 md:right-10 select-none pointer-events-none transform translate-y-1/4">
                    CERT
                  </div>
                </div>

              </div>
            </section>

            {/* Secondary Grid features */}
            <section className="bg-[var(--bg-primary)] py-4 max-w-[1400px] mx-auto px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                
                {/* News card */}
                {dbNews.slice(0,1).map(news => (
                  <div key={news.id} className="apple-card p-8 md:p-10 flex flex-col justify-between min-h-[350px] md:min-h-[400px] bg-white group cursor-pointer animate-scale-in delay-300">
                     <div>
                       <span className="text-[10px] md:text-xs font-semibold text-[var(--accent)] mb-2 md:mb-3 block uppercase tracking-wider">{news.category}</span>
                       <h4 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 leading-tight group-hover:text-[var(--accent)] transition-colors">{news.title}</h4>
                     </div>
                     <Link href={`/blog/${news.slug}`} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] flex items-center font-medium mt-8 md:mt-10 transition-colors text-sm md:text-base">
                       อ่านต่อ <ChevronRight className="w-4 h-4 ml-1" />
                     </Link>
                  </div>
                ))}

                {/* Stat block 1 */}
                <div className="apple-card p-8 md:p-10 flex flex-col justify-center items-center text-center min-h-[350px] md:min-h-[400px] bg-white animate-scale-in delay-400">
                   <Users className="w-10 h-10 md:w-12 md:h-12 text-[var(--text-primary)] mb-4 md:mb-6" strokeWidth={1.5} />
                   <div className="text-5xl sm:text-6xl font-bold tracking-tight">4.5K</div>
                   <div className="text-[var(--text-secondary)] font-medium mt-1 md:mt-2 text-sm md:text-base">เจ้าหน้าที่ทีมรุก</div>
                </div>

                {/* Stat block 2 */}
                <div className="apple-card p-8 md:p-10 flex flex-col justify-center items-center text-center min-h-[350px] md:min-h-[400px] bg-[#f5f5f7] border border-[#e5e5ea] animate-scale-in delay-500">
                   <Award className="w-10 h-10 md:w-12 md:h-12 text-[var(--text-primary)] mb-4 md:mb-6" strokeWidth={1.5} />
                   <div className="text-5xl sm:text-6xl font-bold tracking-tight">86</div>
                   <div className="text-[var(--text-secondary)] font-medium mt-1 md:mt-2 text-sm md:text-base">หลักสูตรรับรอง</div>
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
