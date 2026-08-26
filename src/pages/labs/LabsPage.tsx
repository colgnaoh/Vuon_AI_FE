import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { labService } from '@/services/labService';
import { Lab } from '@/types';
import { Cpu, MapPin, Camera, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LabsPage: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchLabs();
  }, []);

  const fetchLabs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await labService.getLabs();
      setLabs(data);
    } catch {
      setError('Không thể tải thông tin phòng Lab.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-head">
        <div>
          <p className="page-kicker">04 / lab facilities & hardware space</p>
          <h1 className="page-title">Không gian Phòng Lab & Cơ sở Vật chất.</h1>
          <p className="page-intro">
            Khám phá các phòng Lab nghiên cứu AI, xưởng chế tạo phần cứng IoT và khu thí nghiệm Robot được trang bị thiết bị hiện đại.
          </p>
        </div>
      </header>

      {loading ? (
        <LoadingState message="Đang tải danh sách phòng Lab..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchLabs} />
      ) : (
        <div className="space-y-8">
          {(labs || []).map((lab) => (
            <div
              key={lab.id}
              className="tech-card bg-[var(--paper-bright)] border border-[var(--line)] rounded-2xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 shadow-[var(--shadow-paper)]"
            >
              {/* Lab Banner Image */}
              <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden bg-[var(--paper-deep)] border-b lg:border-b-0 lg:border-r border-[var(--line)]">
                {lab.imageUrl ? (
                  <img
                    src={lab.imageUrl}
                    alt={lab.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--accent-wash)] flex items-center justify-center text-[var(--accent)]">
                    <Cpu className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-[var(--accent-strong)] text-white text-xs font-mono font-bold px-3 py-1 rounded border border-white/20 flex items-center gap-1.5 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {lab.status}
                  </span>
                  {lab.aiCameraActive && (
                    <span className="bg-[var(--accent)] text-white text-xs font-mono font-bold px-3 py-1 rounded border border-white/20 flex items-center gap-1.5 shadow-md">
                      <Camera className="w-3.5 h-3.5" /> AI Camera Live Monitoring
                    </span>
                  )}
                </div>
              </div>

              {/* Lab Details */}
              <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[var(--ink)] mb-2">{lab.name}</h2>
                  <p className="text-[var(--ink-soft)] text-xs font-mono flex items-center gap-1.5 mb-4">
                    <MapPin className="w-4 h-4 text-[var(--accent)] shrink-0" /> {lab.location}
                  </p>
                  <p className="text-[var(--ink)] text-sm leading-relaxed mb-6">
                    {lab.description}
                  </p>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-[var(--paper)] border border-[var(--line)]">
                    <div className="text-center border-r border-[var(--line)] pr-2">
                      <div className="text-xs text-[var(--ink-soft)] font-mono">Sức chứa</div>
                      <div className="text-base font-extrabold text-[var(--ink)] font-mono mt-0.5">{lab.capacity} chỗ</div>
                    </div>
                    <div className="text-center border-r border-[var(--line)] pr-2">
                      <div className="text-xs text-[var(--ink-soft)] font-mono">Trạm máy hoạt động</div>
                      <div className="text-base font-extrabold text-[var(--accent-strong)] font-mono mt-0.5">{lab.activeWorkstations} / {lab.capacity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-[var(--ink-soft)] font-mono">Thiết bị sẵn có</div>
                      <div className="text-base font-extrabold text-[var(--accent)] font-mono mt-0.5">{lab.equipmentCount} thiết bị</div>
                    </div>
                  </div>

                  {/* Facilities List */}
                  <div>
                    <div className="text-[0.65rem] font-mono font-bold text-[var(--ink-soft)] uppercase tracking-wider mb-2">Trang thiết bị nổi bật:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(lab.facilities || []).map((fac, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[var(--ink)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--line)] flex justify-end">
                  <Link
                    to="/equipment"
                    className="btn-primary text-xs"
                  >
                    Mượn thiết bị tại Lab này <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
