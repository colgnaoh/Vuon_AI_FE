import React from 'react';
import { Sprout, Github, Globe, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 py-12 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span className="font-extrabold text-slate-900 tracking-tight text-base">VUON AI SPACE</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Không gian sáng tạo, cộng đồng công nghệ mở ươm mầm các dự án AI, Robotics, IoT, Embedded Systems và Software.
          </p>
          <div className="text-xs font-mono text-emerald-700 font-bold">
            Learn → Connect → Build → Experiment
          </div>
        </div>

        {/* Lab Zones */}
        <div>
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">6 Không Gian Lab</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>Zone 01 — Community Space</li>
            <li>Zone 02 — AI Lab (GPU & Edge AI)</li>
            <li>Zone 03 — Robotics Lab (ROS2 & Vision)</li>
            <li>Zone 04 — IoT & Embedded Lab</li>
            <li>Zone 05 — Maker Space (3D & Laser)</li>
            <li>Zone 06 — Project & Event Space</li>
          </ul>
        </div>

        {/* Platform Features */}
        <div>
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Nền Tảng Digital</h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>Community Skill Directory</li>
            <li>Idea Board & Project Conversion</li>
            <li>Hardware Equipment Sharing</li>
            <li>Project Recruitment Board</li>
            <li>Tech Events & Build Night</li>
          </ul>
        </div>

        {/* Connect & Core Statement */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Triết Lý Cốt Lõi</h4>
          <p className="text-xs text-slate-600 italic">
            "VUON AI SPACE không bắt đầu từ thiết bị. VUON bắt đầu từ con người, ý tưởng và sự kết nối cộng đồng."
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-700 transition-colors shadow-2xs">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-emerald-700 transition-colors shadow-2xs">
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © 2026 VUON AI SPACE. Built for Tech Innovators & Makers.
        </div>
        <div className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> for AI & Hardware Engineers
        </div>
      </div>
    </footer>
  );
};
