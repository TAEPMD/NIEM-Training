'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2,
  Save, X, LayoutDashboard, BookOpen, Settings,
  LogOut, Activity, Globe, Eye, Loader2, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface Course {
  id: number;
  name: string;
  category: string;
  status: string;
  date_added: string;
}

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  updated_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  image_url: string;
  author: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SystemItem {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  url: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [heroSettings, setHeroSettings] = useState<any>({ title: 'ศูนย์ฝึกอบรม NIEM Thailand', subtitle: '', button_text: 'ดูตารางอบรม' });

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Current Item state
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [currentPage, setCurrentPage] = useState<Partial<PageData>>({});
  const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({});
  const [currentSystem, setCurrentSystem] = useState<Partial<SystemItem>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Load data from Supabase
  const fetchData = async () => {
    setLoading(true);
    setDbError(false);
    try {
      if (activeTab === 'courses') {
        const { data, error } = await supabase.from('courses').select('*').order('id', { ascending: false });
        if (error) throw error;
        setCourses(data || []);
      } else if (activeTab === 'pages') {
        const { data, error } = await supabase.from('pages').select('*').order('id', { ascending: false });
        if (error) throw error;
        setPages(data || []);
      } else if (activeTab === 'blogs') {
        const { data, error } = await supabase.from('blogs').select('*').order('id', { ascending: false });
        if (error) throw error;
        setBlogs(data || []);
      } else if (activeTab === 'systems') {
        const { data, error } = await supabase.from('systems').select('*').order('id', { ascending: false });
        if (error) throw error;
        setSystems(data || []);
      } else if (activeTab === 'settings') {
        const { data } = await supabase.from('settings').select('*').eq('key', 'hero').single();
        if (data) setHeroSettings(data.value);
      }
    } catch (err) {
      console.error(err);
      setDbError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Course Handlers
  const handleEditCourse = (course: Course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id: number) => {
    if (confirm('ยืนยันการลบหลักสูตร?')) {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) alert('Error: ' + error.message);
      else fetchData();
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const { error } = await supabase.from('courses').update(currentCourse).eq('id', currentCourse.id);
      if (error) alert(error.message);
      else setIsModalOpen(false);
    } else {
      const { error } = await supabase.from('courses').insert([{ ...currentCourse, date_added: new Date().toISOString() }]);
      if (error) alert(error.message);
      else setIsModalOpen(false);
    }
    fetchData();
  };

  // Page Handlers
  const handleCreatePage = () => {
    setIsEditing(false);
    setCurrentPage({ title: '', slug: '', content: '', status: 'Published' });
    setIsPageModalOpen(true);
  };

  const handleEditPage = (page: PageData) => {
    setIsEditing(true);
    setCurrentPage(page);
    setIsPageModalOpen(true);
  };

  const handleDeletePage = async (id: number) => {
    if (confirm('ยืนยันการลบหน้าเว็บนี้?')) {
      const { error } = await supabase.from('pages').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchData();
    }
  };

  const handlePageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (isEditing) {
      const { error } = await supabase.from('pages').update({ ...currentPage, updated_at: now }).eq('id', currentPage.id);
      if (error) alert(error.message);
      else setIsPageModalOpen(false);
    } else {
      const { error } = await supabase.from('pages').insert([{ ...currentPage, updated_at: now }]);
      if (error) alert(error.message);
      else setIsPageModalOpen(false);
    }
    fetchData();
  };

  // Blog Handlers
  const handleCreateBlog = () => {
    setIsEditing(false);
    setCurrentBlog({ title: '', slug: '', content: '', summary: '', category: 'News', status: 'Published', author: 'Admin' });
    setIsBlogModalOpen(true);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setIsEditing(true);
    setCurrentBlog(blog);
    setIsBlogModalOpen(true);
  };

  const handleDeleteBlog = async (id: number) => {
    if (confirm('ยืนยันการลบ Blog นี้?')) {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchData();
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (isEditing) {
      const { error } = await supabase.from('blogs').update({ ...currentBlog, updated_at: now }).eq('id', currentBlog.id);
      if (error) alert(error.message);
      else setIsBlogModalOpen(false);
    } else {
      const { error } = await supabase.from('blogs').insert([{ ...currentBlog, created_at: now, updated_at: now }]);
      if (error) alert(error.message);
      else setIsBlogModalOpen(false);
    }
    fetchData();
  };

  // System Handlers
  const handleCreateSystem = () => {
    setIsEditing(false);
    setCurrentSystem({ name: '', description: '', icon_name: 'Activity', url: '' });
    setIsSystemModalOpen(true);
  };

  const handleEditSystem = (system: SystemItem) => {
    setIsEditing(true);
    setCurrentSystem(system);
    setIsSystemModalOpen(true);
  };

  const handleDeleteSystem = async (id: number) => {
    if (confirm('ยืนยันการลบระบบนี้?')) {
      const { error } = await supabase.from('systems').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchData();
    }
  };

  const handleSystemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (isEditing) {
      const { error } = await supabase.from('systems').update({ ...currentSystem, updated_at: now }).eq('id', currentSystem.id);
      if (error) alert(error.message);
      else setIsSystemModalOpen(false);
    } else {
      const { error } = await supabase.from('systems').insert([{ ...currentSystem, updated_at: now }]);
      if (error) alert(error.message);
      else setIsSystemModalOpen(false);
    }
    fetchData();
  };

  // Helper for Rich Text Editor (simplified)
  const insertTag = (tag: string, field: 'page' | 'blog') => {
    const textarea = document.getElementById(field === 'page' ? 'page-content' : 'blog-content') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selected = text.substring(start, end);
    let newText = "";
    
    if (tag === 'b') newText = `${before}<b>${selected}</b>${after}`;
    else if (tag === 'i') newText = `${before}<i>${selected}</i>${after}`;
    else if (tag === 'h2') newText = `${before}<h2>${selected}</h2>${after}`;
    else if (tag === 'br') newText = `${before}${selected}<br/>${after}`;
    else if (tag === 'p') newText = `${before}<p>${selected}</p>${after}`;
    
    if (field === 'page') setCurrentPage({ ...currentPage, content: newText });
    else setCurrentBlog({ ...currentBlog, content: newText });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2 + selected.length);
    }, 10);
  };

  const filteredCourses = courses.filter(c => 
    (c.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterCategory === 'All' || c.category === filterCategory)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center border-b border-slate-800">
          <Activity className="w-8 h-8 mr-2 text-red-500" />
          <span className="font-bold text-xl tracking-tight text-white uppercase italic">Niem Admin</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> แผงควบคุม (Dashboard)
          </button>
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-2 italic">คอนเทนต์</div>
          <button 
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'blogs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5 mr-3" /> บทความ (Posts)
          </button>
          <button 
            onClick={() => setActiveTab('pages')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'pages' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Globe className="w-5 h-5 mr-3" /> หน้าเว็บ (Pages)
          </button>
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6 mb-2 px-2 italic">ระบบและการเรียน</div>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BookOpen className="w-5 h-5 mr-3" /> จัดการหลักสูตร
          </button>
          <button 
            onClick={() => setActiveTab('systems')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'systems' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="w-5 h-5 mr-3" /> ระบบสารสนเทศ
          </button>
          <button 
            onClick={() => setActiveTab('media')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'media' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Globe className="w-5 h-5 mr-3" /> คลังสื่อ (Media)
          </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Settings className="w-5 h-5 mr-3" /> ตั้งค่าทั่วไป (Settings)
            </button>
        </nav>

        <div className="p-4 border-t border-slate-800 pb-8">
          <Link href="/" className="flex items-center w-full p-3 text-slate-400 hover:text-white transition group">
            <LogOut className="w-5 h-5 mr-3 group-hover:text-red-400" /> ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 max-w-7xl mx-auto overflow-y-auto h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'dashboard' ? 'CMS Overview' : activeTab === 'courses' ? 'จัดการหลักสูตรการอบรม' : activeTab === 'pages' ? 'จัดการเนื้อหาหน้าเว็บ' : activeTab === 'blogs' ? 'จัดการ Blog Posts' : activeTab === 'settings' ? 'ตั้งค่าระบบ' : 'จัดการระบบสารสนเทศ'}
            </h1>
            <p className="text-slate-500 mt-1">ยินดีต้อนรับสู่ระบบจัดการเนื้อหา (CMS) ของ NIEM Training</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchData}
              className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
              title="Refresh Data"
            >
              <Loader2 className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => activeTab === 'courses' ? (setIsEditing(false), setCurrentCourse({}), setIsModalOpen(true)) : activeTab === 'pages' ? handleCreatePage() : activeTab === 'blogs' ? handleCreateBlog() : handleCreateSystem()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-2xl shadow-blue-200 transition flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 mr-2" /> {activeTab === 'courses' ? 'เพิ่มหลักสูตรใหม่' : activeTab === 'pages' ? 'สร้างหน้าเว็บใหม่' : activeTab === 'blogs' ? 'สร้าง Blog Post ใหม่' : 'เพิ่มระบบใหม่'}
            </button>
          </div>
        </header>

        {dbError && (
          <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-start text-red-700 shadow-sm">
            <AlertTriangle className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">ไม่สามารถเชื่อมต่อฐานข้อมูลได้!</h3>
              <p className="text-sm mt-1 mb-4 opacity-80">
                สาเหตุอาจเกิดจาก: 1. ยังไม่ได้ตั้งค่า API Key ใน .env.local หรือ 2. ยังไม่ได้สร้างตารางใน Supabase
              </p>
              <div className="bg-slate-900 p-4 rounded-xl text-xs font-mono text-blue-300 overflow-x-auto">
                <p>-- โปรดเรียกใช้ SQL นี้ใน Supabase SQL Editor:</p>
                <p>CREATE TABLE courses (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT, category TEXT, status TEXT, date_added TIMESTAMP WITH TIME ZONE);</p>
                <p>CREATE TABLE pages (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title TEXT, slug TEXT UNIQUE, content TEXT, status TEXT, updated_at TIMESTAMP WITH TIME ZONE);</p>
                <p>CREATE TABLE blogs (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title TEXT, slug TEXT UNIQUE, content TEXT, summary TEXT, category TEXT, image_url TEXT, author TEXT, status TEXT, created_at TIMESTAMP WITH TIME ZONE, updated_at TIMESTAMP WITH TIME ZONE);</p>
                <p>CREATE TABLE systems (id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY, name TEXT, description TEXT, icon_name TEXT, url TEXT, updated_at TIMESTAMP WITH TIME ZONE);</p>
                <p>CREATE TABLE settings (key TEXT PRIMARY KEY, value JSONB);</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-200 animate-spin" />
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'หลักสูตรทั้งหมด', count: courses.length, icon: <BookOpen className="w-6 h-6" />, color: 'blue' },
                { title: 'บทความข่าวสาร', count: blogs.length, icon: <FileText className="w-6 h-6" />, color: 'indigo' },
                { title: 'หน้าเว็บทั้งหมด', count: pages.length, icon: <Globe className="w-6 h-6" />, color: 'emerald' },
                { title: 'ระบบภายนอก', count: systems.length, icon: <Settings className="w-6 h-6" />, color: 'slate' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl hover:shadow-blue-500/5 transition duration-500">
                  <div className={`p-4 rounded-2xl mb-4 bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{stat.title}</h3>
                  <div className="text-3xl font-black text-slate-800">{stat.count}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                  <Plus className="w-5 h-5 mr-3 text-blue-600" /> ทางลัดจัดการข้อมูล
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleCreateBlog} className="p-6 bg-slate-50 rounded-[2rem] hover:bg-blue-600 hover:text-white transition group text-left">
                    <FileText className="w-6 h-6 mb-3 text-blue-600 group-hover:text-white transition" />
                    <div className="font-bold">เขียนข่าวใหม่</div>
                    <div className="text-[10px] uppercase font-black opacity-40">Add Blog Post</div>
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="p-6 bg-slate-50 rounded-[2rem] hover:bg-blue-600 hover:text-white transition group text-left">
                    <BookOpen className="w-6 h-6 mb-3 text-blue-600 group-hover:text-white transition" />
                    <div className="font-bold">เพิ่มคอร์สอบรม</div>
                    <div className="text-[10px] uppercase font-black opacity-40">Add Training</div>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-black mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-3 text-blue-400" /> สถานะเซิร์ฟเวอร์
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-sm font-bold opacity-60">Supabase Connection</span>
                      <span className="flex items-center text-green-400 text-xs font-black"><div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div> ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-sm font-bold opacity-60">API Status</span>
                      <span className="flex items-center text-green-400 text-xs font-black"><div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div> HEALTHY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'courses' ? (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-grow max-w-md w-full">
                  <Search className="w-5 h-5 text-slate-300 absolute left-4 top-3" />
                  <input type="text" placeholder="ค้นหาชื่อหลักสูตร..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-100 border-none outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                  <tr>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCourses.map(course => (
                    <tr key={course.id} className="hover:bg-blue-50/50 group transition">
                      <td className="px-8 py-4 font-bold text-slate-700">{course.name}</td>
                      <td className="px-8 py-4 text-xs font-bold text-slate-400">{course.category}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${course.status === 'เปิดรับสมัคร' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 flex justify-center space-x-2">
                        <button onClick={() => handleEditCourse(course)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : activeTab === 'pages' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map(page => (
              <div key={page.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${page.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {page.status}
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                    <Link href={`/${page.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></Link>
                    <button onClick={() => handleEditPage(page)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeletePage(page.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{page.title}</h3>
                <code className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-4 inline-block w-fit">/{page.slug}</code>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-grow">{page.content}</p>
                <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest pt-4 border-t border-slate-50">
                  LATEST UPDATE: {new Date(page.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {pages.length === 0 && !loading && (
              <div className="md:col-span-3 py-12 text-center text-slate-400 italic text-sm">ไม่มีข้อมูลหน้าเว็บ</div>
            )}
          </div>
        ) : activeTab === 'blogs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${blog.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {blog.status}
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></Link>
                    <button onClick={() => handleEditBlog(blog)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {blog.image_url && (
                  <div className="h-32 w-full bg-slate-100 rounded-xl mb-4 overflow-hidden">
                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-bold text-lg text-slate-800 mb-1">{blog.title}</h3>
                <div className="text-xs text-slate-400 mb-2">{blog.category} • โดย {blog.author}</div>
                <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-grow">{blog.summary}</p>
                <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest pt-4 border-t border-slate-50">
                  POSTED: {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {blogs.length === 0 && !loading && (
              <div className="md:col-span-3 py-12 text-center text-slate-400 italic text-sm">ไม่มีข้อมูล Blog Post</div>
            )}
          </div>
        ) : activeTab === 'systems' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map(sys => (
              <div key={sys.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                    <Link href={sys.url} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></Link>
                    <button onClick={() => handleEditSystem(sys)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteSystem(sys.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1">{sys.name}</h3>
                <p className="text-slate-500 text-xs mb-4 flex-grow">{sys.description}</p>
                <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest pt-4 border-t border-slate-50 uppercase">
                  URL: {sys.url}
                </div>
              </div>
            ))}
            {systems.length === 0 && !loading && (
              <div className="md:col-span-3 py-12 text-center text-slate-400 italic text-sm">ไม่มีข้อมูลระบบสารสนเทศ</div>
            )}
          </div>
        ) : activeTab === 'media' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-xl font-black text-slate-800 mb-6 font-sans tracking-tight">คลังรูปภาพและสื่อ (Media Library)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {blogs.filter(b => b.image_url).map(blog => (
                <div key={blog.id} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
                  <img src={blog.image_url} alt="Media" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                    <button onClick={() => {navigator.clipboard.writeText(blog.image_url || ''); alert('คัดลอก URL แล้ว');}} className="p-2 bg-white rounded-lg text-slate-900"><LinkIcon className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-blue-400 hover:text-blue-400 transition cursor-pointer">
                <Plus className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-black uppercase">Upload</span>
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 max-w-2xl animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center tracking-tight">
              <Sparkles className="w-6 h-6 mr-3 text-blue-600" /> ปรับแต่งหน้าแรก (Hero Banner)
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">หัวข้อหลัก (Title)</label>
                <input type="text" value={heroSettings.title} onChange={(e) => setHeroSettings({...heroSettings, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">คำบรรยาย (Subtitle)</label>
                <textarea rows={3} value={heroSettings.subtitle} onChange={(e) => setHeroSettings({...heroSettings, subtitle: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ข้อความบนปุ่ม (Button Text)</label>
                <input type="text" value={heroSettings.button_text} onChange={(e) => setHeroSettings({...heroSettings, button_text: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
              </div>
              <button 
                onClick={async () => {
                  const { error } = await supabase.from('settings').upsert({ key: 'hero', value: heroSettings });
                  if (error) alert(error.message);
                  else alert('บันทึกการตั้งค่าแล้ว');
                }}
                className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition mt-4"
              >
                Save Settings
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 italic">เลือกเมนูเพื่อจัดการข้อมูล</div>
        )}
      </main>

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden shadow-blue-900/20">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isEditing ? 'แก้ไขหลักสูตร' : 'เพิ่มหลักสูตรใหม่'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleCourseSubmit} className="p-8 space-y-6 text-slate-700">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ชื่อหลักสูตร</label>
                <input type="text" value={currentCourse.name || ''} onChange={(e) => setCurrentCourse({...currentCourse, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">หมวดหมู่</label>
                  <select value={currentCourse.category || 'การแพทย์'} onChange={(e) => setCurrentCourse({...currentCourse, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="การแพทย์">การแพทย์</option>
                    <option value="กู้ภัย">กู้ภัย</option>
                    <option value="วิชาการ">วิชาการ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">สถานะ</label>
                  <select value={currentCourse.status || 'เปิดรับสมัคร'} onChange={(e) => setCurrentCourse({...currentCourse, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                    <option value="เต็มแล้ว">เต็มแล้ว</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition">Save Course</button>
            </form>
          </div>
        </div>
      )}

      {/* Page Modal */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden shadow-blue-900/20">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isEditing ? 'แก้ไขหน้าเว็บ' : 'สร้างหน้าเว็บใหม่'}</h2>
              <button onClick={() => setIsPageModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handlePageSubmit} className="p-8 space-y-6 text-slate-700 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ชื่อหน้า (Title)</label>
                  <input type="text" value={currentPage.title || ''} onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ชื่อใน URL (Slug)</label>
                  <input type="text" value={currentPage.slug || ''} onChange={(e) => setCurrentPage({...currentPage, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="about-us" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex justify-between">
                  <span>เนื้อหาหน้าเว็บ (Content)</span>
                  <div className="flex space-x-2">
                    <button type="button" onClick={() => insertTag('b', 'page')} className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-slate-600 font-bold">B</button>
                    <button type="button" onClick={() => insertTag('i', 'page')} className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 rounded italic text-slate-600">I</button>
                    <button type="button" onClick={() => insertTag('h2', 'page')} className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-slate-600 font-bold">H2</button>
                    <button type="button" onClick={() => insertTag('p', 'page')} className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-slate-600 font-bold">P</button>
                  </div>
                </label>
                <textarea id="page-content" rows={12} value={currentPage.content || ''} onChange={(e) => setCurrentPage({...currentPage, content: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none font-sans leading-relaxed text-sm" placeholder="พิมพ์เนื้อหาที่นี่..." required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">สถานะการเผยแพร่</label>
                <select value={currentPage.status || 'Published'} onChange={(e) => setCurrentPage({...currentPage, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Published">เผยแพร่สู่สาธารณะ (Published)</option>
                  <option value="Draft">ฉบับร่าง (Draft)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition">Save Page Content</button>
            </form>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden shadow-blue-900/20">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isEditing ? 'แก้ไข Blog Post' : 'สร้าง Blog Post ใหม่'}</h2>
              <button onClick={() => setIsBlogModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleBlogSubmit} className="p-8 space-y-6 text-slate-700 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">หัวข้อ (Title)</label>
                  <input type="text" value={currentBlog.title || ''} onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Slug (URL)</label>
                  <input type="text" value={currentBlog.slug || ''} onChange={(e) => setCurrentBlog({...currentBlog, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="my-blog-post" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">หมวดหมู่</label>
                  <input type="text" value={currentBlog.category || ''} onChange={(e) => setCurrentBlog({...currentBlog, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="News, Knowledge, etc." required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ผู้เขียน</label>
                  <input type="text" value={currentBlog.author || ''} onChange={(e) => setCurrentBlog({...currentBlog, author: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">รูปภาพหน้าปก (URL)</label>
                <input type="text" value={currentBlog.image_url || ''} onChange={(e) => setCurrentBlog({...currentBlog, image_url: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">สรุปสั้นๆ (Summary)</label>
                <textarea rows={2} value={currentBlog.summary || ''} onChange={(e) => setCurrentBlog({...currentBlog, summary: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="สรุปเนื้อหาเบื้องต้น..." required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest flex justify-between">
                  <span>เนื้อหาหลัก (Content - HTML Support)</span>
                  <div className="flex space-x-2">
                    <button type="button" onClick={() => insertTag('b', 'blog')} className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-slate-600">B</button>
                    <button type="button" onClick={() => insertTag('i', 'blog')} className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 rounded italic text-slate-600">I</button>
                    <button type="button" onClick={() => insertTag('h2', 'blog')} className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-slate-600">H2</button>
                    <button type="button" onClick={() => insertTag('p', 'blog')} className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 rounded text-slate-600">P</button>
                  </div>
                </label>
                <textarea id="blog-content" rows={10} value={currentBlog.content || ''} onChange={(e) => setCurrentBlog({...currentBlog, content: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none font-sans leading-relaxed text-sm" placeholder="เขียนเนื้อหาที่นี่..." required />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">สถานะ</label>
                <select value={currentBlog.status || 'Published'} onChange={(e) => setCurrentBlog({...currentBlog, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition">Save Blog Post</button>
            </form>
          </div>
        </div>
      )}

      {/* System Modal */}
      {isSystemModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden shadow-blue-900/20">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isEditing ? 'แก้ไขระบบ' : 'เพิ่มระบบใหม่'}</h2>
              <button onClick={() => setIsSystemModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSystemSubmit} className="p-8 space-y-6 text-slate-700">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ชื่อระบบ</label>
                <input type="text" value={currentSystem.name || ''} onChange={(e) => setCurrentSystem({...currentSystem, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น ระบบ ITEMS" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">คำอธิบาย</label>
                <input type="text" value={currentSystem.description || ''} onChange={(e) => setCurrentSystem({...currentSystem, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="เช่น ข้อมูลสำหรับเจ้าหน้าที่..." required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">URL ของระบบ</label>
                <input type="text" value={currentSystem.url || ''} onChange={(e) => setCurrentSystem({...currentSystem, url: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ชื่อไอคอน (Lucide Icon Name)</label>
                <input type="text" value={currentSystem.icon_name || 'Activity'} onChange={(e) => setCurrentSystem({...currentSystem, icon_name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Activity, ShieldAlert, Globe, etc." />
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition">Save System</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
