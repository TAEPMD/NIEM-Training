'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  BookOpen, Calendar, Search, Link as LinkIcon, 
  Activity, Users, FileText, ChevronRight, ShieldAlert,
  Award, ArrowRight, Sparkles, Loader2
} from 'lucide-react';

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

  // Static Data
  const newsList: NewsItem[] = [
    { id: 1, title: 'เปิดรับสมัครอบรม Technical Rescue (Rope Rescue Level 1)', date: '15 พ.ค. 2026', type: 'ประกาศ' },
    { id: 2, title: 'ปรับปรุงแนวทางปฏิบัติการแพทย์ฉุกเฉินนอกโรงพยาบาล ปี 2026', date: '10 พ.ค. 2026', type: 'วิชาการ' },
    { id: 3, title: 'ประกาศผลสอบ EMR / EMT รอบที่ 2/2026', date: '5 พ.ค. 2026', type: 'ผลการสอบ' },
  ];

  const externalApps: ExternalApp[] = [
    { id: 1, name: 'ระบบ ITEMS', desc: 'ระบบจัดการข้อมูลผู้ป่วยฉุกเฉิน', icon: <Activity className="w-6 h-6 text-blue-500" /> },
    { id: 2, name: 'ระบบ D-E-M-S', desc: 'Disaster & Emergency Medical System', icon: <ShieldAlert className="w-6 h-6 text-red-500" /> },
    { id: 3, name: 'ระบบสารสนเทศ สพฉ.', desc: 'Intranet สำหรับเจ้าหน้าที่', icon: <Users className="w-6 h-6 text-green-500" /> },
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem('niem_courses');
    if (savedCourses) {
      setCoursesList(JSON.parse(savedCourses));
    } else {
      const initialCourses = [
        { id: 1, name: 'Basic Life Support (BLS) for Healthcare Providers', category: 'การแพทย์', status: 'เปิดรับสมัคร' },
        { id: 2, name: 'Pre-Hospital Trauma Life Support (PHTLS)', category: 'การแพทย์', status: 'เต็มแล้ว' },
        { id: 3, name: 'Vehicle Extrication & Technical Rescue', category: 'กู้ภัย', status: 'เปิดรับสมัคร' },
      ];
      setCoursesList(initialCourses);
      localStorage.setItem('niem_courses', JSON.stringify(initialCourses));
    }
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
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ไม่สามารถให้คำแนะนำได้ในขณะนี้");
    } catch (err) {
      setAiError(err instanceof Error && err.message === 'Missing API Key' ? 'กรุณาตั้งค่า API Key' : 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-3xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldAlert className="w-64 h-64 text-white" />
              </div>
              <div className="px-8 py-12 relative z-10 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">ศูนย์ฝึกอบรมสถาบันการแพทย์ฉุกเฉินแห่งชาติ</h1>
                <p className="text-blue-100 max-w-2xl text-lg mb-8">ยกระดับมาตรฐานการแพทย์ฉุกเฉินนอกโรงพยาบาล สู่ความเป็นเลิศทางวิชาการและทักษะการกู้ชีพ</p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('courses')} className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-50 transition flex items-center"><Calendar className="w-5 h-5 mr-2" /> ดูตารางอบรม</button>
                  <button onClick={() => setActiveTab('cert')} className="bg-blue-700 text-white border border-blue-500 px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition flex items-center"><Award className="w-5 h-5 mr-2" /> ตรวจสอบใบประกาศฯ</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600" /> ข่าวสารประชาสัมพันธ์</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800">ดูทั้งหมด</button>
                </div>
                <div className="space-y-4">
                  {newsList.map(news => (
                    <div key={news.id} className="group border-b border-slate-50 last:border-0 pb-4 last:pb-0 flex items-start justify-between cursor-pointer">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded mb-2 uppercase">{news.type}</span>
                        <h3 className="font-medium text-slate-800 group-hover:text-blue-600 transition">{news.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{news.date}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center"><LinkIcon className="w-5 h-5 mr-2 text-blue-600" /> ระบบที่เกี่ยวข้อง</h2>
                <div className="space-y-4">
                  {externalApps.map(app => (
                    <div key={app.id} className="flex items-center p-4 border border-slate-50 rounded-2xl hover:border-blue-100 hover:shadow-md transition cursor-pointer bg-slate-50 hover:bg-white">
                      <div className="bg-white p-2 rounded-xl shadow-sm mr-4">{app.icon}</div>
                      <div>
                        <h4 className="font-bold text-slate-700 text-sm">{app.name}</h4>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{app.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 min-h-[60vh]">
            <div className="mb-10 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Sparkles className="w-48 h-48 text-indigo-500" /></div>
              <div className="relative z-10">
                <div className="flex items-center mb-3 text-indigo-600"><Sparkles className="w-6 h-6 mr-2 font-bold" /><h3 className="text-xl font-bold">AI Course Recommender</h3></div>
                <p className="text-indigo-700 text-sm mb-6 max-w-2xl font-medium">แนะนำหลักสูตรที่เหมาะสมกับเป้าหมายของคุณด้วย AI อัจฉริยะ</p>
                <div className="flex flex-col md:flex-row gap-3">
                  <input type="text" value={aiQuery} onChange={(e) => setAiQuery(e.target.value)} placeholder="เล่าประสบการณ์หรือความสนใจของคุณ..." className="flex-grow px-6 py-4 rounded-2xl border border-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm transition" onKeyDown={(e) => e.key === 'Enter' && handleAiRecommendation()} />
                  <button onClick={handleAiRecommendation} disabled={isAiLoading || !aiQuery.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-200 text-white font-bold py-4 px-8 rounded-2xl transition shadow-lg flex items-center justify-center">{isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ขอคำแนะนำ ✨'}</button>
                </div>
                {aiResponse && <div className="mt-8 p-6 bg-white/80 backdrop-blur rounded-2xl border border-indigo-100 text-slate-700 whitespace-pre-line leading-relaxed font-medium text-sm shadow-sm">{aiResponse}</div>}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center"><BookOpen className="w-6 h-6 mr-3 text-blue-600" /> หลักสูตรและตารางฝึกอบรม</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coursesList.map(course => (
                <div key={course.id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-2xl hover:shadow-blue-900/5 transition group flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">{course.category}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${course.status === 'เปิดรับสมัคร' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{course.status}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-6 flex-grow leading-tight group-hover:text-blue-600 transition">{course.name}</h3>
                  <button className="w-full py-4 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 rounded-2xl font-bold transition flex justify-center items-center">รายละเอียด <ArrowRight className="w-4 h-4 ml-2" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cert' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 min-h-[60vh] flex flex-col items-center">
            <Award className="w-20 h-20 text-blue-100 mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ตรวจสอบประกาศนียบัตร</h2>
            <p className="text-slate-400 mb-10 text-center max-w-sm text-sm font-medium">กรุณากรอกรหัสใบประกาศฯ เพื่อตรวจสอบความถูกต้องในระบบ</p>
            <form onSubmit={handleSearchCert} className="w-full max-w-md">
              <div className="relative">
                <input type="text" value={searchCert} onChange={(e) => setSearchCert(e.target.value)} placeholder="เช่น NIEM-2026-001" className="w-full pl-14 pr-6 py-5 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition shadow-inner font-bold" required />
                <Search className="w-6 h-6 text-slate-300 absolute left-5 top-4.5" />
              </div>
              <button type="submit" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] py-5 rounded-3xl transition shadow-xl shadow-blue-200 transform hover:scale-[1.02] active:scale-[0.98]">ค้นหาข้อมูล</button>
            </form>
            {searchResult && (
              <div className="mt-12 w-full max-w-md">
                {searchResult.error ? <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-center font-bold">{searchResult.error}</div> : (
                  <div className="bg-green-50 border border-green-100 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg">{searchResult.status}</div>
                    <h4 className="text-xs font-black text-green-600 uppercase tracking-widest mb-6">Verified Certificate</h4>
                    <div className="space-y-4">
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Name</span><span className="font-bold text-slate-800">{searchResult.name}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Course</span><span className="font-bold text-slate-700 text-sm">{searchResult.course}</span></div>
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
