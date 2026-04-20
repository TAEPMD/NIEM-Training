'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { Activity, Mail, Phone, MapPin, Link as LinkIcon, Globe, ArrowUpRight, ShieldCheck } from 'lucide-react';

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
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 text-left">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start gap-8">
            <Link href="/" className="flex items-center group">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 transition">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-black text-slate-900 leading-none uppercase tracking-tighter">
                  {siteConfig.name.split(' ')[0]}
                </h3>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-1.5 leading-none">
                  Training Excellence
                </p>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {footerConfig.about}
            </p>
            <div className="flex gap-3">
              {[
                { icon: <LinkIcon className="w-5 h-5"/>, href: contactInfo.facebook },
                { icon: <Globe className="w-5 h-5"/>, href: '#' },
                { icon: <Mail className="w-5 h-5"/>, href: `mailto:${contactInfo.email}` }
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10">Navigation</h4>
            <ul className="space-y-5 text-sm font-bold">
              {['หน้าแรก', 'หลักสูตร', 'บทความ', 'ระบบสารสนเทศ'].map((link) => (
                <li key={link}>
                  <Link href="/" className="text-slate-500 hover:text-blue-600 transition flex items-center group">
                    {link} <ArrowUpRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10">Legal</h4>
            <ul className="space-y-5 text-sm font-bold text-slate-500">
              <li><Link href="/" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-blue-600 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <div>
               <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10">Contact Support</h4>
               <div className="space-y-5">
                  <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:border-blue-100 transition duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition">
                      <Phone className="w-5 h-5"/>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Emergency Line</div>
                      <div className="text-base font-black text-slate-900">{contactInfo.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:bg-white hover:border-blue-100 transition duration-300">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 group-hover:scale-110 transition">
                      <Mail className="w-5 h-5"/>
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Official Email</div>
                      <div className="text-sm font-black text-slate-900 truncate">{contactInfo.email}</div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-none">
              © 2026 {siteConfig.name}. All Rights Reserved.
            </p>
            <div className="hidden md:flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <ShieldCheck className="w-3 h-3" />
               <span className="text-[9px] font-black uppercase tracking-widest leading-none">Official Site</span>
            </div>
          </div>
          <div className="flex items-center gap-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
             <Link href="/admin" className="hover:text-blue-600 transition flex items-center">
               ADMIN DASHBOARD <ArrowUpRight className="w-4 h-4 ml-2" />
             </Link>
             <span>NEXT.JS & SUPABASE</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Orbs */}
      <div className="absolute left-[80%] top-[40%] w-[40%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
    </footer>
  );
}
