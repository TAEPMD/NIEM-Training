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
  const [footerConfig, setFooterConfig] = useState<any>({
    about: 'สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.) เป็นหน่วยงานของรัฐที่มีหน้าที่คุ้มครองสิทธิในการเข้าถึงระบบการแพทย์ฉุกเฉินอย่างทั่วถึง เท่าเทียม และมีมาตรฐาน'
  });
  const [siteConfig, setSiteConfig] = useState<any>({ name: 'NIEM Training Center' });

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const { data: contact } = await supabase.from('settings').select('*').eq('key', 'contact_info').single();
        if (contact) setContactInfo(contact.value);

        const { data: footer } = await supabase.from('settings').select('*').eq('key', 'footer_config').single();
        if (footer) setFooterConfig(footer.value);

        const { data: site } = await supabase.from('settings').select('*').eq('key', 'site_config').single();
        if (site) setSiteConfig(site.value);
      } catch (err) {
        console.error('Error fetching footer data:', err);
      }
    };
    fetchFooterData();
  }, []);

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-8">
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">เกี่ยวกับพวกเรา</h3>
            <p className="text-slate-500 leading-relaxed">
              {footerConfig.about}
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">ข้อมูลติดต่อ</h3>
            <ul className="space-y-2 text-slate-500">
              <li>📞 {contactInfo.phone}</li>
              <li>📧 {contactInfo.email}</li>
              {contactInfo.address && <li>📍 {contactInfo.address}</li>}
              {contactInfo.facebook && <li>🌐 <a href={contactInfo.facebook} target="_blank" className="hover:text-blue-400">Facebook</a></li>}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">จัดการระบบ</h3>
            <Link href="/admin" className="inline-block px-4 py-2 border border-slate-700 rounded hover:border-blue-500 hover:text-blue-400 transition">
              เข้าสู่ระบบเจ้าหน้าที่ (Admin Panel)
            </Link>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 {siteConfig.name}</p>
          <div className="flex space-x-6 text-slate-600">
            <span>Powered by Next.js & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
