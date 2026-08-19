import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { equipmentService } from '@/services/equipmentService';
import { Equipment } from '@/types';
import { Wrench, Calendar, MapPin, CheckCircle2, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const EquipmentPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [purpose, setPurpose] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const navigate = useNavigate();

  const categories = ['All', 'AI', 'Robotics', 'IoT', 'Embedded', 'Maker', 'Vision'];

  useEffect(() => {
    fetchEquipment();
  }, [selectedCategory]);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const data = await equipmentService.getEquipment(selectedCategory);
      setEquipmentList(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookingModal = (item: Equipment) => {
    setSelectedItem(item);
    setBookingError('');
    setBookingSuccess(false);
    setPurpose('');
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !startDate || !endDate || !purpose) return;

    setBookingLoading(true);
    setBookingError('');

    try {
      await equipmentService.createBooking(selectedItem.id, startDate, endDate, purpose);
      setBookingSuccess(true);
      setTimeout(() => {
        setSelectedItem(null);
        navigate('/my-bookings');
      }, 1200);
    } catch (err: any) {
      setBookingError(err.message || 'Thiết bị này không khả dụng trong khoảng ngày đã chọn.');
    } finally {
      setBookingLoading(false);
    }
  };

  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'Available':
        return <span className="tech-badge tech-badge-emerald"><CheckCircle2 className="w-3 h-3" /> Sẵn Sàng Mượn</span>;
      case 'Borrowed':
        return <span className="tech-badge tech-badge-amber"><Clock className="w-3 h-3" /> Đang Được Mượn</span>;
      case 'Maintenance':
        return <span className="tech-badge bg-rose-100 text-rose-800 border-rose-300"><AlertTriangle className="w-3 h-3" /> Bảo Trì</span>;
      default:
        return <span className="tech-badge tech-badge-violet">Đã Đặt Trước</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
          <Wrench className="w-3.5 h-3.5 text-emerald-600" /> EQUIPMENT SHARING & LAB HARDWARE
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Kho Thiết Bị & Phần Cứng Dùng Chung</h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Thành viên VUON AI SPACE có thể tra cứu và đăng ký mượn các thiết bị cao cấp (Jetson Orin, Raspberry Pi 5, Camera Depth, Máy in 3D...) để phục vụ phát triển dự án.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <span className="text-xs font-mono text-slate-500 font-bold uppercase mr-2">Danh mục:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat === 'All' ? 'Tất Cả Thiết Bị' : cat}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Đang tải danh mục thiết bị...</div>
      ) : equipmentList.length === 0 ? (
        <div className="tech-card p-12 text-center text-slate-600">Không tìm thấy thiết bị nào thuộc danh mục này.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipmentList.map((item) => (
            <div key={item.id} className="tech-card p-6 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                {/* Status & Category */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-emerald-800 border border-slate-200 font-bold">
                    {item.category}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                {/* Equipment Image / Icon */}
                <div className="h-40 w-full rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Wrench className="w-12 h-12" />
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{item.description}</p>

                {item.specifications && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 line-clamp-2 font-semibold">
                    ⚡ {item.specifications}
                  </div>
                )}
              </div>

              {/* Location & Action */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 font-bold">
                  <MapPin className="w-3 h-3 text-emerald-600" /> {item.location || 'Zone Lab'}
                </span>

                <button
                  onClick={() => handleOpenBookingModal(item)}
                  disabled={item.status !== 'Available'}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    item.status === 'Available'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  {item.status === 'Available' ? 'Đặt Mượn' : 'Không Khả Dụng'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Date-Range Booking Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="tech-card p-6 md:p-8 max-w-lg w-full space-y-6 relative border-emerald-300 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-700 font-extrabold uppercase">EQUIPMENT BOOKING</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedItem.name}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Đặt Lịch Mượn Thành Công!</h4>
                <p className="text-xs text-slate-600">Đang chuyển tới trang Lịch Sử Mượn Của Tôi...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                {bookingError && (
                  <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {bookingError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Ngày Nhận Mượn</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Ngày Dự Kiến Trả</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Mục Đích Sử Dụng</label>
                  <textarea
                    rows={3}
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="VD: Thử nghiệm thuật toán SLAM cho xe AMR trong dự án đồ án..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Hệ thống tự động kiểm tra trùng lịch mượn trên cơ sở dữ liệu. Quản trị viên Lab sẽ duyệt và cấp thiết bị theo đúng ngày đăng ký.</span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg shadow-md shadow-emerald-600/20 disabled:opacity-50"
                  >
                    {bookingLoading ? 'Đang Kiểm Tra Lịch...' : 'Xác Nhận Đặt Mượn'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
