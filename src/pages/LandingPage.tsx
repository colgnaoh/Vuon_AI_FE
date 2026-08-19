import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Cpu, 
  Bot, 
  Radio, 
  Printer, 
  Lightbulb, 
  Users, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Rocket, 
  Code2, 
  Layers 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const zones = [
    { id: '01', name: 'Community Space', desc: 'Không gian mở thảo luận, brainstorm ý tưởng & networking.', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { id: '02', name: 'AI Lab', desc: 'GPU Server, Edge AI Devices, NVIDIA Jetson & Vision Models.', icon: Cpu, color: 'from-teal-500 to-cyan-600' },
    { id: '03', name: 'Robotics Lab', desc: 'Robot Arm, AGV/AMR, ROS2 Nav2, SLAM & Digital Twin.', icon: Bot, color: 'from-violet-500 to-indigo-600' },
    { id: '04', name: 'IoT & Embedded Lab', desc: 'ESP32, STM32, LoRaWAN, Sensor Network & TinyML.', icon: Radio, color: 'from-amber-500 to-orange-500' },
    { id: '05', name: 'Maker Space', desc: 'Máy in 3D Bambu Lab, Laser Cutter & Soldering Station.', icon: Printer, color: 'from-orange-500 to-rose-500' },
    { id: '06', name: 'Project & Event Space', desc: 'Khu vực phát triển prototype, Workshop & Demo Day.', icon: Rocket, color: 'from-emerald-600 to-green-600' },
  ];

  const workflowSteps = [
    { title: '1. Ý Tưởng (Idea)', desc: 'Đăng ý tưởng lên Idea Board hoặc tham gia ý tưởng từ cộng đồng.', icon: Lightbulb },
    { title: '2. Lập Team & Mentor', desc: 'Tìm kiếm đồng đội theo kỹ năng trong Skill Directory & chọn Mentor.', icon: Users },
    { title: '3. Mượn Thiết Bị', desc: 'Đặt mượn Jetson, Raspberry Pi, Camera Depth hay máy in 3D từ kho chung.', icon: Layers },
    { title: '4. Chế Tạo Prototype', desc: 'Làm việc trực tiếp tại không gian Lab để phát triển sản phẩm thực tế.', icon: Code2 },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden border-b border-slate-200 bg-gradient-to-b from-emerald-50/50 via-teal-50/30 to-[#F8FAFC]">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-400/20 via-teal-400/20 to-amber-300/20 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold shadow-2xs">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            VƯỜN ƯƠM CÔNG NGHỆ & SÁNG TẠO MỞ
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
            Nơi Biến Ý Tưởng <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">AI & Hardware</span> Thành Sản Phẩm Thực Tế
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            <strong>VUON AI SPACE</strong> cung cấp hệ sinh thái toàn diện: Không gian làm việc, Kho thiết bị thử nghiệm (Jetson, ROS2, ESP32, 3D Printer), Mạng lưới Mentor và Nền tảng kết nối đồng đội.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/ideas"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all group text-sm"
            >
              Khám Phá Ý Tưởng Cộng Đồng
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/equipment"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold rounded-xl shadow-2xs transition-all text-sm flex items-center justify-center gap-2"
            >
              Mượn Thiết Bị Lab
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="tech-card p-4 text-center">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">50+</span>
              <span className="block text-xs font-semibold text-slate-500 mt-1">Thành viên Active</span>
            </div>
            <div className="tech-card p-4 text-center">
              <span className="text-2xl font-extrabold text-emerald-600 font-mono">12+</span>
              <span className="block text-xs font-semibold text-slate-500 mt-1">Dự án Đang Chạy</span>
            </div>
            <div className="tech-card p-4 text-center">
              <span className="text-2xl font-extrabold text-teal-600 font-mono">30+</span>
              <span className="block text-xs font-semibold text-slate-500 mt-1">Thiết Bị Khả Dụng</span>
            </div>
            <div className="tech-card p-4 text-center">
              <span className="text-2xl font-extrabold text-amber-600 font-mono">6</span>
              <span className="block text-xs font-semibold text-slate-500 mt-1">Khu Vực Lab Chuyên Sâu</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6 Functional Zones Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-xs font-mono text-emerald-600 font-extrabold uppercase tracking-widest">Mô Hình Không Gian</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">6 Khu Vực Chức Năng Tại VUON AI SPACE</h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Được thiết kế đáp ứng trọn vẹn chu kỳ phát triển phần cứng, phần mềm và trí tuệ nhân tạo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => {
            const Icon = zone.icon;
            return (
              <div key={zone.id} className="tech-card p-6 space-y-4 relative group overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${zone.color} text-white shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-bold">ZONE {zone.id}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{zone.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{zone.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow Section: Learn -> Connect -> Build */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <h2 className="text-xs font-mono text-teal-600 font-extrabold uppercase tracking-widest">Quy Trình Ươm Mầm</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">Từ Ý Tưởng Đến Nguyên Mẫu Thực Tế</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="tech-card p-6 space-y-3 relative">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Core Statement Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tech-card p-8 md:p-12 text-center space-y-6 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-emerald-200 shadow-md">
          <Sprout className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            "VUON AI SPACE – Where Ideas Grow"
          </h3>
          <p className="text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Một không gian dành cho những ai khao khát học hỏi, tìm người đồng hành và tạo ra sản phẩm đột phá.
          </p>
          <div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/20"
            >
              Đăng Ký Thành Viên Ngay
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
