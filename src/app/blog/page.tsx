'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BookOpen, Calendar, User, ArrowRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string;
  image_url: string;
  author: string;
  created_at: string;
}

export default function BlogListing() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });
      
      if (!error) setBlogs(data || []);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">NIEM BLOG</h1>
            <p className="text-xl text-blue-200/80 max-w-2xl mx-auto font-medium">รวมบทความ ข่าวสาร และความรู้ด้านการแพทย์ฉุกเฉิน</p>
            
            <div className="mt-12 max-w-xl mx-auto relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <input 
                 type="text" 
                 placeholder="ค้นหาบทความที่คุณต้องการ..." 
                 className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </section>

        {/* Blog Grid */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">กำลังโหลดบทความ...</p>
              </div>
            ) : filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredBlogs.map((blog, idx) => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col transition-all hover:-translate-y-2 hover:shadow-blue-900/10 duration-500">
                    {/* Image Area */}
                    <div className="h-64 overflow-hidden relative">
                      {blog.image_url ? (
                        <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {blog.category}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-10 flex-grow flex flex-col">
                      <div className="flex items-center space-x-4 text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" /> {new Date(blog.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center"><User className="w-3 h-3 mr-1.5" /> {blog.author}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{blog.title}</h3>
                      <p className="text-slate-500 leading-relaxed mb-8 flex-grow line-clamp-3 text-sm">{blog.summary}</p>
                      
                      <div className="flex items-center text-blue-600 font-black uppercase tracking-widest text-xs">
                        อ่านต่อ <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-slate-400">ไม่พบข้อมูลบทความ</h2>
                <p className="text-slate-400 mt-2">โปรดลองค้นหาด้วยคำอื่น</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
