'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, ArrowLeft, Loader2, Calendar, User, Share2, Activity, Award } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/utils/supabase';

interface PageData {
  title: string;
  slug: string;
  content: string;
  status: string;
  updated_at: string;
}

export default function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Published')
        .single();
      
      if (!error && data) {
        setPage(data);
      }
      setLoading(false);
    };

    fetchPage();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl animate-pulse"></div>
      <div className="w-24 h-24 rounded-3xl bg-blue-600/10 border border-white/10 flex items-center justify-center relative animate-float">
         <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
      <div className="text-white/30 mt-8 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Retrieving Medical Record</div>
    </div>
  );

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-32 md:pt-40 pb-20 md:pb-32 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-1000">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4 mb-12">
            <Link href="/" className="group flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white transition">
                <ArrowLeft className="w-4 h-4" />
              </div>
              Back to portal
            </Link>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Dynamic Content</span>
          </div>

          {/* Header */}
          <header className="mb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1] mb-12">
              {page.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                 <Calendar className="w-4 h-4 text-blue-600" /> Issued {new Date(page.updated_at).toLocaleDateString()}
               </div>
               <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                 <FileText className="w-4 h-4 text-emerald-600" /> Official Document
               </div>
               <button className="flex items-center gap-2 bg-slate-100 hover:bg-blue-600 hover:text-white transition px-4 py-2 rounded-xl">
                 <Share2 className="w-4 h-4" /> Share
               </button>
            </div>
          </header>

          {/* Featured Image Placeholder (EMS Theme) */}
          <div className="aspect-[21/9] rounded-[3rem] bg-slate-900 mb-20 relative overflow-hidden group shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/40 mix-blend-overlay"></div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-32 h-32 text-blue-600/10 group-hover:scale-125 transition duration-1000" />
             </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-20 border border-slate-100 shadow-xl shadow-slate-200/50">
            <div 
              className="prose prose-slate prose-xl max-w-none text-slate-700 leading-[1.8] text-lg md:text-xl font-medium whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* Footer Action */}
          <div className="mt-12 md:mt-20 flex flex-col md:flex-row justify-between items-center bg-slate-900 p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden gap-6 md:gap-0">
             <div className="absolute right-0 top-0 p-12 opacity-5 pointer-events-none">
                <Award className="w-48 h-48 md:w-64 md:h-64 text-white" />
             </div>
             <div className="relative z-10 text-center md:text-left">
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2 font-heading">Next Steps</div>
                <div className="text-xl md:text-2xl font-black text-white">พร้อมก้าวสู่อนาคต EMS?</div>
             </div>
             <Link href="/" className="relative z-10 px-8 py-4 md:px-10 md:py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-blue-700 transition transform hover:-translate-y-1 shadow-2xl shadow-blue-600/30">
               Explpore Pathyways
             </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
