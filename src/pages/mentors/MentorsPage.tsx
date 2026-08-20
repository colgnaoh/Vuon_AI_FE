import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingState, ErrorState } from '@/components/AsyncState';
import { mentorService } from '@/services/mentorService';
import { Mentor } from '@/types';
import { Search, Star, Users, CheckCircle, ExternalLink } from 'lucide-react';

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
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-800 pb-6">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {expertiseList.map((exp) => (
            <button
              key={exp}
              onClick={() => setSelectedExpertise(exp)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedExpertise === exp
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm tên, chuyên môn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Đang tải danh sách Mentor..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchMentors} />
      ) : filteredMentors.length === 0 ? (
        <div className="empty-state py-16 text-center border border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-400">Không tìm thấy Mentor phù hợp với tìm kiếm.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-gray-900/60 border border-gray-800 hover:border-purple-500/40 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start gap-4 mb-4">
                  {mentor.avatarUrl ? (
                    <img
                      src={mentor.avatarUrl}
                      alt={mentor.fullName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/40 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-xl shrink-0">
                      {mentor.fullName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                      {mentor.fullName}
                      <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                    </h3>
                    <p className="text-xs text-purple-400 font-medium">{mentor.title}</p>
                    {mentor.company && (
                      <p className="text-xs text-gray-400 mt-0.5">{mentor.company}</p>
                    )}
                  </div>
                </div>

                <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {mentor.bio}
                </p>

                {/* Expertise Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {mentor.expertise.map((exp) => (
                    <span key={exp} className="bg-gray-950 text-purple-300 text-xs px-2.5 py-1 rounded-md border border-gray-800">
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Rating & Action */}
              <div className="border-t border-gray-800/80 pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {mentor.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> {mentor.totalMentees} Mentees
                  </span>
                </div>

                <Link
                  to={`/mentors/${mentor.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Xem hồ sơ <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
