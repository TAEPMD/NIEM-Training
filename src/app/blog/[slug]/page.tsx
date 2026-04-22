'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Calendar, User, ArrowLeft, Loader2, Folder, Share2, ArrowUpRight } from 'lucide-react';
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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'Published')
        .single();
      if (!error && data) setBlog(data);
      setLoading(false);
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="w-6 h-6 text-[var(--text-secondary)] animate-spin mb-4" strokeWidth={1.5} />
        <div className="kicker">Fetching article</div>
      </div>
    );
  }

  if (!blog) return notFound();

  const dateLong = new Date(blog.created_at).toLocaleDateString('th-TH', { dateStyle: 'long' });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans text-[var(--text-primary)]">
      <Navbar />

      {/* Reading progress */}
      <div className="fixed top-16 left-0 right-0 h-[2px] bg-[var(--rule)] z-[90]">
        <div
          className="h-full bg-[var(--accent)] transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-grow pt-16">
        <article className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 md:pt-16">
          {/* Back / meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--rule)]">
            <Link href="/blog" className="inline-flex items-center gap-2 kicker hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} /> Back to journal
            </Link>
            <div className="flex items-center gap-5 kicker">
              <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" strokeWidth={2} />{dateLong}</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><User className="w-3 h-3" strokeWidth={2} />{blog.author}</span>
              <span>·</span>
              <span className="flex items-center gap-1.5"><Folder className="w-3 h-3" strokeWidth={2} />{blog.category}</span>
            </div>
          </div>

          {/* Editorial title */}
          <header className="py-14 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-2">
              <div className="kicker-accent">{blog.category}</div>
            </div>
            <div className="lg:col-span-10">
              <h1 className="display-hero text-[var(--text-primary)] mb-10">
                {blog.title}
              </h1>
              {blog.summary && (
                <p className="max-w-3xl text-xl md:text-2xl font-medium tracking-tight text-[var(--text-secondary)] leading-snug serif-italic">
                  {blog.summary}
                </p>
              )}
            </div>
          </header>

          {/* Cover */}
          {blog.image_url && (
            <div className="mb-16 md:mb-24 rounded-3xl overflow-hidden border border-[var(--rule)]">
              <img src={blog.image_url} alt={blog.title} className="w-full h-auto object-cover" />
            </div>
          )}

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-24">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28 space-y-6 pt-6 border-t border-[var(--rule)]">
                <div>
                  <div className="kicker mb-2">Author</div>
                  <div className="text-base font-medium text-[var(--text-primary)] tracking-tight">{blog.author}</div>
                </div>
                <div>
                  <div className="kicker mb-2">Published</div>
                  <div className="text-base font-medium text-[var(--text-primary)] tracking-tight">{dateLong}</div>
                </div>
                <div>
                  <div className="kicker mb-2">Category</div>
                  <div className="text-base font-medium accent-text">{blog.category}</div>
                </div>
                <button
                  onClick={() => {
                    if (navigator.share) navigator.share({ title: blog.title, url: window.location.href });
                    else navigator.clipboard.writeText(window.location.href);
                  }}
                  className="btn-ghost px-4 py-2 text-xs flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" strokeWidth={1.8} /> แชร์บทความ
                </button>
              </div>
            </aside>

            <div className="lg:col-span-9 lg:pl-6 lg:border-l lg:border-[var(--rule)]">
              <div
                className="prose prose-lg max-w-none text-[var(--text-primary)] leading-[1.8] prose-headings:font-medium prose-headings:tracking-tight prose-a:accent-text prose-strong:text-[var(--text-primary)] prose-blockquote:border-l-[var(--accent)] prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-[var(--text-secondary)]"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>

          {/* Footer of article */}
          <div className="border-t border-[var(--rule)] py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="kicker">© 2026 NIEM Journal · Official Resource</div>
            <Link href="/blog" className="btn-primary px-6 py-3 text-sm flex items-center gap-2">
              กลับสู่ดัชนีบทความ <ArrowUpRight className="w-4 h-4" strokeWidth={1.8} />
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
