'use client';

import React, { useState } from 'react';
import { 
  BookOpen, Calendar, Search, Link as LinkIcon, 
  Activity, Users, FileText, ChevronRight, ShieldAlert,
  Award, ArrowRight, Sparkles, Loader2
} from 'lucide-react';

// Define types for better TypeScript support
interface NewsItem {
  id: number;
  title: string;
  date: string;
  type: string;
}

interface CourseItem {
  id: number;
  name: string;
  category: string;
  status: string;
}

interface ExternalApp {
  id: number;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

interface SearchResult {
  name?: string;
  course?: string;
  date?: string;
  status?: string;
  error?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchCert, setSearchCert] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  // AI Features State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Mock Data
  const newsList: NewsItem[] = [
    { id: 1, title: 'เปิดรับสมัครอบรม Technical Rescue (Rope Rescue Level 1)', date: '15 พ.ค. 2026', type: 'ประกาศ' },
    { id: 2, title: 'ปรับปรุงแนวทางปฏิบัติการแพทย์ฉุกเฉินนอกโรงพยาบาล ปี 2026', date: '10 พ.ค. 2026', type: 'วิชาการ' },
    { id: 3, title: 'ประกาศผลสอบ EMR / EMT รอบที่ 2/2026', date: '5 พ.ค. 2026', type: 'ผลการสอบ' },
  ];

  const coursesList: CourseItem[] = [
    { id: 1, name: 'Basic Life Support (BLS) for Healthcare Providers', category: 'การแพทย์', status: 'เปิดรับสมัคร' },
    { id: 2, name: 'Pre-Hospital Trauma Life Support (PHTLS)', category: 'การแพทย์', status: 'เต็มแล้ว' },
    { id: 3, name: 'Vehicle Extrication & Technical Rescue', category: 'กู้ภัย', status: 'เปิดรับสมัคร' },
  ];

  const externalApps: ExternalApp[] = [
    { id: 1, name: 'ระบบ ITEMS', desc: 'ระบบจัดการข้อมูลผู้ป่วยฉุกเฉิน', icon: <Activity className="w-6 h-6 text-blue-500" /> },
    { id: 2, name: 'ระบบ D-E-M-S', desc: 'Disaster & Emergency Medical System', icon: <ShieldAlert className="w-6 h-6 text-red-500" /> },
    { id: 3, name: 'ระบบสารสนเทศ สพฉ.', desc: 'Intranet สำหรับเจ้าหน้าที่', icon: <Users className="w-6 h-6 text-green-500" /> },
  ];

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
    setIsAiLoading(true);
    setAiError('');
    setAiResponse('');

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 
    
