'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<any>({ 
    phone: '02-xxx-xxxx', 
    email: 'contact@niem.go.th',
    facebook: '',
    address: '' 
  });
  const [siteConfig, setSiteConfig] = useState<any>({ name: 'NIEM' });

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
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--apple-border)] text-xs text-[var(--text-secondary)] font-medium pt-8 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footnotes / Description */}
        <div className="border-b border-[var(--apple-border)] pb-4 mb-8 space-y-3">
          <p>
            1. ข้อมูลทั้งหมดแสดงเพื่อเป็นแนวทางสำหรับการฝึกอบรมเท่านั้น โปรดตรวจสอบข้อกำหนดทางการแพทย์ในพื้นที่ของคุณ
          </p>
          <p>
            2. ศูนย์ฝึกอบรมสถาบันการแพทย์ฉุกเฉินแห่งชาติมุ่งมั่นในการเรียนการสอนอย่างมีมาตรฐานสากล
          </p>
        </div>

        {/* Directory Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 leading-loose tracking-tight">
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">เรียนรู้เพิ่มเติม</h3>
            <ul>
               <li><Link href="/" className="hover:underline">หลักสูตร (Courses)</Link></li>
               <li><Link href="/blog" className="hover:underline">บทความ (Blog)</Link></li>
               <li><Link href="/systems" className="hover:underline">ระบบสารสนเทศ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">การตรวจสอบ</h3>
            <ul>
               <li><Link href="/" className="hover:underline">ค้นหาใบประกาศนียบัตร</Link></li>
               <li><Link href="/" className="hover:underline">รายชื่อหน่วยฝึกอบรม</Link></li>
               <li><Link href="/" className="hover:underline">ตรวจสอบคุณสมบัติ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">การติดต่อ</h3>
            <ul>
               <li>โทร: {contactInfo.phone}</li>
               <li>อีเมล: {contactInfo.email}</li>
               {contactInfo.address && <li>ที่อยู่: {contactInfo.address}</li>}
            </ul>
          </div>
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold mb-2">เข้าสู่ระบบ</h3>
            <ul>
               <li><Link href="/admin" className="hover:underline">ผู้ดูแลระบบ (Admin)</Link></li>
               <li><Link href="/" className="hover:underline">ผู้ใช้งาน (User Portal)</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-6 border-t border-[var(--apple-border)] gap-4">
           <div>
             Copyright © 2026 {siteConfig.name} Inc. สงวนสิทธิ์ทุกประการ
           </div>
           <div className="flex space-x-4">
             <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">นโยบายความเป็นส่วนตัว</Link>
             <Link href="/" className="hover:text-[var(--text-primary)] transition-colors border-l border-[var(--apple-border)] pl-4">ข้อกำหนดการใช้งาน</Link>
             <Link href="/" className="hover:text-[var(--text-primary)] transition-colors border-l border-[var(--apple-border)] pl-4">แผนผังเว็บไซต์</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
