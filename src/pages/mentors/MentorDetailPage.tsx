import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { mentorService } from '@/services/mentorService';
import { Mentor } from '@/types';
import { ArrowLeft, Star, Users, Mail, CheckCircle2, MessageSquarePlus, X } from 'lucide-react';


export const MentorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Consultation Modal State
  const [showModal, setShowModal] = useState(false);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');

  useEffect(() => {
    if (id) {
      void fetchMentorDetail(id);
    }
  }, [id]);

  const fetchMentorDetail = async (mentorId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await mentorService.getMentorById(mentorId);
      setMentor(data);
    } catch {
      setError('Không tìm thấy thông tin Mentor.');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentor || !topic || !description) return;
    setSubmitting(true);
    try {
      const res = await mentorService.requestConsultation(mentor.id, { topic, description, preferredDate });
      setModalSuccess(res.message);
      setTimeout(() => {
        setShowModal(false);
        setModalSuccess('');
        setTopic('');
        setDescription('');
        setPreferredDate('');
      }, 2000);
    } catch {
      setError('Không thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState message="Đang tải thông tin Mentor..." />;
  if (error || !mentor) return <ErrorState message={error || 'Mentor không tồn tại'} onRetry={() => id && fetchMentorDetail(id)} />;

  return (
    <div className="page-shell">
      <button
        onClick={() => navigate('/mentors')}
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách Mentor
      </button>

      {/* Main Mentor Card */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 md:p-10 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {mentor.avatarUrl ? (
            <img
              src={mentor.avatarUrl}
              alt={mentor.fullName}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-purple-500/40 shrink-0 shadow-xl shadow-purple-500/10"
            />
          ) : (
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-purple-600/30 border-4 border-purple-500/40 flex items-center justify-center text-purple-200 font-bold text-4xl shrink-0">
              {mentor.fullName.charAt(0)}
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">{mentor.fullName}</h1>
                <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full border border-purple-500/30">
                  Certified Vườn AI Mentor
                </span>
              </div>
              <p className="text-purple-400 font-medium text-base">{mentor.title}</p>
              {mentor.company && <p className="text-gray-400 text-sm">{mentor.company}</p>}
            </div>

            <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
              {mentor.bio}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 pt-2 border-t border-gray-800/80">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" /> {mentor.rating} / 5.0 Rating
              </div>
              <div className="flex items-center gap-1.5 text-blue-400">
                <Users className="w-4 h-4" /> {mentor.totalMentees} Dự án đã tư vấn
              </div>
              {mentor.contactEmail && (
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Mail className="w-4 h-4 text-purple-400" /> {mentor.contactEmail}
                </div>
              )}
            </div>

            {/* Expertise Badges */}
            <div className="pt-2">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Lĩnh vực chuyên môn chính:</div>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((exp) => (
                  <span key={exp} className="bg-purple-950/80 text-purple-200 text-xs px-3 py-1.5 rounded-lg border border-purple-800/60 font-medium">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-600/25 transition-all"
              >
                <MessageSquarePlus className="w-5 h-5" /> Gửi yêu cầu kết nối / Đặt lịch tư vấn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-2">
              Gửi yêu cầu tư vấn đến {mentor.fullName}
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Vui lòng cung cấp thông tin dự án hoặc chủ đề bạn cần tư vấn để Mentor chuẩn bị nội dung hỗ trợ tốt nhất.
            </p>

            {modalSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{modalSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Chủ đề tư vấn *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tối ưu mô hình YOLOv8 trên Jetson Nano"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Mô tả chi tiết bài toán / khó khăn *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Mô tả sơ lược về dự án, khó khăn hiện tại và những câu hỏi bạn muốn được tư vấn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Thời gian mong muốn (Không bắt buộc)</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-800 text-sm text-gray-400 hover:text-white"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-600/25"
                  >
                    {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
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
