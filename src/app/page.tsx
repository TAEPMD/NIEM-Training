'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  BookOpen, Calendar, Search, Activity, Users, 
  FileText, ChevronRight, ShieldAlert, Award, 
  ArrowRight, Sparkles, Loader2, Globe, Link as LinkIcon 
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

// Define types
interface NewsItem { id: number; title: string; date: string; type: string; }
interface CourseItem { id: number; name: string; category: string; status: string; }
interface ExternalApp { id: number; name: string; desc: string; icon: React.ReactNode; }
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
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  // Real DB Data for News and Systems
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [dbSystems, setDbSystems] = useState<any[]>([]);
  const [heroData, setHeroData] = useState<any>({ 
    title: 'ศูนย์ฝึกอบรม NIEM Thailand', 
    subtitle: 'ยกระดับมาตรฐานการแพทย์ฉุกเฉินนอกโรงพยาบาล สู่ความเป็นเลิศทางวิชาการและทักษะการกู้ชีพสากล', 
    button_text: 'ดูตารางอบรมปี 2026' 
  });

  // Load production data from Supabase
  useEffect(() => {
    const fetchHomeData = async () => {
      setLoadingCourses(true);
      
      // Fetch Courses
      const { data: courses } = await supabase.from('courses').select('*').limit(6);
      if (courses) setCoursesList(courses);

      // Fetch News (Blogs)
      const { data: news } = await supabase.from('blogs').select('*').eq('status', 'Published').order('created_at', { ascending: false }).limit(3);
      if (news) setDbNews(news);

      // Fetch Systems
      const { data: systems } = await supabase.from('systems').select('*').order('id', { ascending: true });
      if (systems) setDbSystems(systems);

      // Fetch Hero settings
      const { data: hero } = await supabase.from('settings').select('*').eq('key', 'hero').single();
      if (hero && hero.value) setHeroData(hero.value);

      setLoadingCourses(false);
    };

    fetchHomeData();
  }, []);

  const handleSearchCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCert === 'NIEM-2026-001') {
      setSearchResult({ name: 'นาย เต้ (Paramedic)', course: 'Technical Rescue Instructor', date: '12 เม.ย. 2026', status: 'Valid' });
    } else {
      setSearchResult({ error: 'ไม่พบข้อมูลใบประกาศนียบัตรหมายเลขนี้' });
    }
  };

  const handleAiRecommendation = async () => {
    if (!aiQuery.trim()) return;
    setIsAiLoading(true); setAiError(''); setAiResponse('');
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 
    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const systemPrompt = "คุณคือผู้เชี่ยวชาญด้านการแพทย์ฉุกเฉิน (EMS) และกู้ภัย ของสถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ. หรือ NIEM) หน้าที่ของคุณคือแนะนำเส้นทางการเรียนหรือหลักสูตรการฝึกอบรมที่เหมาะสมให้กับผู้ใช้ โดยอ้างอิงจากประสบการณ์และความสนใจของพวกเขา ให้คำแนะนำที่กระชับ อ่านง่าย เป็นมืออาชีพ และให้กำลังใจ (ตอบเป็นภาษาไทย)";
    const prompt = `ประวัติ/ความสนใจของผู้ใช้: "${aiQuery}"`;

    try {
      if (!apiKey) throw new Error('Missing API Key');
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: prompt }] } })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ไม่สามารถให้คำแนะนำได้ในขณะนี้");
    } catch (err) {
      setAiError('เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Helper to get Icon
  const getSystemIcon = (name: string) => {
    switch(name) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'Globe': return <Globe className="w-5 h-5 text-green-500" />;
      case 'FileText': return <FileText className="w-5 h-5 text-blue-500" />;
      default: return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section - Compact Banner */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 rounded-[2rem] shadow-2xl shadow-blue-900/10 overflow-hidden relative">
              <div className="bg-blue-600/5 absolute inset-0 backdrop-blur-3xl"></div>
              <div className="px-10 py-10 md:py-14 relative z-10 text-white max-w-4xl">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black mb-6 border border-blue-500/20 uppercase tracking-widest">
                  <Activity className="w-3 h-3 mr-2 text-blue-400" /> Training & Excellence
                </div>
                <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight text-white">
                  {heroData.title}
                </h1>
                <p className="text-blue-100/60 text-sm md:text-base mb-8 leading-relaxed max-w-2xl font-medium">
                  {heroData.subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('courses')} className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition transform hover:-translate-y-0.5 active:scale-95 flex items-center">
                    {heroData.button_text} <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* News Section */}
              <div className="md:col-span-2 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
                    <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
                    ข่าวสารและประกาศ
                  </h2>
                  <Link href="/blog" className="px-4 py-2 hover:bg-slate-50 text-slate-400 text-xs font-bold rounded-xl transition uppercase tracking-widest">ดูทั้งหมด</Link>
                </div>
                <div className="space-y-6">
                  {dbNews.length > 0 ? dbNews.map((news) => (
                    <Link href={`/blog/${news.slug}`} key={news.id} className="group flex items-start justify-between cursor-pointer p-2 rounded-2xl hover:bg-slate-50/50 transition duration-300">
                      <div className="flex gap-6">
                        <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-blue-50 rounded-2xl text-blue-600 min-w-[64px]">
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {new Date(news.created_at).toLocaleString('default', { month: 'short' }).toUpperCase()}
                          </span>
                          <span className="text-xl font-black">{new Date(news.created_at).getDate()}</span>
                        </div>
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-black rounded mb-2 uppercase tracking-widest">{news.category}</span>
                          <h3 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-blue-600 transition">{news.title}</h3>
                          <p className="text-xs text-slate-400 mt-2 font-medium flex items-center opacity-60">
                            <Users className="w-3 h-3 mr-1" /> {news.author} • <Calendar className="w-3 h-3 mx-1" /> 2026
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-blue-600 transform group-hover:translate-x-1 transition" />
                    </Link>
                  )) : (
                    <div className="py-10 text-center text-slate-400 font-bold italic">ยังไม่มีข่าวสารใหม่</div>
                  )}
                </div>
              </div>

              {/* Information Systems Section */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center tracking-tight">
                  <LinkIcon className="w-5 h-5 mr-3 text-blue-600" /> ระบบสารสนเทศ
                </h2>
                <div className="space-y-4">
                  {dbSystems.length > 0 ? dbSystems.map((app) => (
                    <a href={app.url} target="_blank" rel="noopener noreferrer" key={app.id} className="flex items-center p-5 border border-slate-50 rounded-3xl hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition cursor-pointer bg-slate-50/40 hover:bg-white active:scale-95 transform duration-300">
                      <div className="bg-white p-3 rounded-2xl shadow-sm mr-5 text-blue-600 group-hover:scale-110 transition">{getSystemIcon(app.icon_name)}</div>
                      <div>
                        <h4 className="font-bold text-slate-700 text-sm">{app.name}</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">{app.description}</p>
                      </div>
                    </a>
                  )) : (
                    <div className="py-10 text-center text-slate-400 font-bold italic">ไม่พบระบบสารสนเทศ</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 min-h-[60vh] animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2rem] p-10 border border-indigo-100 shadow-2xl shadow-blue-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Sparkles className="w-64 h-64 text-white" /></div>
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center mb-3 text-blue-200"><Sparkles className="w-6 h-6 mr-3 font-bold" /><h3 className="text-xl font-black uppercase tracking-tight">AI Pathway Assistant</h3></div>
                <p className="text-blue-100/80 text-lg mb-8 leading-relaxed font-medium italic">"ค้นหาหลักสูตรที่ช่วยเติมเต็มศักยภาพของคุณด้วยระบบ AI วิเคราะห์เส้นทางการเรียนรู้"</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="เล่าประสบการณ์หรือทักษะที่อยากฝึกฝน..." className="flex-grow px-6 py-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-4 focus:ring-white/10 outline-none shadow-sm transition backdrop-blur-md" onKeyDown={(e) => e.key === 'Enter' && handleAiRecommendation()} />
                  <button onClick={handleAiRecommendation} disabled={isAiLoading || !aiQuery.trim()} className="bg-white hover:bg-blue-50 disabled:bg-white/50 text-blue-900 font-black px-10 rounded-2xl transition shadow-lg flex items-center justify-center h-[64px]">{isAiLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'วิเคราะห์ทางเลือก'}</button>
                </div>
                {aiResponse && <div className="mt-8 p-8 bg-black/10 backdrop-blur-md rounded-2xl border border-white/10 text-white leading-relaxed font-medium text-sm shadow-inner">{aiResponse}</div>}
              </div>
            </div>

            <h2 className="text-3xl font-black text-slate-800 mb-10 flex items-center tracking-tight">
               <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
               ตารางหลักสูตรการอบรม
            </h2>
            
            {loadingCourses ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-[2rem]"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coursesList.map(course => (
                  <div key={course.id} className="bg-white border border-slate-100 rounded-[2.2rem] p-8 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)] transition duration-500 group flex flex-col transform hover:-translate-y-2">
                    <div className="flex justify-between items-start mb-8">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border border-blue-100">{course.category}</span>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl ${course.status === 'เปิดรับสมัคร' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{course.status}</span>
                    </div>
                    <h3 className="font-bold text-xl text-slate-800 mb-8 flex-grow leading-tight group-hover:text-blue-600 transition duration-300">{course.name}</h3>
                    <button className="w-full py-5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-500 font-black rounded-[1.5rem] transition-all flex justify-center items-center shadow-inner group-hover:shadow-blue-200">
                      ดูรายละเอียด <ArrowRight className="w-4 h-4 ml-3" />
                    </button>
                  </div>
                ))}
                {coursesList.length === 0 && <div className="md:col-span-3 text-center py-20 text-slate-400 font-bold italic">ไม่พบข้อมูลหลักสูตรในขณะนี้</div>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cert' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-12 min-h-[60vh] flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-blue-500 blur-[60px] opacity-10 rounded-full scale-150"></div>
              <Award className="w-24 h-24 text-blue-600 relative z-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">ตรวจสอบความถูกต้อง</h2>
            <p className="text-slate-400 mb-12 text-center max-w-sm text-sm font-bold uppercase tracking-wider opacity-60">Authentication System</p>
            <form onSubmit={handleSearchCert} className="w-full max-w-md">
              <div className="relative group">
                <input type="text" value={searchCert} onChange={(e) => setSearchCert(e.target.value)} placeholder="CERTIFICATE ID (เช่น NIEM-2026-001)" className="w-full pl-16 pr-6 py-6 rounded-[2rem] bg-slate-50 border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner font-bold text-slate-700" required />
                <Search className="w-6 h-6 text-slate-300 absolute left-6 top-6 group-focus-within:text-blue-600 transition" />
              </div>
              <button type="submit" className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.3em] py-6 rounded-[2rem] transition shadow-2xl shadow-blue-400/30 transform hover:scale-[1.03] active:scale-[0.97]">Verify Now</button>
            </form>
            {searchResult && (
              <div className="mt-16 w-full max-w-md">
                {searchResult.error ? <div className="bg-red-50 text-red-600 p-6 rounded-[2rem] border border-red-100 text-center font-black animate-in shake-in">{searchResult.error}</div> : (
                  <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl shadow-xl">{searchResult.status}</div>
                    <Activity className="w-24 h-24 absolute -bottom-8 -left-8 text-blue-500/10 pointer-events-none" />
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-10">Verification Result</h4>
                    <div className="space-y-8 relative z-10">
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Participant</span><span className="font-black text-white text-2xl tracking-tight">{searchResult.name}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Accredited Course</span><span className="font-bold text-blue-200 text-lg leading-tight">{searchResult.course}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
