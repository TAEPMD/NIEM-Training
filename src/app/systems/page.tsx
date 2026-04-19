'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Activity, Globe, FileText, ShieldAlert, 
  ChevronRight, ExternalLink, Search, Loader2, Sparkles
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface SystemItem {
  id: number;
  name: string;
  description: string;
  icon_name: string;
  url: string;
  updated_at: string;
}

export default function SystemsPage() {
  const [systems, setSystems] = useState<SystemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSystems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('systems')
        .select('*')
        .order('id', { ascending: true });
      
      if (data) setSystems(data);
      setLoading(false);
    };

    fetchSystems();
  }, []);

  const getSystemIcon = (name: string) => {
    switch(name) {
      case 'ShieldAlert': return <ShieldAlert className="w-8 h-8" />;
      case 'Globe': return <Globe className="w-8 h-8" />;
      case 'FileText': return <FileText className="w-8 h-8" />;
      default: return <Activity className="w-8 h-8" />;
    }
  };

  const filteredSystems = systems.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col uppercase-none">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 w-full">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-xs font-black mb-6 tracking-widest uppercase">
            <Globe className="w-3 h-3 mr-2" /> Digital Infrastructure
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
             ระบบสารสนเทศ <span className="text-blue-600">NIEM Center</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            รวมช่องทางการเข้าถึงระบบงานและฐานข้อมูลต่างๆ ของสถาบันการแพทย์ฉุกเฉินแห่งชาติ 
            เพื่อความสะดวกในการปฏิบัติงานของบุคลากรและเจ้าหน้าที่
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 relative group">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition"></div>
          <input 
            type="text" 
            placeholder="ค้นหาชื่อระบบ เช่น ITEMS, EMS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800 relative z-10"
          />
          <Search className="w-6 h-6 text-slate-300 absolute left-8 top-6 group-focus-within:text-blue-600 transition relative z-10" />
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-200 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSystems.map(system => (
              <a 
                key={system.id}
                href={system.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all duration-500 flex flex-col transform hover:-translate-y-2"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-slate-50 p-5 rounded-[2rem] text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6 shadow-sm">
                    {getSystemIcon(system.icon_name)}
                  </div>
                  <div className="p-3 rounded-full bg-slate-50 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 transition-all duration-300">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-4 group-hover:text-blue-600 transition tracking-tight">
                  {system.name}
                </h3>
                
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 flex-grow">
                  {system.description}
                </p>
                
                <div className="flex items-center text-xs font-black text-blue-600 uppercase tracking-widest pt-6 border-t border-slate-50">
                   Access Portal <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                </div>
              </a>
            ))}

            {filteredSystems.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-400">
                <div className="bg-white/50 backdrop-blur-sm border border-dashed border-slate-200 rounded-[3rem] p-16">
                  <div className="text-xl font-bold mb-2">ไม่พบระบบที่คุณค้นหา</div>
                  <p className="text-sm opacity-60 font-medium tracking-tight">โปรดลองใช้คำค้นหาอื่น หรือดูรายการทั้งหมด</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feature Banner */}
        <div className="mt-24 bg-slate-900 rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
             <Sparkles className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                แจ้งปัญหาการใช้งาน หรือ <br/> ขอนำระบบเข้าฐานข้อมูล
              </h2>
              <p className="text-blue-100/60 font-medium text-lg">
                หากท่านพบปัญหาในการเข้าใช้งานระบบสารสนเทศ หรือต้องการเพิ่มระบบใหม่เข้าสู่ระบบส่วนกลาง 
                โปรดแจ้งฝ่ายเทคโนโลยีสารสนเทศ NIEM
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/50 transition transform hover:scale-[1.05] active:scale-95 whitespace-nowrap">
              ติดต่อแจ้งความประสงค์
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
