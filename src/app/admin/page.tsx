'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2,
  Save, X, LayoutDashboard, BookOpen, Settings,
  LogOut, Activity, Globe, Eye, Loader2, AlertTriangle,
  FileText, Sparkles, Link as LinkIcon, Menu, Lock, Key, Delete,
  ChevronDown, ChevronRight
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
  const [heroSettings, setHeroSettings] = useState<any>({ 
    title: 'ศูนย์ฝึกอบรม NIEM Thailand', 
    subtitle: '', 
    button_text: 'ดูตารางอบรม',
    button2_text: 'ระบบตรวจสอบวุฒิบัตร'
  });
  const [navSettings, setNavSettings] = useState<any[]>([
    { name: 'หน้าแรก', href: '/', tab: 'home' },
    { name: 'หลักสูตร', href: '/', tab: 'courses' },
    { name: 'บทความ (Blog)', href: '/blog', tab: 'blog' },
    { name: 'ระบบสารสนเทศ', href: '/systems', tab: 'systems' },
    { name: 'ค้นหาใบประกาศฯ', href: '/', tab: 'cert' },
  ]);

  const [siteConfig, setSiteConfig] = useState<any>({ 
    name: 'NIEM Center', 
    logo_url: '' 
  });
  const [contactInfo, setContactInfo] = useState<any>({ 
    phone: '02-xxx-xxxx', 
    email: 'contact@niem.go.th',
    facebook: '',
    address: '' 
  });
  const [footerConfig, setFooterConfig] = useState<any>({
    about: 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.) เป็นหน่วยงานของรัฐที่มีหน้าที่คุ้มครองสิทธิในการเข้าถึงระบบการแพทย์ฉุกเฉินอย่างทั่วถึง เท่าเทียม และมีมาตรฐาน'
  });

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPagesMenuOpen, setIsPagesMenuOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Current Item state
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [currentPage, setCurrentPage] = useState<Partial<PageData>>({});
  const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({});
  const [currentSystem, setCurrentSystem] = useState<Partial<SystemItem>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = async (val: string) => {
    // SHA-256 Hash of "140433"
    const targetHash = "6b5b5ebf8358ece5942f4f8a9b3fc65823b6b8ce93efaef74acee7d8f0ca013e";
    
    // Simple hash function using Web Crypto API
    const msgBuffer = new TextEncoder().encode(val);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === targetHash) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleKeyClick = (key: string) => {
    if (pin.length < 6) {
      const newPin = pin + key;
      setPin(newPin);
      if (newPin.length === 6) {
        handlePinSubmit(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

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
        const { data: hero } = await supabase.from('settings').select('*').eq('key', 'hero').single();
        if (hero) setHeroSettings(hero.value);
        
        const { data: nav } = await supabase.from('settings').select('*').eq('key', 'navigation').single();
        if (nav) setNavSettings(nav.value);

        const { data: site } = await supabase.from('settings').select('*').eq('key', 'site_config').single();
        if (site) setSiteConfig(site.value);

        const { data: contact } = await supabase.from('settings').select('*').eq('key', 'contact_info').single();
        if (contact) setContactInfo(contact.value);

        const { data: footer } = await supabase.from('settings').select('*').eq('key', 'footer_config').single();
        if (footer) setFooterConfig(footer.value);
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
      const { id, ...updateData } = currentCourse;
      const { error } = await supabase.from('courses').update(updateData).eq('id', id);
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
      const { id, ...updateData } = currentPage;
      const { error } = await supabase.from('pages').update({ ...updateData, updated_at: now }).eq('id', id);
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
      const { id, ...updateData } = currentBlog;
      const { error } = await supabase.from('blogs').update({ ...updateData, updated_at: now }).eq('id', id);
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
      const { id, ...updateData } = currentSystem;
      const { error } = await supabase.from('systems').update({ ...updateData, updated_at: now }).eq('id', id);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full animate-pulse "></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl flex flex-col items-center">
            <div className="w-20 h-20 bg-[var(--accent)] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-[var(--accent-glow)] transform hover:rotate-12 transition">
              <Lock className="w-10 h-10 text-[var(--accent-ink)]" />
            </div>
            
            <h1 className="text-2xl font-medium text-white mb-2 tracking-tight">Admin Authentication</h1>
            <p className="text-[var(--text-secondary)] text-sm mb-10 font-medium uppercase tracking-[0.2em]">Restricted Area</p>

            {/* PIN Display */}
            <div className={`flex gap-3 mb-12 ${pinError ? 'animate-bounce text-red-500' : ''}`}>
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    pin.length > i 
                      ? (pinError ? 'bg-red-500 border-red-500 scale-125' : 'bg-[var(--accent)] border-[var(--accent)] scale-125 shadow-[0_0_15px_var(--accent-glow)]') 
                      : 'border-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'empty', 0, 'back'].map((key, i) => (
                <button
                  key={i}
                  disabled={key === 'empty'}
                  onClick={() => key === 'back' ? handleBackspace() : handleKeyClick(key.toString())}
                  className={`h-16 rounded-2xl flex items-center justify-center text-xl font-semibold transition-all active:scale-95 ${
                    key === 'empty' 
                      ? 'opacity-0 cursor-default' 
                      : (key === 'back' 
                          ? 'bg-white/5 text-[var(--text-secondary)] hover:bg-red-500/20 hover:text-red-400' 
                          : 'bg-white/5 text-white hover:bg-white/10 border border-white/5')
                  }`}
                >
                  {key === 'back' ? <Delete className="w-6 h-6" /> : (key === 'empty' ? '' : key)}
                </button>
              ))}
            </div>

            {pinError && (
              <p className="mt-8 text-red-400 text-xs font-medium uppercase tracking-[0.16em] animate-pulse">
                Incorrect PIN. Please try again.
              </p>
            )}
            
            <Link href="/" className="mt-10 text-[var(--text-secondary)] text-xs font-bold hover:text-white transition flex items-center">
              <X className="w-3 h-3 mr-2" /> Cancel & Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex font-sans relative">
      {/* Sidebar - Desktop */}
      <aside className={`bg-[var(--surface-ink)] text-white lg:flex flex-col sticky top-0 h-screen transition-all duration-300 z-[60] 
        ${isSidebarOpen ? 'fixed inset-0 w-full' : 'hidden lg:w-64'}`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center">
            {siteConfig.logo_url ? (
              <img src={siteConfig.logo_url} alt="Logo" className="w-8 h-8 mr-2 object-contain" />
            ) : (
              <Activity className="w-8 h-8 mr-2 text-[var(--accent)]" />
            )}
            <span className="font-bold text-xl tracking-tight text-white uppercase italic">{siteConfig.name} Admin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'dashboard' ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-lg shadow-[var(--accent-glow)]' : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" /> แผงควบคุม (Dashboard)
          </button>
          
          <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mt-6 mb-2 px-2 italic">การจัดการ</div>
          
          <button 
            onClick={() => setIsPagesMenuOpen(!isPagesMenuOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-xl font-medium transition ${['pages', 'blogs', 'courses', 'systems'].includes(activeTab) ? 'text-white' : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'}`}
          >
            <div className="flex items-center">
              <Globe className="w-5 h-5 mr-3" /> หน้าเว็บ (Page)
            </div>
            {isPagesMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {isPagesMenuOpen && (
            <div className="ml-4 space-y-1 mt-1 border-l border-white/10 pl-4 animate-in slide-in-from-top-2 duration-300">
              <button 
                onClick={() => setActiveTab('pages')}
                className={`flex items-center w-full p-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'pages' ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                จัดการหน้าเว็บ (Static)
              </button>
              <button 
                onClick={() => setActiveTab('blogs')}
                className={`flex items-center w-full p-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'blogs' ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                บทความ (Posts)
              </button>
              <button 
                onClick={() => setActiveTab('courses')}
                className={`flex items-center w-full p-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'courses' ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                จัดการหลักสูตร
              </button>
              <button 
                onClick={() => setActiveTab('systems')}
                className={`flex items-center w-full p-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'systems' ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30' : 'text-[var(--text-secondary)] hover:text-white'}`}
              >
                ระบบสารสนเทศ
              </button>
            </div>
          )}
          
          <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mt-6 mb-2 px-2 italic">ทรัพยากร</div>
          <button 
            onClick={() => setActiveTab('media')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'media' ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-lg shadow-[var(--accent-glow)]' : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'}`}
          >
            <Sparkles className="w-5 h-5 mr-3 text-indigo-400" /> คลังสื่อ (Media)
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'settings' ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-lg shadow-[var(--accent-glow)]' : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'}`}
          >
            <Settings className="w-5 h-5 mr-3" /> ตั้งค่าทั่วไป (Settings)
          </button>
        </nav>

        <div className="p-4 border-t border-white/10 pb-8">
          <button 
            onClick={() => {
              sessionStorage.removeItem('admin_authenticated');
              window.location.href = '/';
            }}
            className="flex items-center w-full p-3 text-[var(--text-secondary)] hover:text-white transition group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:text-red-400" /> ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto overflow-y-auto h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {activeTab === 'dashboard' ? 'CMS Overview' : activeTab === 'courses' ? 'จัดการหลักสูตรการอบรม' : activeTab === 'pages' ? 'จัดการเนื้อหาหน้าเว็บ' : activeTab === 'blogs' ? 'จัดการ Blog Posts' : activeTab === 'settings' ? 'ตั้งค่าระบบ' : 'จัดการระบบสารสนเทศ'}
              </h1>
              <p className="text-[var(--text-secondary)] text-xs mt-1">ยินดีต้อนรับสู่ระบบจัดการเนื้อหา (CMS)</p>
            </div>
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-[var(--bg-secondary)] border border-[var(--rule)] rounded-xl text-[var(--text-secondary)]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchData}
              className="p-3 bg-[var(--bg-secondary)] border border-[var(--rule)] rounded-xl hover:bg-[var(--bg-tertiary)] transition"
              title="Refresh Data"
            >
              <Loader2 className={`w-5 h-5 text-[var(--text-secondary)] ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => activeTab === 'courses' ? (setIsEditing(false), setCurrentCourse({}), setIsModalOpen(true)) : activeTab === 'pages' ? handleCreatePage() : activeTab === 'blogs' ? handleCreateBlog() : handleCreateSystem()}
              className="bg-[var(--accent)] hover:bg-[var(--accent-bright)] text-[var(--accent-ink)] px-8 py-3 rounded-xl font-bold shadow-2xl shadow-[var(--accent-glow)] transition flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5 mr-2" /> {activeTab === 'courses' ? 'เพิ่มหลักสูตรใหม่' : activeTab === 'pages' ? 'สร้างหน้าเว็บใหม่' : activeTab === 'blogs' ? 'สร้าง Blog Post ใหม่' : 'เพิ่มระบบใหม่'}
            </button>
          </div>
        </header>

        {dbError && (
          <div className="mb-8 p-6 bg-rose-500/5 border border-rose-500/20 rounded-3xl flex items-start text-rose-600 dark:text-rose-400 shadow-sm">
            <AlertTriangle className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg">ไม่สามารถเชื่อมต่อฐานข้อมูลได้!</h3>
              <p className="text-sm mt-1 mb-4 opacity-80">
                สาเหตุอาจเกิดจาก: 1. ยังไม่ได้ตั้งค่า API Key ใน .env.local หรือ 2. ยังไม่ได้สร้างตารางใน Supabase
              </p>
              <div className="bg-[var(--surface-ink)] p-4 rounded-xl text-xs font-mono text-[var(--accent-bright)] overflow-x-auto">
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
            <Loader2 className="w-12 h-12 text-[var(--accent-bright)] animate-spin" />
          </div>
        ) : activeTab === 'dashboard' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'หลักสูตรทั้งหมด', count: courses.length, icon: <BookOpen className="w-5 h-5" strokeWidth={1.6} />, accent: true },
                { title: 'บทความข่าวสาร', count: blogs.length, icon: <FileText className="w-5 h-5" strokeWidth={1.6} />, accent: false },
                { title: 'หน้าเว็บทั้งหมด', count: pages.length, icon: <Globe className="w-5 h-5" strokeWidth={1.6} />, accent: false },
                { title: 'ระบบภายนอก', count: systems.length, icon: <Settings className="w-5 h-5" strokeWidth={1.6} />, accent: false },
              ].map((stat, i) => (
                <div key={i} className="ed-card p-7 flex flex-col justify-between min-h-[160px]">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.accent ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'}`}>
                      {stat.icon}
                    </div>
                    <div className="kicker text-[var(--text-tertiary)]">№ {String(i + 1).padStart(2, '0')}</div>
                  </div>
                  <div className="mt-6">
                    <div className="text-4xl font-medium tracking-[-0.03em] text-[var(--text-primary)]">{stat.count}</div>
                    <div className="kicker mt-2">{stat.title}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[var(--bg-secondary)] p-8 rounded-3xl border border-[var(--rule)] shadow-sm">
                <h2 className="text-xl font-medium tracking-tight text-[var(--text-primary)] mb-6 flex items-center">
                  <Plus className="w-5 h-5 mr-3 text-[var(--accent-deep)] dark:text-[var(--accent)]" /> ทางลัดจัดการข้อมูล
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleCreateBlog} className="p-6 bg-[var(--bg-primary)] rounded-2xl border border-[var(--rule)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] transition group text-left">
                    <FileText className="w-6 h-6 mb-3 text-[var(--accent-deep)] dark:text-[var(--accent)] group-hover:text-[var(--accent-ink)] transition" />
                    <div className="font-bold">เขียนข่าวใหม่</div>
                    <div className="text-[10px] uppercase font-medium tracking-[0.14em] opacity-60">Add Blog Post</div>
                  </button>
                  <button onClick={() => setIsModalOpen(true)} className="p-6 bg-[var(--bg-primary)] rounded-2xl border border-[var(--rule)] hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] hover:border-[var(--accent)] transition group text-left">
                    <BookOpen className="w-6 h-6 mb-3 text-[var(--accent-deep)] dark:text-[var(--accent)] group-hover:text-[var(--accent-ink)] transition" />
                    <div className="font-bold">เพิ่มคอร์สอบรม</div>
                    <div className="text-[10px] uppercase font-medium tracking-[0.14em] opacity-60">Add Training</div>
                  </button>
                </div>
              </div>

              <div className="bg-[var(--surface-ink)] p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--accent)]/10 backdrop-blur-3xl"></div>
                <div className="relative z-10">
                  <h2 className="text-xl font-medium tracking-tight mb-6 flex items-center">
                    <Activity className="w-5 h-5 mr-3 text-[var(--accent)]" /> สถานะเซิร์ฟเวอร์
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-sm font-bold opacity-60">Supabase Connection</span>
                      <span className="flex items-center text-[var(--accent)] text-xs font-medium tracking-[0.14em] uppercase"><div className="w-2 h-2 bg-[var(--accent)] rounded-full mr-2 animate-pulse"></div> ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-sm font-bold opacity-60">API Status</span>
                      <span className="flex items-center text-[var(--accent)] text-xs font-medium tracking-[0.14em] uppercase"><div className="w-2 h-2 bg-[var(--accent)] rounded-full mr-2"></div> HEALTHY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'courses' ? (
          <>
            <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--rule)] overflow-hidden">
              <div className="p-4 border-b border-[var(--rule)] flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-grow max-w-md w-full">
                  <Search className="w-5 h-5 text-[var(--text-tertiary)] absolute left-4 top-3" />
                  <input type="text" placeholder="ค้นหาชื่อหลักสูตร..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-tertiary)] border-none outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                <thead className="bg-[var(--bg-primary)] text-[var(--text-secondary)] text-[10px] uppercase font-medium tracking-[0.14em]">
                  <tr>
                    <th className="px-8 py-4">Name</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCourses.map(course => (
                    <tr key={course.id} className="hover:bg-[var(--accent-glow)]/50 group transition">
                      <td className="px-8 py-4 font-bold text-[var(--text-primary)]">{course.name}</td>
                      <td className="px-8 py-4 text-xs font-bold text-[var(--text-secondary)]">{course.category}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.14em] ${course.status === 'เปิดรับสมัคร' ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-8 py-4 flex justify-center space-x-2">
                        <button onClick={() => handleEditCourse(course)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:text-[var(--accent)] hover:bg-[var(--accent-glow)] rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeTab === 'pages' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map(page => (
              <div key={page.id} className="bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--rule)] p-6 flex flex-col hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-[0.16em] ${page.status === 'Published' ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                    {page.status}
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                    <Link href={`/${page.slug}`} target="_blank" className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:text-[var(--accent)] hover:bg-[var(--accent-glow)] rounded-lg"><Eye className="w-4 h-4" /></Link>
                    <button onClick={() => handleEditPage(page)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:text-[var(--accent)] hover:bg-[var(--accent-glow)] rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeletePage(page.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[var(--text-primary)] mb-2">{page.title}</h3>
                <code className="text-xs text-[var(--accent-deep)] dark:text-[var(--accent)] bg-[var(--accent-glow)] px-2 py-1 rounded mb-4 inline-block w-fit">/{page.slug}</code>
                <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-6 flex-grow">{page.content}</p>
                <div className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-[0.16em] pt-4 border-t border-[var(--rule)]">
                  LATEST UPDATE: {new Date(page.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {pages.length === 0 && !loading && (
              <div className="md:col-span-3 py-12 text-center text-[var(--text-secondary)] italic text-sm">ไม่มีข้อมูลหน้าเว็บ</div>
            )}
          </div>
        ) : activeTab === 'blogs' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(blog => (
              <div key={blog.id} className="bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--rule)] p-6 flex flex-col hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-[0.16em] ${blog.status === 'Published' ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'}`}>
                    {blog.status}
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:text-[var(--accent)] hover:bg-[var(--accent-glow)] rounded-lg"><Eye className="w-4 h-4" /></Link>
                    <button onClick={() => handleEditBlog(blog)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:text-[var(--accent)] hover:bg-[var(--accent-glow)] rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {blog.image_url && (
                  <div className="h-32 w-full bg-[var(--bg-tertiary)] rounded-xl mb-4 overflow-hidden">
                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1">{blog.title}</h3>
                <div className="text-xs text-[var(--text-secondary)] mb-2">{blog.category} • โดย {blog.author}</div>
                <p className="text-[var(--text-secondary)] text-xs line-clamp-2 mb-4 flex-grow">{blog.summary}</p>
                <div className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-[0.16em] pt-4 border-t border-[var(--rule)]">
                  POSTED: {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
            {blogs.length === 0 && !loading && (
              <div className="md:col-span-3 py-12 text-center text-[var(--text-secondary)] italic text-sm">ไม่มีข้อมูล Blog Post</div>
            )}
          </div>
        ) : activeTab === 'systems' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map(sys => (
              <div key={sys.id} className="bg-[var(--bg-secondary)] rounded-2xl shadow-sm border border-[var(--rule)] p-6 flex flex-col hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-[var(--accent-glow)] p-3 rounded-xl text-[var(--accent-deep)] dark:text-[var(--accent)]">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                    <Link href={sys.url} target="_blank" className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:text-[var(--accent)] hover:bg-[var(--accent-glow)] rounded-lg"><Eye className="w-4 h-4" /></Link>
                    <button onClick={() => handleEditSystem(sys)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:text-[var(--accent)] hover:bg-[var(--accent-glow)] rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteSystem(sys.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1">{sys.name}</h3>
                <p className="text-[var(--text-secondary)] text-xs mb-4 flex-grow">{sys.description}</p>
                <div className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-[0.16em] pt-4 border-t border-[var(--rule)] uppercase">
                  URL: {sys.url}
                </div>
              </div>
            ))}
            {systems.length === 0 && !loading && (
              <div className="md:col-span-3 py-12 text-center text-[var(--text-secondary)] italic text-sm">ไม่มีข้อมูลระบบสารสนเทศ</div>
            )}
          </div>
        ) : activeTab === 'media' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="display-md text-[var(--text-primary)] mb-6 font-sans">คลังรูปภาพและสื่อ (Media Library)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {blogs.filter(b => b.image_url).map(blog => (
                <div key={blog.id} className="aspect-square rounded-2xl overflow-hidden border border-[var(--rule)] shadow-sm relative group">
                  <img src={blog.image_url} alt="Media" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
                    <button onClick={() => {navigator.clipboard.writeText(blog.image_url || ''); alert('คัดลอก URL แล้ว');}} className="p-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] border border-[var(--rule)]"><LinkIcon className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <div className="aspect-square rounded-2xl border-2 border-dashed border-[var(--rule)] flex flex-col items-center justify-center text-[var(--text-tertiary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition cursor-pointer">
                <Plus className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-medium uppercase tracking-[0.14em]">Upload</span>
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            {/* 1. Brand & Identity */}
            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--rule)] p-10 shadow-sm">
              <h2 className="display-md text-[var(--text-primary)] mb-8 flex items-center">
                <Globe className="w-6 h-6 mr-3 text-[var(--accent-deep)] dark:text-[var(--accent)]" /> ข้อมูลทั่วไป (Brand & Identity)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">ชื่อเว็บไซต์ (Site Name)</label>
                  <input type="text" value={siteConfig.name} onChange={(e) => setSiteConfig({...siteConfig, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">URL โลโก้ (Logo URL)</label>
                  <input type="text" value={siteConfig.logo_url} onChange={(e) => setSiteConfig({...siteConfig, logo_url: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="https://..." />
                </div>
              </div>
              <button 
                onClick={async () => {
                  const { error } = await supabase.from('settings').upsert({ key: 'site_config', value: siteConfig });
                  if (error) alert(error.message);
                  else alert('บันทึกข้อมูลทั่วไปแล้ว');
                }}
                className="mt-8 px-8 py-4 btn-primary"
              >
                Save Identity
              </button>
            </div>

            {/* 2. Hero Banner */}
            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--rule)] p-10 shadow-sm">
              <h2 className="display-md text-[var(--text-primary)] mb-8 flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-[var(--accent-deep)] dark:text-[var(--accent)]" /> ปรับแต่งหน้าแรก (Hero Banner)
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">หัวข้อหลัก (Title)</label>
                  <input type="text" value={heroSettings.title} onChange={(e) => setHeroSettings({...heroSettings, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">คำบรรยาย (Subtitle)</label>
                  <textarea rows={3} value={heroSettings.subtitle} onChange={(e) => setHeroSettings({...heroSettings, subtitle: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm leading-relaxed" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="kicker text-[var(--text-secondary)]">ข้อความปุ่มที่ 1</label>
                    <input type="text" value={heroSettings.button_text} onChange={(e) => setHeroSettings({...heroSettings, button_text: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="kicker text-[var(--text-secondary)]">ข้อความปุ่มที่ 2</label>
                    <input type="text" value={heroSettings.button2_text || ''} onChange={(e) => setHeroSettings({...heroSettings, button2_text: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none font-bold" />
                  </div>
                </div>
              </div>
              <button 
                onClick={async () => {
                  const { error } = await supabase.from('settings').upsert({ key: 'hero', value: heroSettings });
                  if (error) alert(error.message);
                  else alert('บันทึกการตั้งค่า Hero Banner แล้ว');
                }}
                className="mt-8 px-8 py-4 btn-primary"
              >
                Save Hero Settings
              </button>
            </div>

            {/* 3. Navigation */}
            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--rule)] p-10 shadow-sm">
              <h2 className="display-md text-[var(--text-primary)] flex items-center mb-8">
                <LayoutDashboard className="w-6 h-6 mr-3 text-[var(--accent-deep)] dark:text-[var(--accent)]" /> เมนูนำทาง (Navigation)
              </h2>
              <div className="space-y-4">
                {navSettings.map((item, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-5 bg-[var(--bg-primary)] border border-[var(--rule)] rounded-2xl group">
                    <div className="w-8 h-8 flex items-center justify-center bg-[var(--bg-secondary)] rounded-lg text-[var(--text-secondary)] font-medium shadow-sm border border-[var(--rule)]">
                      {index + 1}
                    </div>
                    <input type="text" value={item.name} onChange={(e) => {
                      const newNav = [...navSettings];
                      newNav[index].name = e.target.value;
                      setNavSettings(newNav);
                    }} className="flex-grow max-w-xs px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--rule)] outline-none text-sm font-bold" placeholder="ชื่อเมนู" />
                    <input type="text" value={item.href} onChange={(e) => {
                      const newNav = [...navSettings];
                      newNav[index].href = e.target.value;
                      setNavSettings(newNav);
                    }} className="flex-grow px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--rule)] outline-none text-sm" placeholder="Link (/blog)" />
                    
                    <div className="flex gap-2">
                      <button 
                         onClick={() => {
                          const newNav = navSettings.filter((_, i) => i !== index);
                          setNavSettings(newNav);
                         }}
                         className="p-2 text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        disabled={index === 0}
                        onClick={() => {
                          const newNav = [...navSettings];
                          [newNav[index-1], newNav[index]] = [newNav[index], newNav[index-1]];
                          setNavSettings(newNav);
                        }}
                        className="p-2 bg-[var(--bg-secondary)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:hover:text-[var(--accent)] disabled:opacity-20 transition shadow-sm border border-[var(--rule)]"
                      >
                        <Plus className="w-4 h-4 transform rotate-[-90deg]" />
                      </button>
                      <button 
                         disabled={index === navSettings.length - 1}
                         onClick={() => {
                           const newNav = [...navSettings];
                           [newNav[index+1], newNav[index]] = [newNav[index], newNav[index+1]];
                           setNavSettings(newNav);
                         }}
                        className="p-2 bg-[var(--bg-secondary)] rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent-deep)] dark:hover:text-[var(--accent)] disabled:opacity-20 transition shadow-sm border border-[var(--rule)]"
                      >
                        <Plus className="w-4 h-4 transform rotate-90deg]" />
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setNavSettings([...navSettings, { name: 'เมนูใหม่', href: '/', tab: '' }])}
                  className="w-full py-4 border-2 border-dashed border-[var(--rule)] rounded-2xl text-[var(--text-secondary)] font-bold hover:border-[var(--accent)] hover:text-[var(--accent)] transition flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> เพิ่มปุ่มเมนู
                </button>
              </div>
              <button 
                onClick={async () => {
                  const { error } = await supabase.from('settings').upsert({ key: 'navigation', value: navSettings });
                  if (error) alert(error.message);
                  else alert('บันทึกเมนูนำทางแล้ว');
                }}
                className="mt-8 btn-ink"
              >
                Save Navigation
              </button>
            </div>

            {/* 4. Contact Info */}
            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--rule)] p-10 shadow-sm">
              <h2 className="display-md text-[var(--text-primary)] mb-8 flex items-center">
                <LinkIcon className="w-6 h-6 mr-3 text-[var(--accent-deep)] dark:text-[var(--accent)]" /> ข้อมูลติดต่อ (Contact Info)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">เบอร์โทรศัพท์</label>
                  <input type="text" value={contactInfo.phone} onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">อีเมล</label>
                  <input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">Facebook (URL)</label>
                  <input type="text" value={contactInfo.facebook} onChange={(e) => setContactInfo({...contactInfo, facebook: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">ที่อยู่</label>
                  <textarea rows={2} value={contactInfo.address} onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm" />
                </div>
              </div>
              <button 
                onClick={async () => {
                  const { error } = await supabase.from('settings').upsert({ key: 'contact_info', value: contactInfo });
                  if (error) alert(error.message);
                  else alert('บันทึกข้อมูลติดต่อแล้ว');
                }}
                className="mt-8 px-8 py-4 btn-primary"
              >
                Save Contact
              </button>
            </div>

            {/* 5. Footer Settings */}
            <div className="bg-[var(--bg-secondary)] rounded-3xl border border-[var(--rule)] p-10 shadow-sm">
              <h2 className="display-md text-[var(--text-primary)] mb-8 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-[var(--accent-deep)] dark:text-[var(--accent)]" /> ส่วนท้ายเว็บไซต์ (Footer Customization)
              </h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">ข้อความเกี่ยวกับเรา (About Text)</label>
                  <textarea rows={4} value={footerConfig.about} onChange={(e) => setFooterConfig({...footerConfig, about: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm leading-relaxed" />
                </div>
              </div>
              <button 
                onClick={async () => {
                  const { error } = await supabase.from('settings').upsert({ key: 'footer_config', value: footerConfig });
                  if (error) alert(error.message);
                  else alert('บันทึกการตั้งค่า Footer แล้ว');
                }}
                className="mt-8 px-8 py-4 btn-primary"
              >
                Save Footer Settings
              </button>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-[var(--text-secondary)] italic">เลือกเมนูเพื่อจัดการข้อมูล</div>
        )}
      </main>

      {/* Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[var(--surface-ink)]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden shadow-[var(--accent-glow)]">
            <div className="p-8 border-b border-[var(--rule)] flex justify-between items-center bg-[var(--bg-primary)]/50">
              <h2 className="display-md text-[var(--text-primary)]">{isEditing ? 'แก้ไขหลักสูตร' : 'เพิ่มหลักสูตรใหม่'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleCourseSubmit} className="p-8 space-y-6 text-[var(--text-primary)]">
              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">ชื่อหลักสูตร</label>
                <input type="text" value={currentCourse.name || ''} onChange={(e) => setCurrentCourse({...currentCourse, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">หมวดหมู่</label>
                  <select value={currentCourse.category || 'การแพทย์'} onChange={(e) => setCurrentCourse({...currentCourse, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none">
                    <option value="การแพทย์">การแพทย์</option>
                    <option value="กู้ภัย">กู้ภัย</option>
                    <option value="วิชาการ">วิชาการ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">สถานะ</label>
                  <select value={currentCourse.status || 'เปิดรับสมัคร'} onChange={(e) => setCurrentCourse({...currentCourse, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none">
                    <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                    <option value="เต็มแล้ว">เต็มแล้ว</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 btn-primary">Save Course</button>
            </form>
          </div>
        </div>
      )}

      {/* Page Modal */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[var(--surface-ink)]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden shadow-[var(--accent-glow)]">
            <div className="p-8 border-b border-[var(--rule)] flex justify-between items-center bg-[var(--bg-primary)]/50">
              <h2 className="display-md text-[var(--text-primary)]">{isEditing ? 'แก้ไขหน้าเว็บ' : 'สร้างหน้าเว็บใหม่'}</h2>
              <button onClick={() => setIsPageModalOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handlePageSubmit} className="p-8 space-y-6 text-[var(--text-primary)] max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">ชื่อหน้า (Title)</label>
                  <input type="text" value={currentPage.title || ''} onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">ชื่อใน URL (Slug)</label>
                  <input type="text" value={currentPage.slug || ''} onChange={(e) => setCurrentPage({...currentPage, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="about-us" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)] flex justify-between">
                  <span>เนื้อหาหน้าเว็บ (Content)</span>
                  <div className="flex space-x-2">
                    <button type="button" onClick={() => insertTag('b', 'page')} className="px-2 py-0.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-glow)] rounded text-[var(--text-secondary)] font-bold">B</button>
                    <button type="button" onClick={() => insertTag('i', 'page')} className="px-2 py-0.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-glow)] rounded italic text-[var(--text-secondary)]">I</button>
                    <button type="button" onClick={() => insertTag('h2', 'page')} className="px-2 py-0.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-glow)] rounded text-[var(--text-secondary)] font-bold">H2</button>
                    <button type="button" onClick={() => insertTag('p', 'page')} className="px-2 py-0.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-glow)] rounded text-[var(--text-secondary)] font-bold">P</button>
                  </div>
                </label>
                <textarea id="page-content" rows={12} value={currentPage.content || ''} onChange={(e) => setCurrentPage({...currentPage, content: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none font-sans leading-relaxed text-sm" placeholder="พิมพ์เนื้อหาที่นี่..." required />
              </div>
              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">สถานะการเผยแพร่</label>
                <select value={currentPage.status || 'Published'} onChange={(e) => setCurrentPage({...currentPage, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none">
                  <option value="Published">เผยแพร่สู่สาธารณะ (Published)</option>
                  <option value="Draft">ฉบับร่าง (Draft)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 btn-primary">Save Page Content</button>
            </form>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[var(--surface-ink)]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden shadow-[var(--accent-glow)]">
            <div className="p-8 border-b border-[var(--rule)] flex justify-between items-center bg-[var(--bg-primary)]/50">
              <h2 className="display-md text-[var(--text-primary)]">{isEditing ? 'แก้ไข Blog Post' : 'สร้าง Blog Post ใหม่'}</h2>
              <button onClick={() => setIsBlogModalOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleBlogSubmit} className="p-8 space-y-6 text-[var(--text-primary)] max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">หัวข้อ (Title)</label>
                  <input type="text" value={currentBlog.title || ''} onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">Slug (URL)</label>
                  <input type="text" value={currentBlog.slug || ''} onChange={(e) => setCurrentBlog({...currentBlog, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="my-blog-post" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">หมวดหมู่</label>
                  <input type="text" value={currentBlog.category || ''} onChange={(e) => setCurrentBlog({...currentBlog, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="News, Knowledge, etc." required />
                </div>
                <div className="space-y-2">
                  <label className="kicker text-[var(--text-secondary)]">ผู้เขียน</label>
                  <input type="text" value={currentBlog.author || ''} onChange={(e) => setCurrentBlog({...currentBlog, author: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">รูปภาพหน้าปก (URL)</label>
                <input type="text" value={currentBlog.image_url || ''} onChange={(e) => setCurrentBlog({...currentBlog, image_url: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">สรุปสั้นๆ (Summary)</label>
                <textarea rows={2} value={currentBlog.summary || ''} onChange={(e) => setCurrentBlog({...currentBlog, summary: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none text-sm" placeholder="สรุปเนื้อหาเบื้องต้น..." required />
              </div>

              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)] flex justify-between">
                  <span>เนื้อหาหลัก (Content - HTML Support)</span>
                  <div className="flex space-x-2">
                    <button type="button" onClick={() => insertTag('b', 'blog')} className="px-2 py-0.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-glow)] rounded text-[var(--text-secondary)]">B</button>
                    <button type="button" onClick={() => insertTag('i', 'blog')} className="px-2 py-0.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-glow)] rounded italic text-[var(--text-secondary)]">I</button>
                    <button type="button" onClick={() => insertTag('h2', 'blog')} className="px-2 py-0.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-glow)] rounded text-[var(--text-secondary)]">H2</button>
                    <button type="button" onClick={() => insertTag('p', 'blog')} className="px-2 py-0.5 bg-[var(--bg-tertiary)] hover:bg-[var(--accent-glow)] rounded text-[var(--text-secondary)]">P</button>
                  </div>
                </label>
                <textarea id="blog-content" rows={10} value={currentBlog.content || ''} onChange={(e) => setCurrentBlog({...currentBlog, content: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none font-sans leading-relaxed text-sm" placeholder="เขียนเนื้อหาที่นี่..." required />
              </div>

              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">สถานะ</label>
                <select value={currentBlog.status || 'Published'} onChange={(e) => setCurrentBlog({...currentBlog, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none">
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <button type="submit" className="w-full py-4 btn-primary">Save Blog Post</button>
            </form>
          </div>
        </div>
      )}

      {/* System Modal */}
      {isSystemModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[var(--surface-ink)]/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[var(--bg-secondary)] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden shadow-[var(--accent-glow)]">
            <div className="p-8 border-b border-[var(--rule)] flex justify-between items-center bg-[var(--bg-primary)]/50">
              <h2 className="display-md text-[var(--text-primary)]">{isEditing ? 'แก้ไขระบบ' : 'เพิ่มระบบใหม่'}</h2>
              <button onClick={() => setIsSystemModalOpen(false)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-secondary)] rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSystemSubmit} className="p-8 space-y-6 text-[var(--text-primary)]">
              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">ชื่อระบบ</label>
                <input type="text" value={currentSystem.name || ''} onChange={(e) => setCurrentSystem({...currentSystem, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="เช่น ระบบ ITEMS" required />
              </div>
              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">คำอธิบาย</label>
                <input type="text" value={currentSystem.description || ''} onChange={(e) => setCurrentSystem({...currentSystem, description: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="เช่น ข้อมูลสำหรับเจ้าหน้าที่..." required />
              </div>
              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">URL ของระบบ</label>
                <input type="text" value={currentSystem.url || ''} onChange={(e) => setCurrentSystem({...currentSystem, url: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="https://..." required />
              </div>
              <div className="space-y-2">
                <label className="kicker text-[var(--text-secondary)]">ชื่อไอคอน (Lucide Icon Name)</label>
                <input type="text" value={currentSystem.icon_name || 'Activity'} onChange={(e) => setCurrentSystem({...currentSystem, icon_name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-[var(--bg-tertiary)] border-none focus:ring-2 focus:ring-[var(--accent)] outline-none" placeholder="Activity, ShieldAlert, Globe, etc." />
              </div>
              <button type="submit" className="w-full py-4 btn-primary">Save System</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
