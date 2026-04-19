'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2,
  Save, X, LayoutDashboard, BookOpen, Settings,
  LogOut, Activity, Globe, Eye
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: number;
  name: string;
  category: string;
  status: string;
  dateAdded: string;
}

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState<Course[]>([]);
  const [pages, setPages] = useState<PageData[]>([]);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Current Item state
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [currentPage, setCurrentPage] = useState<Partial<PageData>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Load data
  useEffect(() => {
    // Courses
    const savedCourses = localStorage.getItem('niem_courses');
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    
    // Pages
    const savedPages = localStorage.getItem('niem_pages');
    if (savedPages) {
      setPages(JSON.parse(savedPages));
    } else {
      const initialPages = [
        { id: 1, title: 'เกี่ยวกับเรา', slug: 'about', content: 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.) เป็นส่วนงานที่มีภารกิจหลักในการบริหารจัดการระบบการแพทย์ฉุกเฉิน...', status: 'Published', updatedAt: '2026-04-19' },
      ];
      setPages(initialPages);
      localStorage.setItem('niem_pages', JSON.stringify(initialPages));
    }
  }, []);

  const saveCourses = (updated: Course[]) => {
    setCourses(updated);
    localStorage.setItem('niem_courses', JSON.stringify(updated));
  };

  const savePages = (updated: PageData[]) => {
    setPages(updated);
    localStorage.setItem('niem_pages', JSON.stringify(updated));
  };

  // Course Handlers
  const handleEditCourse = (course: Course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (id: number) => {
    if (confirm('ยืนยันการลบหลักสูตร?')) saveCourses(courses.filter(c => c.id !== id));
  };

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      saveCourses(courses.map(c => c.id === currentCourse.id ? (currentCourse as Course) : c));
    } else {
      saveCourses([...courses, { ...currentCourse, id: Date.now(), dateAdded: new Date().toISOString().split('T')[0] } as Course]);
    }
    setIsModalOpen(false);
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

  const handleDeletePage = (id: number) => {
    if (confirm('ยืนยันการลบหน้าเว็บนี้?')) savePages(pages.filter(p => p.id !== id));
  };

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    if (isEditing) {
      savePages(pages.map(p => p.id === currentPage.id ? { ...currentPage, updatedAt: now } as PageData : p));
    } else {
      savePages([...pages, { ...currentPage, id: Date.now(), updatedAt: now } as PageData]);
    }
    setIsPageModalOpen(false);
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
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">เมนูจัดการระบบ</div>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BookOpen className="w-5 h-5 mr-3" /> จัดการหลักสูตร
          </button>
          <button 
            onClick={() => setActiveTab('pages')}
            className={`flex items-center w-full p-3 rounded-xl font-medium transition ${activeTab === 'pages' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Globe className="w-5 h-5 mr-3" /> จัดการหน้าเว็บ
          </button>
          <div className="pt-4 mt-4 border-t border-slate-800 opacity-50"></div>
          <button className="flex items-center w-full p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition">
            <LayoutDashboard className="w-5 h-5 mr-3" /> แดชบอร์ด
          </button>
          <button className="flex items-center w-full p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition">
            <Settings className="w-5 h-5 mr-3" /> ตั้งค่าระบบ
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
              {activeTab === 'courses' ? 'จัดการหลักสูตรการอบรม' : 'จัดการเนื้อหาหน้าเว็บ'}
            </h1>
            <p className="text-slate-500 mt-1">สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ. หรือ NIEM)</p>
          </div>
          <button 
            onClick={() => activeTab === 'courses' ? (setIsEditing(false), setCurrentCourse({}), setIsModalOpen(true)) : handleCreatePage()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-2xl shadow-blue-200 transition flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5 mr-2" /> {activeTab === 'courses' ? 'เพิ่มหลักสูตรใหม่' : 'สร้างหน้าเว็บใหม่'}
          </button>
        </header>

        {activeTab === 'courses' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">รวมหลักสูตร</div>
                <div className="text-3xl font-extrabold text-slate-800">{courses.length}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 text-green-600">เปิดรับสมัคร</div>
                <div className="text-3xl font-extrabold text-slate-800">{courses.filter(c => c.status === 'เปิดรับสมัคร').length}</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-grow max-w-md w-full">
                  <Search className="w-5 h-5 text-slate-300 absolute left-4 top-3" />
                  <input type="text" placeholder="ค้นหาชื่อหลักสูตร..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                        <button onClick={() => handleEditCourse(course)} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
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
                  LATEST UPDATE: {page.updatedAt}
                </div>
              </div>
            ))}
          </div>
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
                <input type="text" value={currentCourse.name || ''} onChange={(e) => setCurrentCourse({...currentCourse, name: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">หมวดหมู่</label>
                  <select value={currentCourse.category || 'การแพทย์'} onChange={(e) => setCurrentCourse({...currentCourse, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="การแพทย์">การแพทย์</option>
                    <option value="กู้ภัย">กู้ภัย</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">สถานะ</label>
                  <select value={currentCourse.status || 'เปิดรับสมัคร'} onChange={(e) => setCurrentCourse({...currentCourse, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none">
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
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden shadow-blue-900/20">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{isEditing ? 'แก้ไขหน้าเว็บ' : 'สร้างหน้าเว็บใหม่'}</h2>
              <button onClick={() => setIsPageModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handlePageSubmit} className="p-8 space-y-6 text-slate-700 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ชื่อหน้า (Title)</label>
                  <input type="text" value={currentPage.title || ''} onChange={(e) => setCurrentPage({...currentPage, title: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">ชื่อใน URL (Slug)</label>
                  <input type="text" value={currentPage.slug || ''} onChange={(e) => setCurrentPage({...currentPage, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="about-us" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">เนื้อหาหน้าเว็บ (Content)</label>
                <textarea rows={8} value={currentPage.content || ''} onChange={(e) => setCurrentPage({...currentPage, content: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none font-sans leading-relaxed text-sm" placeholder="พิมพ์เนื้อหาที่นี่..." required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">สถานะการเผยแพร่</label>
                <select value={currentPage.status || 'Published'} onChange={(e) => setCurrentPage({...currentPage, status: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Published">เผยแพร่สู่สาธารณะ (Published)</option>
                  <option value="Draft">ฉบับร่าง (Draft)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition">Save Page Content</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
