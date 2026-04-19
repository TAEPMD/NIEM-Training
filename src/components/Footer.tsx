'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-8">
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">เกี่ยวกับ สพฉ.</h3>
            <p className="text-slate-500 leading-relaxed">
              สถาบันการแพทย์ฉุกเฉินแห่งชาติ (สพฉ.) เป็นหน่วยงานของรัฐที่มีหน้าที่คุ้มครองสิทธิในการเข้าถึงระบบการแพทย์ฉุกเฉินอย่างทั่วถึง เท่าเทียม และมีมาตรฐาน
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">ลิงก์ที่เกี่ยวข้อง</h3>
            <ul className="space-y-2 text-slate-500">
              <li><Link href="/" className="hover:text-blue-400 transition">นโยบายความเป็นส่วนตัว</Link></li>
              <li><Link href="/" className="hover:text-blue-400 transition">เงื่อนไขการใช้งาน</Link></li>
              <li><Link href="/" className="hover:text-blue-400 transition">ติดต่อเรา</Link></li>
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
          <p>© 2026 ศูนย์ฝึกอบรม สถาบันการแพทย์ฉุกเฉินแห่งชาติ (NIEM Training Center)</p>
          <div className="flex space-x-6 text-slate-600">
            <span>Powered by Next.js & Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
