'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  BookOpen, Calendar, Search, Activity, Users, 
  FileText, ChevronRight, ShieldAlert, Award, 
  ArrowRight, Sparkles, Loader2, Globe, Link as LinkIcon,
  Stethoscope, HeartPulse, Building2, TrendingUp, AlertCircle
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

// Define types
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
  const [loadingCourses, setLoadingCourses] = useState(false);
  
  // Real DB Data for News and Systems
  const [dbNews, setDbNews] = useState<any[]>([]);
  const [dbSystems, setDbSystems] = useState<any[]>([]);
  const [heroData, setHeroData] = useState<any>({ 
    title: 'ศูนย์ฝึกอบรม NIEM Thailand', 
    subtitle: 'ยกระดับมาตรฐานการแพทย์ฉุกเฉินนอกโรงพยาบาล สู่ความเป็นเลิศทางวิชาการและทักษะการกู้ชีพสากล', 
    button_text: 'ดูตารางอบรมปี 2026',
    button2_text: 'ระบบตรวจสอบวุฒิบัตร'
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
    const prompt = `คุณคือผู้เชี่ยวชาญด้านการแพทย์ฉุกเฉิน (EMS) และกู้ภัย ของสถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ. หรือ NIEM) หน้าที่ของคุณคือแนะนำเส้นทางการเรียนหรือหลักสูตรการฝึกอบรมที่เหมาะสมให้กับผู้ใช้ โดยอ้างอิงจากประสบการณ์และความสนใจของพวกเขา ให้คำแนะนำที่กระชับ อ่านง่าย เป็นมืออาชีพ และให้กำลังใจ (ตอบเป็นภาษาไทย) ประวัติ/ความสนใจของผู้ใช้: "${aiQuery}"`;

    try {
      if (!apiKey) throw new Error('Missing API Key');
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
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

  const getSystemIcon = (name: string) => {
    switch(name) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'Globe': return <Globe className="w-5 h-5 text-green-500" />;
      case 'FileText': return <FileText className="w-5 h-5 text-blue-500" />;
      default: return <Activity className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-800 flex flex-col overflow-x-hidden">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-grow w-full pt-32">
        {activeTab === 'home' && (
          <div className="space-y-24 animate-in fade-in duration-700">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-slate-900 min-h-[550px] md:min-h-[700px] py-16 md:py-24 flex items-center shadow-2xl animate-scale-in">
                {/* Background Pattern/Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950"></div>
                <div className="absolute top-0 right-0 w-full md:w-[60%] h-full bg-gradient-to-l md:bg-gradient-to-l from-blue-600/20 to-transparent"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 md:w-96 md:h-96 bg-red-600/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse"></div>
                
                <div className="relative z-10 px-6 sm:px-10 md:px-20 text-white w-full max-w-4xl">
                  <div className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-6 md:mb-8 animate-fade-in-up">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400 animate-ping mr-2 md:mr-3"></div>
                    <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-blue-300">
                      Emergency Medical Excellence
                    </span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-[1.1] md:leading-[1] tracking-tight animate-fade-in-up delay-100">
                    {heroData.title.split(' ').map((word: string, i: number) => (
                      <React.Fragment key={i}>
                        <span className={i === 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400' : 'text-white'}>
                          {word}
                        </span>{' '}
                      </React.Fragment>
                    ))}
                  </h1>
                  
                  <p className="text-slate-300 text-sm md:text-lg lg:text-xl mb-10 md:mb-12 leading-relaxed max-w-2xl font-medium animate-fade-in-up delay-200">
                    {heroData.subtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in-up delay-300">
                    <button onClick={() => setActiveTab('courses')} className="group bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1">
                      {heroData.button_text} <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => setActiveTab('cert')} className="px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black text-[10px] md:text-sm uppercase tracking-widest backdrop-blur-md transition-all duration-300 flex items-center justify-center transform hover:-translate-y-1">
                      {heroData.button2_text}
                    </button>
                  </div>
                </div>

                {/* Floating Stats or Element */}
                <div className="absolute right-12 hidden xl:flex flex-col gap-4 animate-float">
                  {[
                    { icon: <Users className="w-5 h-5" />, val: '12,000+', label: 'Trained' },
                    { icon: <Award className="w-5 h-5" />, val: '98%', label: 'Success' },
                    { icon: <Stethoscope className="w-5 h-5" />, val: '50+', label: 'Courses' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl w-40">
                      <div className="text-blue-400 mb-2">{stat.icon}</div>
                      <div className="text-2xl font-black text-white leading-none">{stat.val}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Stats Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {[
                { label: 'เจ้าหน้าที่ทีมรุก', value: '4,500', sub: 'Active Personnel', icon: <Users className="text-blue-600 w-6 h-6 md:w-8 md:h-8"/>, color: 'blue' },
                { label: 'หลักสูตรรับรอง', value: '86', sub: 'Certified Programs', icon: <Award className="text-emerald-600 w-6 h-6 md:w-8 md:h-8"/>, color: 'emerald' },
                { label: 'สถาบันเครือข่าย', value: '120', sub: 'Partner Institutions', icon: <Building2 className="text-indigo-600 w-6 h-6 md:w-8 md:h-8"/>, color: 'indigo' },
                { label: 'อัตราความสำเร็จ', value: '94%', sub: 'Survival Rate Impact', icon: <TrendingUp className="text-rose-600 w-6 h-6 md:w-8 md:h-8"/>, color: 'rose' },
              ].map((s, i) => (
                <div key={i} className={`group bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-2 animate-fade-in-up delay-${(i+1)*100}`}>
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl mb-4 md:mb-6 flex items-center justify-center bg-${s.color}-50 group-hover:scale-110 transition-transform duration-500`}>
                    {s.icon}
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-slate-900 mb-1 leading-none">{s.value}</div>
                  <div className="text-xs md:text-sm font-bold text-slate-800 mb-0.5">{s.label}</div>
                  <div className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest">{s.sub}</div>
                </div>
              ))}
            </section>

            {/* News & Systems Dual Section */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* News Section */}
                <div className="lg:col-span-8 flex flex-col">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <span className="text-blue-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block">Medical Updates</span>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">ข่าวสารและประกาศ</h2>
                    </div>
                    <Link href="/blog" className="group flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition">
                      See All Updates <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {dbNews.length > 0 ? dbNews.slice(0, 2).map((news, i) => (
                      <Link href={`/blog/${news.slug}`} key={news.id} className="group relative flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                        <div className="aspect-[16/10] overflow-hidden relative">
                           {news.image_url ? (
                            <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                           ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                              <FileText className="w-12 h-12" />
                            </div>
                           )}
                           <div className="absolute top-4 left-4">
                             <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-black uppercase text-blue-600 border border-white">
                                {news.category}
                             </span>
                           </div>
                        </div>
                        <div className="p-8 flex flex-col flex-grow">
                          <div className="flex items-center gap-3 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Calendar className="w-3 h-3" /> {new Date(news.created_at).toLocaleDateString()} • <Users className="w-3 h-3" /> {news.author}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition">
                            {news.title}
                          </h3>
                        </div>
                      </Link>
                    )) : (
                      <div className="md:col-span-2 py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                         <AlertCircle className="w-12 h-12 text-slate-200 mb-4" />
                         <span className="text-slate-400 font-bold">ไม่มีข่าวสารใหม่ในขณะนี้</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Systems Section */}
                <div className="lg:col-span-4 animate-fade-in-up delay-200">
                   <div className="flex flex-col h-full rounded-[2.5rem] bg-slate-50 border border-slate-100 p-6 sm:p-8 md:p-10">
                     <span className="text-blue-600 text-xs font-black uppercase tracking-[0.3em] mb-4 block">Medical Hub</span>
                     <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 md:mb-10 tracking-tight">ระบบสารสนเทศ</h2>
                     
                     <div className="space-y-4">
                        {dbSystems.length > 0 ? dbSystems.map((app) => (
                          <a href={app.url} target="_blank" rel="noopener noreferrer" key={app.id} className="group flex items-center p-6 bg-white rounded-3xl border border-transparent hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition duration-300">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                              {getSystemIcon(app.icon_name)}
                            </div>
                            <div className="ml-5">
                              <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition">{app.name}</h4>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">{app.description}</p>
                            </div>
                          </a>
                        )) : (
                          <div className="py-20 text-center opacity-30 italic font-medium">No active systems</div>
                        )}
                     </div>

                     <div className="mt-auto pt-10">
                       <div className="p-6 bg-blue-600 rounded-3xl text-white relative overflow-hidden group cursor-pointer">
                          <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:scale-125 transition duration-500" />
                          <div className="relative z-10">
                            <div className="text-xs font-black uppercase tracking-widest mb-1 opacity-70">EMS Dashboard</div>
                            <div className="text-lg font-bold">ข้อมูลสรุปสถิติทั่วประเทศ</div>
                          </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </section>

            {/* Training Courses Section */}
            <section className="bg-slate-900 py-20 md:py-32">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-20">
                    <div className="max-w-2xl mb-8 md:mb-0 animate-fade-in-up">
                      <span className="text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-4 md:mb-6 block">Professional Development</span>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1] md:leading-[0.9]">ยกระดับทักษะ<br className="hidden md:block"/>การกู้ชีพสากล</h2>
                    </div>
                    <div className="flex gap-4 animate-fade-in-up delay-100">
                      <button onClick={() => setActiveTab('courses')} className="px-6 py-3 md:px-8 md:py-4 bg-white/5 hover:bg-white text-slate-300 hover:text-slate-900 border border-white/10 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">Explore All</button>
                    </div>
                 </div>

                 {/* AI Pathway Assistant Redesigned */}
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
                    <div className="lg:col-span-12 relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-900 to-blue-800 shadow-3xl shadow-blue-900/20">
                       <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transform rotate-12 flex flex-col gap-8">
                         <HeartPulse className="w-24 h-24 text-white" />
                         <Stethoscope className="w-48 h-48 text-white" />
                         <Activity className="w-32 h-32 text-white" />
                       </div>
                       
                       <div className="p-8 md:p-16 relative z-10 max-w-3xl">
                          <div className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md mb-8">
                            <Sparkles className="w-4 h-4 mr-3 text-blue-300" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">AI Medical Pathway Assistant</span>
                          </div>
                          
                          <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">พบกับผู้ช่วย AI ที่จะออกแบบ เส้นทางการเรียนรู้เพื่อคุณ</h3>
                          <p className="text-blue-100/60 text-base md:text-lg mb-12 font-medium leading-relaxed italic">"วิเคราะห์ประสบการณ์และเป้าหมายของคุณ เพื่อแนะนำหลักสูตรที่เหมาะสมที่สุดสำหรับวิชาชีพ EMS"</p>
                          
                          <div className="flex flex-col md:flex-row gap-4">
                             <input 
                              type="text" 
                              value={aiQuery} 
                              onChange={(e) => setAiQuery(e.target.value)} 
                              placeholder="เช่น 'ผมอยากเป็นกู้ภัยเฉพาะทาง'" 
                              className="w-full px-6 py-4 md:px-8 md:py-5 rounded-xl md:rounded-2xl bg-black/20 border border-white/10 text-white placeholder:text-white/30 focus:ring-2 md:focus:ring-4 focus:ring-white/10 outline-none backdrop-blur-xl transition focus:bg-black/30 font-medium text-sm md:text-base" 
                              onKeyDown={(e) => e.key === 'Enter' && handleAiRecommendation()} 
                             />
                             <button onClick={handleAiRecommendation} disabled={isAiLoading || !aiQuery.trim()} className="w-full md:w-auto bg-white hover:bg-blue-50 text-slate-900 font-extrabold px-8 md:px-12 rounded-xl md:rounded-2xl transition shadow-2xl flex items-center justify-center h-[56px] md:h-[64px] min-w-0 md:min-w-[200px] text-sm md:text-base">
                               {isAiLoading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : 'Start Analysis'}
                             </button>
                          </div>

                          {aiResponse && (
                            <div className="mt-10 p-8 rounded-3xl bg-black/20 border border-white/10 backdrop-blur-xl text-blue-50 animate-in slide-in-from-top-4 duration-500">
                               <div className="flex items-center gap-3 mb-4 text-blue-400 font-bold"><Activity className="w-5 h-5"/> AI Recommendations</div>
                               <div className="text-sm md:text-base leading-relaxed font-medium whitespace-pre-wrap">{aiResponse}</div>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Courses Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {coursesList.map((course, i) => (
                      <div key={course.id} className={`group relative bg-white/5 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 hover:bg-white/10 hover:border-white/10 transition-all duration-500 flex flex-col transform hover:-translate-y-2 animate-fade-in-up delay-${(i % 3 + 1) * 100}`}>
                        <div className="flex justify-between items-start mb-10">
                           <span className="px-4 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/10">{course.category}</span>
                           <div className={`w-3 h-3 rounded-full ${course.status === 'เปิดรับสมัคร' ? 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]' : 'bg-rose-400'}`}></div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-10 leading-snug group-hover:text-blue-400 transition-colors flex-grow">{course.name}</h3>
                        
                        <div className="flex items-center justify-between pt-8 border-t border-white/5">
                           <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                              Availability: <span className={course.status === 'เปิดรับสมัคร' ? 'text-green-400' : 'text-rose-400'}>{course.status}</span>
                           </div>
                           <button className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-blue-600 flex items-center justify-center text-white transition-all duration-300">
                             <ArrowRight className="w-6 h-6" />
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </section>

            {/* Certification Check Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-40 text-center flex flex-col items-center">
               <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-3xl bg-blue-50 flex items-center justify-center mb-6 md:mb-8 relative animate-fade-in-up">
                  <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-2xl opacity-40 animate-pulse"></div>
                  <Award className="w-10 h-10 md:w-12 md:h-12 text-blue-600 relative z-10" />
               </div>
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight animate-fade-in-up delay-100">ตรวจสอบวุฒิบัตร</h2>
               <p className="text-slate-400 font-medium mb-10 md:mb-12 text-center max-w-md uppercase tracking-widest text-[9px] md:text-[10px] animate-fade-in-up delay-200">Portal for Official Verification</p>
               
               <form onSubmit={handleSearchCert} className="w-full relative max-w-2xl group animate-fade-in-up delay-300">
                 <div className="absolute inset-0 bg-blue-600/5 blur-[80px] rounded-full group-focus-within:opacity-100 transition duration-500"></div>
                 <div className="relative bg-white p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col sm:flex-row items-center transition-all group-focus-within:scale-[1.02] gap-2 sm:gap-0">
                    <div className="hidden sm:block pl-6 md:pl-8 pr-2 md:pr-4 text-slate-400"><Search className="w-5 h-5 md:w-6 md:h-6"/></div>
                    <input 
                      type="text" 
                      value={searchCert} 
                      onChange={(e) => setSearchCert(e.target.value)} 
                      placeholder="CERTIFICATE ID (เช่น NIEM-2026-001)" 
                      className="w-full sm:flex-grow py-4 sm:py-5 md:py-6 px-6 sm:px-2 rounded-[1.5rem] md:rounded-3xl border-none focus:ring-0 outline-none font-bold text-slate-800 placeholder:text-slate-300 text-center sm:text-left text-sm md:text-base bg-slate-50 sm:bg-transparent" 
                      required 
                    />
                    <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest px-8 md:px-10 py-4 sm:py-0 sm:h-14 md:h-16 rounded-[1.5rem] md:rounded-[1.8rem] transition-all active:scale-95 shadow-xl shadow-blue-600/20 text-xs md:text-sm">Verify</button>
                 </div>
               </form>

               {searchResult && (
                  <div className="mt-16 w-full max-w-xl animate-in zoom-in-95 duration-500">
                    {searchResult.error ? (
                      <div className="flex items-center gap-4 bg-rose-50 text-rose-600 p-6 rounded-3xl border border-rose-100 font-bold overflow-hidden relative">
                         <div className="w-1.5 h-full bg-rose-600 absolute left-0 top-0"></div>
                         <AlertCircle className="w-6 h-6" /> {searchResult.error}
                      </div>
                    ) : (
                      <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-12 text-left relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-bl-3xl">Verified {searchResult.status}</div>
                        <Activity className="w-48 h-48 absolute -bottom-16 -right-16 text-blue-500/5 pointer-events-none" />
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-12">Official Accreditation</div>
                        <div className="space-y-6 md:space-y-10 relative z-10">
                          <div className="flex flex-col"><span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Authenticated Participant</span><span className="font-black text-white text-2xl md:text-3xl tracking-tight">{searchResult.name}</span></div>
                          <div className="flex flex-col"><span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Awarded Degree/Course</span><span className="font-bold text-blue-200 text-lg md:text-xl leading-tight">{searchResult.course}</span></div>
                          <div className="flex flex-col"><span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Issued Date</span><span className="font-bold text-slate-300 text-base md:text-lg">{searchResult.date}</span></div>
                        </div>
                      </div>
                    )}
                  </div>
               )}
            </section>
          </div>
        )}

        {/* Other tabs remain similar in functional logic but would be styled according to the new design system */}
        {activeTab !== 'home' && (
          <div className="max-w-7xl mx-auto px-6 py-20 text-center animate-in fade-in duration-500">
             <div className="bg-white p-20 rounded-[3rem] border border-slate-100 shadow-sm">
                <Loader2 className="w-12 h-12 text-blue-200 animate-spin mx-auto mb-8" />
                <h2 className="text-2xl font-black text-slate-900 mb-4">Navigating to {activeTab}...</h2>
                <p className="text-slate-400 font-medium">Please check the sidebar or use the navigation for deep content.</p>
                <button onClick={() => setActiveTab('home')} className="mt-10 px-8 py-4 bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-blue-600 hover:text-white transition group">Return to Overview</button>
             </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
