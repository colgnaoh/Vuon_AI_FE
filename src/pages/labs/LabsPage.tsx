import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { labService } from '@/services/labService';
import { Lab } from '@/types';
import { Cpu, MapPin, Camera, Server, ArrowRight, CheckCircle2 } from 'lucide-react';

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
          {labs.map((lab) => (
            <div
              key={lab.id}
              className="bg-gray-900/60 border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Lab Banner Image */}
              <div className="lg:col-span-5 relative h-64 lg:h-auto overflow-hidden bg-gray-950">
                {lab.imageUrl ? (
                  <img
                    src={lab.imageUrl}
                    alt={lab.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-indigo-900/40 flex items-center justify-center">
                    <Cpu className="w-16 h-16 text-blue-400" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-gray-950/80 backdrop-blur-md text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {lab.status}
                  </span>
                  {lab.aiCameraActive && (
                    <span className="bg-gray-950/80 backdrop-blur-md text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" /> AI Camera Live Monitoring
                    </span>
                  )}
                </div>
              </div>

              {/* Lab Details */}
              <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{lab.name}</h2>
                  <p className="text-gray-400 text-xs flex items-center gap-1.5 mb-4">
                    <MapPin className="w-4 h-4 text-purple-400 shrink-0" /> {lab.location}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {lab.description}
                  </p>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-gray-950/60 border border-gray-800/80">
                    <div className="text-center border-r border-gray-800/80 pr-2">
                      <div className="text-xs text-gray-400">Sức chứa</div>
                      <div className="text-lg font-extrabold text-white mt-0.5">{lab.capacity} chỗ</div>
                    </div>
                    <div className="text-center border-r border-gray-800/80 pr-2">
                      <div className="text-xs text-gray-400">Trạm máy hoạt động</div>
                      <div className="text-lg font-extrabold text-blue-400 mt-0.5">{lab.activeWorkstations} / {lab.capacity}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Thiết bị sẵn có</div>
                      <div className="text-lg font-extrabold text-purple-400 mt-0.5">{lab.equipmentCount} thiết bị</div>
                    </div>
                  </div>

                  {/* Facilities List */}
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Trang thiết bị nổi bật:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lab.facilities.map((fac, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800/80 flex justify-end">
                  <Link
                    to="/equipment"
                    className="inline-flex items-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold px-5 py-2.5 rounded-xl border border-blue-500/30 text-sm transition-all"
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
