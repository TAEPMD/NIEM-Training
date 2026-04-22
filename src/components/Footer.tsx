'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface ContactInfo {
  phone?: string;
  email?: string;
  facebook?: string;
  address?: string;
}

interface SiteConfig {
  name: string;
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: '02-xxx-xxxx',
    email: 'contact@niem.go.th',
  });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({ name: 'NIEM' });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const { data: contact } = await supabase.from('settings').select('*').eq('key', 'contact_info').single();
        if (contact) setContactInfo(contact.value);

        const { data: site } = await supabase.from('settings').select('*').eq('key', 'site_config').single();
        if (site) setSiteConfig(site.value);
      } catch (err) {
        console.error('Error fetching footer data:', err);
      }
    };
    fetchFooterData();
  }, []);

  return (
    <footer className="mt-24 bg-[var(--bg-primary)] border-t border-[var(--rule)]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Big editorial wordmark */}
        <div className="py-16 md:py-24 border-b border-[var(--rule)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-7">
              <div className="kicker mb-6">ศูนย์ฝึกอบรมการแพทย์ฉุกเฉินแห่งชาติ</div>
              <h2 className="display-lg text-[var(--text-primary)] leading-[1.02]">
                ยกระดับ<span className="serif-italic accent-text"> มาตรฐาน</span><br />
                การแพทย์ฉุกเฉิน<br />
                สู่ความเป็นเลิศ
              </h2>
            </div>

            <div className="md:col-span-5 md:pl-8 flex flex-col justify-end">
              <Link
                href="/admin"
                className="group inline-flex items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--rule)] hover:border-[var(--accent)] transition-colors"
              >
                <div>
                  <div className="kicker-accent mb-1">Admin Portal</div>
                  <div className="text-lg font-medium text-[var(--text-primary)] tracking-tight">เข้าสู่ระบบผู้ดูแล</div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--accent)] text-[var(--accent-ink)] group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="w-5 h-5" strokeWidth={1.6} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Directory */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 py-14 text-sm">
          <div className="md:col-span-3">
            <div className="kicker mb-4">เรียนรู้</div>
            <ul className="space-y-2.5 text-[var(--text-primary)]">
              <li><Link href="/" className="hover:accent-text transition-colors">หลักสูตร</Link></li>
              <li><Link href="/blog" className="hover:accent-text transition-colors">บทความ</Link></li>
              <li><Link href="/systems" className="hover:accent-text transition-colors">ระบบสารสนเทศ</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="kicker mb-4">ตรวจสอบ</div>
            <ul className="space-y-2.5 text-[var(--text-primary)]">
              <li><Link href="/" className="hover:accent-text transition-colors">ค้นหาวุฒิบัตร</Link></li>
              <li><Link href="/" className="hover:accent-text transition-colors">หน่วยฝึกอบรม</Link></li>
              <li><Link href="/" className="hover:accent-text transition-colors">คุณสมบัติ</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="kicker mb-4">ติดต่อ</div>
            <ul className="space-y-2.5 text-[var(--text-primary)]">
              <li><span className="text-[var(--text-secondary)]">โทร</span> {contactInfo.phone}</li>
              <li><span className="text-[var(--text-secondary)]">อีเมล</span> {contactInfo.email}</li>
              {contactInfo.address && (
                <li className="text-[var(--text-secondary)]">{contactInfo.address}</li>
              )}
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="kicker mb-4">มาตรฐาน</div>
            <ul className="space-y-2.5 text-[var(--text-primary)]">
              <li>RAL 1016</li>
              <li className="text-[var(--text-secondary)]">Sulfur Yellow</li>
              <li className="text-[var(--text-secondary)]">Editorial System v1.0</li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="py-8 border-t border-[var(--rule)]">
          <div className="text-[20vw] md:text-[14vw] leading-none tracking-[-0.05em] font-medium text-[var(--text-primary)] select-none overflow-hidden">
            {siteConfig.name}<span className="accent-text">.</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 pb-10 text-xs text-[var(--text-secondary)]">
          <div>
            © 2026 {siteConfig.name} Training Center — สงวนลิขสิทธิ์
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <span className="text-[var(--rule-strong)]">/</span>
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">ข้อกำหนดการใช้งาน</Link>
            <span className="text-[var(--rule-strong)]">/</span>
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">แผนผังเว็บไซต์</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
