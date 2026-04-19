'use client';

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface PageData {
  title: string;
  slug: string;
  content: string;
  status: string;
  updatedAt: string;
}

export default function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('niem_pages');
    if (saved) {
      const pages = JSON.parse(saved);
      const found = pages.find((p: PageData) => p.slug === slug && p.status === 'Published');
      if (found) {
        setPage(found);
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse text-blue-600 font-bold">กำลังโหลด...</div>
    </div>
  );

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow py-12 px-4 shadow-sm">
        <article className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 md:p-12 text-white">
            <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white transition mb-6 text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> กลับสู่หน้าหลัก
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
              {page.title}
            </h1>
            <div className="flex items-center text-blue-300 text-sm">
              <FileText className="w-4 h-4 mr-2" /> อัปเดตล่าสุดเมื่อ {page.updatedAt}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 prose prose-blue max-w-none prose-slate">
            <div 
              className="text-slate-700 leading-relaxed text-lg whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>

          {/* Simple CTA */}
          <div className="p-8 md:p-12 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
            <div className="text-slate-500 text-sm">สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.)</div>
            <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition flex items-center text-sm">
              กลับหน้าหลัก <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
