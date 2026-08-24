import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { mentorService } from '@/services/mentorService';
import { Mentor } from '@/types';
import { Search, Star, Users, CheckCircle, ArrowRight } from 'lucide-react';

export const MentorsPage: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const expertiseList = ['All', 'Computer Vision', 'Edge AI', 'ROS2', 'NLP', 'LLMs', 'Robotics', 'Embedded Systems'];

  useEffect(() => {
    void fetchMentors();
  }, [selectedExpertise]);

  const fetchMentors = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await mentorService.getMentors(selectedExpertise === 'All' ? undefined : selectedExpertise);
      setMentors(data);
    } catch {
      setError('Không thể tải danh sách Mentor.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(m =>
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page-shell">
      <header className="page-head">
        <div>
          <p className="page-kicker">03 / mentor network</p>
          <h1 className="page-title">Mạng lưới Cố vấn & Chuyên gia.</h1>
          <p className="page-intro">
            Kết nối trực tiếp 1-1 với các nhà nghiên cứu, kỹ sư phần cứng và chuyên gia AI hàng đầu để hoàn thiện dự án của bạn.
          </p>
        </div>
      </header>

      {/* Search & Filter */}
      <div className="my-8 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[var(--line)] pb-6">
        <div className="filter-row !border-0 !p-0 w-full md:w-auto">
          {expertiseList.map((exp) => (
            <button
              key={exp}
              type="button"
              onClick={() => setSelectedExpertise(exp)}
              className={`filter-chip ${selectedExpertise === exp ? '!bg-[var(--accent)] !text-white' : ''}`}
            >
              {exp}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
          <input
            type="text"
            placeholder="Tìm tên, chuyên môn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--paper-bright)] border border-[var(--line)] rounded-lg pl-9 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[var(--ink-soft)] focus:outline-none focus:border-[var(--accent)] font-mono"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Đang tải danh sách Mentor..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMentors} />
      ) : filteredMentors.length === 0 ? (
        <div className="empty-state py-16 text-center border border-dashed border-[var(--line)] rounded-2xl">
          <p className="text-[var(--ink-soft)] text-sm">Không tìm thấy Mentor phù hợp với tìm kiếm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="tech-card bg-[var(--paper-bright)] border border-[var(--line)] hover:border-[var(--accent)] p-6 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start gap-4 mb-4">
                  {mentor.avatarUrl ? (
                    <img
                      src={mentor.avatarUrl}
                      alt={mentor.fullName}
                      className="w-14 h-14 rounded-full object-cover border border-[var(--accent-soft)] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)] font-bold text-xl flex items-center justify-center shrink-0">
                      {mentor.fullName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-1.5">
                      {mentor.fullName}
                      <CheckCircle className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    </h3>
                    <p className="text-xs text-[var(--accent-strong)] font-semibold mt-0.5">{mentor.title}</p>
                    {mentor.company && (
                      <p className="text-xs text-[var(--ink-soft)] font-mono mt-0.5">{mentor.company}</p>
                    )}
                  </div>
                </div>

                <p className="text-[var(--ink-soft)] text-xs line-clamp-3 mb-4 leading-relaxed">
                  {mentor.bio}
                </p>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {mentor.expertise.map((exp) => (
                    <span key={exp} className="bg-[var(--accent-wash)] text-[var(--accent-strong)] text-[0.68rem] font-mono px-2.5 py-1 rounded border border-[var(--accent-soft)]">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Rating & Action */}
              <div className="border-t border-[var(--line)] pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[var(--ink-soft)] font-mono">
                  <span className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {mentor.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-[var(--ink)]">
                    <Users className="w-3.5 h-3.5 text-[var(--accent)]" /> {mentor.totalMentees} Mentees
                  </span>
                </div>

                <Link
                  to={`/mentors/${mentor.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent-strong)] hover:text-[var(--accent)] transition-colors"
                >
                  Xem hồ sơ <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
