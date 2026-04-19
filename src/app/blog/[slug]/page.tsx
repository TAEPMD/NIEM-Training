'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowLeft, Loader2, Folder, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export default function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Published')
        .single();
      
      if (!error && data) {
        setBlog(data);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl animate-pulse"></div>
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
      <div className="text-blue-200/50 mt-4 font-black uppercase tracking-[0.5em] text-xs relative z-10">Fetching Article</div>
    </div>
  );

  if (!blog) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow py-16 px-4">
        <article className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-700">
          
          {/* Cover Image or Header Color */}
          {blog.image_url ? (
            <div className="h-[400px] w-full relative">
              <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-12 md:p-16 text-white w-full">
                 <Link href="/blog" className="inline-flex items-center text-blue-300 hover:text-white transition-all mb-6 text-[10px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to blog
                </Link>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">{blog.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  {blog.title}
                </h1>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 p-12 md:p-20 text-white relative">
              <Link href="/blog" className="inline-flex items-center text-blue-300 hover:text-white transition-all mb-10 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to blog
              </Link>
              <div className="px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full w-fit mb-6 shadow-xl shadow-blue-900/40">
                {blog.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-tight">
                {blog.title}
              </h1>
            </div>
          )}

          {/* Meta Info */}
          <div className="px-12 md:px-20 py-8 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-8">
            <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
              <User className="w-4 h-4 mr-2 text-blue-600" /> โดย {blog.author}
            </div>
            <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
              <Calendar className="w-4 h-4 mr-2 text-blue-600" /> {new Date(blog.created_at).toLocaleDateString('th-TH', { dateStyle: 'long' })}
            </div>
            <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
              <Folder className="w-4 h-4 mr-2 text-blue-600" /> {blog.category}
            </div>
            <div className="ml-auto">
              <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-12 md:p-20">
            {/* Summary Box */}
            <div className="bg-blue-50/50 border-l-4 border-blue-600 p-8 mb-12 rounded-r-3xl italic text-slate-600 text-lg">
              {blog.summary}
            </div>
            
            <div 
              className="prose prose-slate prose-lg max-w-none text-slate-700 leading-[1.8] whitespace-pre-line font-medium"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Bottom Navigation */}
          <div className="p-12 md:p-20 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              © 2026 NIEM ACADEMY • OFFICIAL RESOURCE
            </div>
            <Link href="/blog" className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-slate-50 shadow-sm transition transform hover:scale-105 active:scale-95 text-xs">
              กลับไปหน้าหลัก Blog
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