    // Updated Gemini model to a stable version
    const model = "gemini-1.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const systemPrompt = "คุณคือผู้เชี่ยวชาญด้านการแพทย์ฉุกเฉิน (EMS) และกู้ภัย ของสถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ. หรือ NIEM) หน้าที่ของคุณคือแนะนำเส้นทางการเรียนหรือหลักสูตรการฝึกอบรมที่เหมาะสมให้กับผู้ใช้ โดยอ้างอิงจากประสบการณ์และความสนใจของพวกเขา ให้คำแนะนำที่กระชับ อ่านง่าย เป็นมืออาชีพ และให้กำลังใจ (ตอบเป็นภาษาไทย) จัดรูปแบบให้อ่านง่ายและกระชับที่สุด";
    const prompt = `ประวัติ/ความสนใจของผู้ใช้: "${aiQuery}"\n\nโปรดแนะนำว่าควรเริ่มต้นเรียนอะไร หรือต่อยอดอย่างไรดีในสายงาน EMS/Rescue`;

    try {
      if (!apiKey) {
        throw new Error('Missing API Key');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ไม่สามารถให้คำแนะนำได้ในขณะนี้";
      setAiResponse(text);
    } catch (err) {
      if (err instanceof Error && err.message === 'Missing API Key') {
        setAiError('กรุณาตั้งค่า NEXT_PUBLIC_GEMINI_API_KEY ในไฟล์ .env.local ก่อนใช้งานส่วนนี้');
      } else {
        setAiError('เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI ระบบอาจขัดข้องชั่วคราว');
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navigation */}
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
              <Activity className="w-8 h-8 mr-2 text-red-400" />
              <div>
                <span className="font-bold text-xl tracking-wider">NIEM</span>
                <span className="font-light text-blue-200 ml-1">TRAINING CENTER</span>
              </div>
            </div>
            <div className="hidden md:flex space-x-1 items-center">
              <button onClick={() => setActiveTab('home')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'home' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>หน้าแรก</button>
              <button onClick={() => setActiveTab('courses')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'courses' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>หลักสูตร & ลงทะเบียน</button>
              <button onClick={() => setActiveTab('cert')} className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'cert' ? 'bg-blue-800' : 'hover:bg-blue-800'}`}>ค้นหาใบประกาศฯ</button>
              <button className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-sm font-bold transition-colors shadow-sm">เข้าสู่ระบบ / ลงทะเบียน</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldAlert className="w-64 h-64 text-white" />
              </div>
              <div className="px-8 py-12 relative z-10 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">ศูนย์ฝึกอบรมสถาบันการแพทย์ฉุกเฉินแห่งชาติ</h1>
                <p className="text-blue-100 max-w-2xl text-lg mb-8">
                  ยกระดับมาตรฐานการแพทย์ฉุกเฉินนอกโรงพยาบาล สู่ความเป็นเลิศทางวิชาการและทักษะการกู้ชีพ
                </p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setActiveTab('courses')} className="bg-white text-blue-900 px-6 py-3 rounded-lg font-bold shadow-md hover:bg-blue-50 transition flex items-center">
                    <Calendar className="w-5 h-5 mr-2" /> ดูตารางอบรม
                  </button>
                  <button onClick={() => setActiveTab('cert')} className="bg-blue-700 text-white border border-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition flex items-center">
                    <Award className="w-5 h-5 mr-2" /> ตรวจสอบใบประกาศฯ
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Layout for News & External Apps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* News Section */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" /> ข่าวสารประชาสัมพันธ์
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800">ดูทั้งหมด</button>
                </div>
                <div className="space-y-4">
                  {newsList.map(news => (
                    <div key={news.id} className="group border-b border-slate-100 last:border-0 pb-4 last:pb-0 flex items-start justify-between cursor-pointer">
                      <div>
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md mb-2">{news.type}</span>
                        <h3 className="font-medium text-slate-800 group-hover:text-blue-600 transition">{news.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{news.date}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Portal / Connected Apps */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-blue-600" /> ระบบที่เกี่ยวข้อง
                </h2>
                <div className="space-y-4">
                  {externalApps.map(app => (
                    <div key={app.id} className="flex items-center p-3 border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-md transition cursor-pointer bg-slate-50 hover:bg-white">
                      <div className="bg-white p-2 rounded-full shadow-sm mr-4">
                        {app.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-700 text-sm">{app.name}</h4>
                        <p className="text-xs text-slate-500">{app.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[60vh]">
            
            {/* AI Course Recommender Section */}
            <div className="mb-10 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Sparkles className="w-32 h-32 text-indigo-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                  <h3 className="text-xl font-bold text-indigo-900">ผู้ช่วย AI แนะนำหลักสูตร</h3>
                </div>
                <p className="text-indigo-700 text-sm mb-5 max-w-2xl">
                  ไม่แน่ใจว่าควรลงเรียนหลักสูตรไหน? เล่าประสบการณ์หรือเป้าหมายของคุณให้เราฟัง (เช่น "เป็นอาสามา 1 ปี อยากเก่งเรื่อง CPR") เพื่อให้ AI ผู้เชี่ยวชาญของเราแนะนำเส้นทางให้ครับ
                </p>
                
                <div className="flex flex-col md:flex-row gap-3">
                  <input 
                    type="text" 
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="พิมพ์ประสบการณ์หรือความสนใจของคุณที่นี่..."
                    className="flex-grow px-4 py-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiRecommendation()}
                  />
                  <button 
                    onClick={handleAiRecommendation}
                    disabled={isAiLoading || !aiQuery.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-6 rounded-lg transition shadow-md flex items-center justify-center md:w-auto w-full"
                  >
                    {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : '✨ ขอคำแนะนำ'}
                  </button>
                </div>

                {/* AI Output */}
                {aiError && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                    <ShieldAlert className="w-4 h-4 mr-2" /> {aiError}
                  </div>
                )}
                {aiResponse && (
                  <div className="mt-6 p-5 bg-white rounded-lg border border-indigo-100 shadow-sm relative">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-full mr-4 flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed font-medium">
                        {aiResponse}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-600" /> หลักสูตรและตารางฝึกอบรม
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesList.map(course => (
                <div key={course.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{course.category}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${course.status === 'เปิดรับสมัคร' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2 flex-grow">{course.name}</h3>
                  <button className="mt-4 w-full py-2 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-lg font-medium transition flex justify-center items-center">
                    รายละเอียด <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Tab */}
        {activeTab === 'cert' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[60vh] flex flex-col items-center">
            <Award className="w-16 h-16 text-blue-200 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">ระบบตรวจสอบประกาศนียบัตร</h2>
            <p className="text-slate-500 mb-8 text-center max-w-lg">
              กรุณากรอกหมายเลขใบประกาศนียบัตร หรือ เลขที่บัตรประชาชน (เฉพาะผู้ที่ยินยอมให้เปิดเผยข้อมูล) เพื่อตรวจสอบความถูกต้อง
            </p>

            <form onSubmit={handleSearchCert} className="w-full max-w-md">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchCert}
                  onChange={(e) => setSearchCert(e.target.value)}
                  placeholder="ลองค้นหา: NIEM-2026-001" 
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
                <Search className="w-6 h-6 text-slate-400 absolute left-4 top-3" />
              </div>
              <button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md">
                ค้นหาข้อมูล
              </button>
            </form>

            {/* Search Results */}
            {searchResult && (
              <div className="mt-8 w-full max-w-md">
                {searchResult.error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700">
                    {searchResult.error}
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                      {searchResult.status}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-green-200 pb-2">ผลการค้นหา</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-500 inline-block w-24">ชื่อ-สกุล:</span> <span className="font-bold text-slate-800">{searchResult.name}</span></p>
                      <p><span className="text-slate-500 inline-block w-24">หลักสูตร:</span> <span className="font-medium text-slate-800">{searchResult.course}</span></p>
                      <p><span className="text-slate-500 inline-block w-24">วันที่ออกบัตร:</span> <span className="text-slate-800">{searchResult.date}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2026 ศูนย์ฝึกอบรม สถาบันการแพทย์ฉุกเฉินแห่งชาติ (NIEM Training Center)</p>
        <p className="mt-2">พัฒนาโดยใช้ Next.js, Tailwind CSS, และ Supabase</p>
      </footer>
    </div>
  );
}
