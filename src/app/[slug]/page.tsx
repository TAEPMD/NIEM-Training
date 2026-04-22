'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Loader2 } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="w-6 h-6 text-[var(--text-secondary)] animate-spin mb-4" strokeWidth={1.5} />
        <div className="kicker">Loading</div>
      </div>
    );
  }

  if (!page) return notFound();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-grow pt-16">
        <article className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 md:pt-20 pb-24">
          {/* Top bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--rule)]">
            <Link href="/" className="inline-flex items-center gap-2 kicker hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> กลับหน้าแรก
            </Link>
            <div className="kicker">
              อัปเดตล่าสุด {new Date(page.updated_at).toLocaleDateString('th-TH')}
            </div>
          </div>

          {/* Title */}
          <header className="py-14 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-2">
              <div className="kicker-accent">Document</div>
            </div>
            <div className="lg:col-span-10">
              <h1 className="display-hero text-[var(--text-primary)]">
                {page.title}
              </h1>
            </div>
          </header>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
            <aside className="lg:col-span-2" aria-hidden />
            <div className="lg:col-span-10 lg:max-w-[68ch]">
              <div
                className="prose prose-lg max-w-none text-[var(--text-primary)] leading-[1.8] prose-headings:font-medium prose-headings:tracking-tight prose-a:accent-text prose-strong:text-[var(--text-primary)] prose-blockquote:border-l-[var(--accent)] prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[var(--text-secondary)]"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
