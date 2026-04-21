'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
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
      const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).eq('status', 'Published').single();
      if (!error && data) setPage(data);
      setLoading(false);
    };
    fetchPage();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
       <Loader2 className="w-8 h-8 text-[var(--text-secondary)] animate-spin" />
    </div>
  );

  if (!page) return notFound();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow pt-24 pb-32">
        <article className="max-w-3xl mx-auto px-6 sm:px-8 mt-12 animate-fade-in-up">
           
           <div className="mb-10 text-sm font-medium text-[var(--accent)] flex items-center">
             <Link href="/" className="hover:underline flex items-center"><ChevronRight className="w-4 h-4 mr-1 rotate-180" /> กลับสู่หน้าหลัก</Link>
           </div>

           <header className="mb-10 border-b border-[var(--apple-border)] pb-8">
             <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight leading-tight mb-4">
               {page.title}
             </h1>
             <div className="text-[var(--text-secondary)] text-sm font-medium">
               อัปเดตล่าสุด: {new Date(page.updated_at).toLocaleDateString()}
             </div>
           </header>

           <div className="prose prose-lg max-w-none prose-p:text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-p:leading-relaxed prose-p:font-medium text-[#1d1d1f]">
             <div dangerouslySetInnerHTML={{ __html: page.content }} />
           </div>

        </article>
      </main>

      <Footer />
    </div>
  );
}
