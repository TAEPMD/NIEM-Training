'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { BookOpen, Calendar, User, ArrowUpRight, Loader2, Search } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState<string>('ทั้งหมด');

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });
      if (data) setBlogs(data);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  const categories = ['ทั้งหมด', ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];

  const filteredBlogs = blogs.filter(blog => {
    const matchSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === 'ทั้งหมด' || blog.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const featured = filteredBlogs[0];
  const rest = filteredBlogs.slice(1);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col font-sans text-[var(--text-primary)]">
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Editorial masthead */}
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pt-12 pb-12 md:pt-20 md:pb-16">
          <div className="flex items-center justify-between pb-6 border-b border-[var(--rule)]">
            <div className="kicker">The NIEM Journal</div>
            <div className="kicker hidden sm:block">Issue 01 — Editorial</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 md:pt-16">
            <div className="lg:col-span-8">
              <h1 className="display-hero text-[var(--text-primary)]">
                บทความ<br />
                <span className="serif-italic accent-text">& ความรู้</span>
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pl-6 lg:border-l lg:border-[var(--rule)] flex flex-col justify-end">
              <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                รวมบทความ ข่าวสาร และแนวปฏิบัติด้านการแพทย์ฉุกเฉิน — เขียนโดยทีมผู้เชี่ยวชาญของ NIEM
              </p>
            </div>
          </div>
        </section>

        {/* Filter + Search bar */}
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-10">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between pt-6 border-t border-[var(--rule)]">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight border transition-colors ${
                    activeCategory === cat
                      ? 'bg-[var(--surface-ink)] text-[var(--bg-primary)] border-[var(--surface-ink)]'
                      : 'bg-transparent text-[var(--text-secondary)] border-[var(--rule)] hover:border-[var(--rule-strong)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative md:w-72">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" strokeWidth={1.6} />
              <input
                type="text"
                placeholder="ค้นหาบทความ"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ed-input w-full pl-10 pr-4 py-2.5 rounded-full text-sm"
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-6 h-6 text-[var(--text-secondary)] animate-spin mb-4" strokeWidth={1.5} />
              <p className="kicker">Loading articles</p>
            </div>
          ) : filteredBlogs.length > 0 ? (
            <>
              {/* Featured */}
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 ed-card hover-lift overflow-hidden mb-16 md:mb-20"
                >
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[var(--bg-tertiary)]">
                    {featured.image_url ? (
                      <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-tertiary)]">
                        <BookOpen className="w-16 h-16" strokeWidth={1.2} />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <span className="kicker-accent bg-[var(--accent)] text-[var(--accent-ink)] px-3 py-1 rounded-full">Featured · {featured.category}</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 kicker mb-6">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" strokeWidth={2} />{new Date(featured.created_at).toLocaleDateString('th-TH')}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1.5"><User className="w-3 h-3" strokeWidth={2} />{featured.author}</span>
                      </div>
                      <h2 className="display-lg text-[var(--text-primary)] leading-tight group-hover:accent-text transition-colors mb-5">
                        {featured.title}
                      </h2>
                      <p className="text-[var(--text-secondary)] leading-relaxed line-clamp-4">
                        {featured.summary}
                      </p>
                    </div>
                    <div className="mt-10 flex items-center justify-between pt-6 border-t border-[var(--rule)]">
                      <span className="kicker-accent">อ่านต่อ</span>
                      <div className="w-11 h-11 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center group-hover:rotate-45 transition-transform">
                        <ArrowUpRight className="w-5 h-5" strokeWidth={1.8} />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Rest as editorial list */}
              {rest.length > 0 && (
                <>
                  <div className="flex items-baseline justify-between mb-8 md:mb-10">
                    <h3 className="display-md text-[var(--text-primary)]">บทความเพิ่มเติม</h3>
                    <div className="kicker">{rest.length} รายการ</div>
                  </div>

                  <div className="divide-y divide-[var(--rule)] border-t border-b border-[var(--rule)]">
                    {rest.map((blog, idx) => (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.slug}`}
                        className="group grid grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 items-center hover:bg-[var(--bg-tertiary)]/40 transition-colors px-2 md:px-4 -mx-2 md:-mx-4"
                      >
                        <div className="col-span-1 kicker text-[var(--text-tertiary)]">
                          {String(idx + 2).padStart(2, '0')}
                        </div>
                        <div className="col-span-4 md:col-span-2 kicker-accent">
                          {blog.category}
                        </div>
                        <div className="col-span-7 md:col-span-6">
                          <div className="text-lg md:text-xl font-medium tracking-tight text-[var(--text-primary)] group-hover:accent-text transition-colors line-clamp-2">
                            {blog.title}
                          </div>
                          <div className="mt-1.5 kicker hidden md:block">{blog.author} · {new Date(blog.created_at).toLocaleDateString('th-TH')}</div>
                        </div>
                        <div className="hidden md:block col-span-2 kicker">
                          {new Date(blog.created_at).toLocaleDateString('th-TH', { month: 'short', year: 'numeric' })}
                        </div>
                        <div className="col-span-12 md:col-span-1 flex justify-end">
                          <ArrowUpRight className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent-deep)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" strokeWidth={1.6} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="ed-card p-16 text-center">
              <BookOpen className="w-10 h-10 text-[var(--text-tertiary)] mx-auto mb-6" strokeWidth={1.3} />
              <div className="kicker mb-3">No Results</div>
              <h2 className="display-md text-[var(--text-primary)] mb-2">ไม่พบบทความ</h2>
              <p className="text-[var(--text-secondary)]">ลองค้นหาด้วยคำอื่น หรือเปลี่ยนหมวดหมู่</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
