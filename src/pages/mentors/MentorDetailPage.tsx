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
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[var(--ink-soft)] hover:text-[var(--accent)] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách Mentor
      </button>

      {/* Main Mentor Card */}
      <div className="tech-card bg-[var(--paper-bright)] border border-[var(--line)] shadow-[var(--shadow-paper)] p-6 md:p-10 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {mentor.avatarUrl ? (
            <img
              src={mentor.avatarUrl}
              alt={mentor.fullName}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-[var(--accent-soft)] shrink-0 shadow"
            />
          ) : (
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[var(--accent-soft)] border-4 border-[var(--accent-wash)] flex items-center justify-center text-[var(--accent-strong)] font-bold text-4xl shrink-0">
              {mentor.fullName.charAt(0)}
            </div>
          )}

          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--ink)]">{mentor.fullName}</h1>
                <span className="bg-[var(--accent-wash)] text-[var(--accent-strong)] text-xs font-mono font-bold px-3 py-1 rounded border border-[var(--accent-soft)]">
                  Certified Vườn AI Mentor
                </span>
              </div>
              <p className="text-[var(--accent-strong)] font-bold text-sm">{mentor.title}</p>
              {mentor.company && <p className="text-[var(--ink-soft)] font-mono text-xs mt-0.5">{mentor.company}</p>}
            </div>

            <p className="text-[var(--ink)] text-sm leading-relaxed max-w-3xl">
              {mentor.bio}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[var(--ink-soft)] font-mono pt-2 border-t border-[var(--line)]">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" /> {mentor.rating} / 5.0 Rating
              </div>
              <div className="flex items-center gap-1.5 text-[var(--ink)] font-semibold">
                <Users className="w-4 h-4 text-[var(--accent)]" /> {mentor.totalMentees} Dự án đã tư vấn
              </div>
              {mentor.contactEmail && (
                <div className="flex items-center gap-1.5 text-[var(--ink-soft)]">
                  <Mail className="w-4 h-4 text-[var(--accent)]" /> {mentor.contactEmail}
                </div>
              )}
            </div>

            {/* Expertise Badges */}
            <div className="pt-2">
              <div className="text-[0.65rem] text-[var(--ink-soft)] font-mono font-bold uppercase tracking-wider mb-2">Lĩnh vực chuyên môn chính:</div>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((exp) => (
                  <span key={exp} className="bg-[var(--accent-wash)] text-[var(--accent-strong)] text-xs font-mono font-semibold px-3 py-1.5 rounded border border-[var(--accent-soft)]">
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary text-xs"
              >
                <MessageSquarePlus className="w-4 h-4" /> Gửi yêu cầu kết nối / Đặt lịch tư vấn
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--paper-bright)] border border-[var(--line)] rounded-2xl p-6 md:p-8 max-w-lg w-full relative shadow-[var(--shadow-paper)]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-[var(--ink-soft)] hover:text-[var(--ink)]"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-[var(--ink)] mb-2">
              Gửi yêu cầu tư vấn đến {mentor.fullName}
            </h2>
            <p className="text-xs text-[var(--ink-soft)] mb-6">
              Vui lòng cung cấp thông tin dự án hoặc chủ đề bạn cần tư vấn để Mentor chuẩn bị nội dung hỗ trợ tốt nhất.
            </p>

            {modalSuccess ? (
              <div className="p-4 rounded-xl bg-[var(--accent-wash)] border border-[var(--accent-soft)] text-[var(--accent-strong)] text-xs font-bold flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{modalSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-4">
                <div>
                  <label className="field-label">Chủ đề tư vấn *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Tối ưu mô hình YOLOv8 trên Jetson Nano"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="form-field"
                  />
                </div>

                <div>
                  <label className="field-label">Mô tả chi tiết bài toán / khó khăn *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Mô tả sơ lược về dự án, khó khăn hiện tại và những câu hỏi bạn muốn được tư vấn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-field"
                  />
                </div>

                <div>
                  <label className="field-label">Thời gian mong muốn (Không bắt buộc)</label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="form-field"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-[var(--line)]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50"
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
