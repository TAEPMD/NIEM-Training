'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl animate-pulse"></div>
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin relative z-10" />
      <div className="text-blue-200/50 mt-4 font-black uppercase tracking-[0.5em] text-xs relative z-10">Authenticating Content</div>
    </div>
  );

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow py-16 px-4">
        <article className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-8 duration-700">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 p-12 md:p-20 text-white relative">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <FileText className="w-64 h-64" />
            </div>
            <Link href="/" className="inline-flex items-center text-blue-300 hover:text-white transition-all mb-10 text-xs font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to portal
            </Link>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
              {page.title}
            </h1>
            <div className="flex items-center text-blue-300/60 text-xs font-black uppercase tracking-[0.2em] bg-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-md">
              <FileText className="w-3 h-3 mr-2" /> Last Updated {new Date(page.updated_at).toLocaleDateString()}
            </div>
          </div>

          {/* Content */}
          <div className="p-12 md:p-20">
            <div 
              className="text-slate-700 leading-[1.8] text-lg lg:text-xl whitespace-pre-line font-medium"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* Footer Info */}
          <div className="p-12 md:p-20 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              NIEM Official Document • 2026 Registry
            </div>
            <Link href="/" className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-2xl shadow-blue-500/20 transition transform hover:scale-105 active:scale-95 text-xs">
              Return Home
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
