'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, ChevronLeft, 
  Save, X, LayoutDashboard, BookOpen, Settings,
  LogOut, Activity, Filter, CheckCircle2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: number;
  name: string;
  category: string;
  status: string;
  dateAdded: string;
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Load data from localStorage or initial mock data
  useEffect(() => {
    const savedCourses = localStorage.getItem('niem_courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      const initialData = [
        { id: 1, name: 'Basic Life Support (BLS)', category: 'การแพทย์', status: 'เปิดรับสมัคร', dateAdded: '2026-04-01' },
        { id: 2, name: 'Pre-Hospital Trauma Life Support (PHTLS)', category: 'การแพทย์', status: 'เต็มแล้ว', dateAdded: '2026-04-05' },
        { id: 3, name: 'Vehicle Extrication & Technical Rescue', category: 'กู้ภัย', status: 'เปิดรับสมัคร', dateAdded: '2026-04-10' },
      ];
      setCourses(initialData);
      localStorage.setItem('niem_courses', JSON.stringify(initialData));
    }
  }, []);

  const saveToLocal = (updatedCourses: Course[]) => {
    setCourses(updatedCourses);
    localStorage.setItem('niem_courses', JSON.stringify(updatedCourses));
  };

  const handleCreate = () => {
    setIsEditing(false);
    setCurrentCourse({ name: '', category: 'การแพทย์', status: 'เปิดรับสมัคร' });
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setIsEditing(true);
    setCurrentCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหลักสูตรนี้?')) {
      const updated = courses.filter(c => c.id !== id);
      saveToLocal(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      const updated = courses.map(c => c.id === currentCourse.id ? (currentCourse as Course) : c);
      saveToLocal(updated);
    } else {
      const newCourse = {
        ...currentCourse,
        id: Date.now(),
        dateAdded: new Date().toISOString().split('T')[0]
      } as Course;
      saveToLocal([...courses, newCourse]);
    }
    setIsModalOpen(false);
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
          <span className="font-bold text-xl tracking-tight">NIEM ADMIN</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">เมนูจัดการ</div>
          <button className="flex items-center w-full p-3 bg-blue-600 rounded-lg text-white font-medium">
            <BookOpen className="w-5 h-5 mr-3" /> จัดการหลักสูตร
          </button>
          <button className="flex items-center w-full p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <LayoutDashboard className="w-5 h-5 mr-3" /> ภาพรวมระบบ
          </button>
          <button className="flex items-center w-full p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition">
            <Settings className="w-5 h-5 mr-3" /> ตั้งค่าเว็บ
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="/" className="flex items-center w-full p-3 text-slate-400 hover:text-white transition">
            <LogOut className="w-5 h-5 mr-3" /> ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">จัดการหลักสูตรการอบรม</h1>
            <p className="text-slate-500">เพิ่ม แก้ไข และตรวจสอบข้อมูลหลักสูตรทั้งหมดในระบบ</p>
          </div>
          <button 
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-blue-200 transition flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" /> เพิ่มหลักสูตรใหม่
          </button>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm font-medium">หลักสูตรทั้งหมด</span>
              <BookOpen className="w-8 h-8 text-blue-100" />
            </div>
            <div className="text-3xl font-bold mt-1">{courses.length}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm font-medium">เปิดรับสมัคร</span>
              <CheckCircle2 className="w-8 h-8 text-green-100" />
            </div>
            <div className="text-3xl font-bold mt-1 text-green-600">
              {courses.filter(c => c.status === 'เปิดรับสมัคร').length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm font-medium">เต็มแล้ว/ปิดรับ</span>
              <AlertCircle className="w-8 h-8 text-red-100" />
            </div>
            <div className="text-3xl font-bold mt-1 text-red-600">
              {courses.filter(c => c.status === 'เต็มแล้ว').length}
            </div>
          </div>
        </div>

        {/* Table/List View */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
            <div className="relative flex-grow max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อหลักสูตร..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center text-sm text-slate-500 mr-2">
                <Filter className="w-4 h-4 mr-1" /> กรอง:
              </div>
              <select 
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">ทุกหมวดหมู่</option>
                <option value="การแพทย์">การแพทย์</option>
                <option value="กู้ภัย">กู้ภัย</option>
                <option value="วิชาการ">วิชาการ</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">ชื่อหลักสูตร</th>
                  <th className="px-6 py-4">หมวดหมู่</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4">วันที่เพิ่ม</th>
                  <th className="px-6 py-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{course.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        course.status === 'เปิดรับสมัคร' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {course.dateAdded}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleEdit(course)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="แก้ไข"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredCourses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      ไม่พบข้อมูลหลักสูตร
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Toolroom */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditing ? 'แก้ไขหลักสูตร' : 'เพิ่มหลักสูตรใหม่'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">ชื่อหลักสูตร</label>
                <input 
                  type="text" 
                  value={currentCourse.name}
                  onChange={(e) => setCurrentCourse({...currentCourse, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="เช่น Basic Life Support (BLS)"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">หมวดหมู่</label>
                  <select 
                    value={currentCourse.category}
                    onChange={(e) => setCurrentCourse({...currentCourse, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="การแพทย์">การแพทย์</option>
                    <option value="กู้ภัย">กู้ภัย</option>
                    <option value="วิชาการ">วิชาการ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">สถานะ</label>
                  <select 
                    value={currentCourse.status}
                    onChange={(e) => setCurrentCourse({...currentCourse, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="เปิดรับสมัคร">เปิดรับสมัคร</option>
                    <option value="เต็มแล้ว">เต็มแล้ว</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-grow py-3 px-4 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-3 px-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition flex items-center justify-center"
                >
                  <Save className="w-5 h-5 mr-2" /> บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
