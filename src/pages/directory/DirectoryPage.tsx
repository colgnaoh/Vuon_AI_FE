import React, { useState, useEffect } from 'react';
import { profileService } from '@/services/profileService';
import { UserProfile } from '@/types';
import { Search, UserCheck, MessageSquarePlus, Sparkles } from 'lucide-react';

export const DirectoryPage: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [searchSkill, setSearchSkill] = useState('');
  const [selectedSkillChip, setSelectedSkillChip] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const popularSkills = ['Python', 'ROS2', 'ESP32', 'Jetson Orin', 'YOLOv8', 'STM32', 'React', 'C++'];

  useEffect(() => {
    fetchProfiles();
  }, [selectedSkillChip]);

  const fetchProfiles = async (query?: string) => {
    setLoading(true);
    try {
      const activeSkill = query !== undefined ? query : selectedSkillChip || undefined;
      const data = await profileService.searchProfiles(activeSkill);
      setProfiles(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles(searchSkill);
  };

  const handleChipClick = (skill: string) => {
    if (selectedSkillChip === skill) {
      setSelectedSkillChip(null);
      fetchProfiles('');
    } else {
      setSelectedSkillChip(skill);
      setSearchSkill('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> SKILL DIRECTORY & TALENT MATCHING
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Thư Mục Thành Viên & Kỹ Năng</h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Tìm kiếm những AI Engineer, Embedded Developer, Robotics Expert hoặc UI Designer để cùng đồng hành trong dự án công nghệ của bạn.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="tech-card p-4 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              placeholder="Nhập tên kỹ năng (vd: ROS2, Jetson, Python, ESP32)..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-lg text-sm text-slate-900 focus:outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-emerald-600/20"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
          <span className="text-xs font-mono text-slate-500 font-bold uppercase mr-1">Kỹ năng phổ biến:</span>
          {popularSkills.map((skill) => {
            const active = selectedSkillChip === skill;
            return (
              <button
                key={skill}
                onClick={() => handleChipClick(skill)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                  active
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Đang tải danh sách thành viên...</div>
      ) : profiles.length === 0 ? (
        <div className="tech-card p-12 text-center text-slate-600 space-y-3">
          <p>Không tìm thấy thành viên nào phù hợp với kỹ năng được chọn.</p>
          <button
            onClick={() => {
              setSelectedSkillChip(null);
              setSearchSkill('');
              fetchProfiles('');
            }}
            className="text-xs font-mono font-bold text-emerald-700 hover:underline"
          >
            Xem tất cả thành viên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="tech-card p-6 flex flex-col justify-between space-y-4">
              
              <div className="space-y-4">
                {/* Header Profile Info */}
                <div className="flex items-start gap-4">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-base border border-emerald-300">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      {profile.fullName}
                      {profile.globalRole === 'Admin' && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                          ADMIN
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{profile.bio}</p>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Kỹ năng công nghệ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Looking For details */}
                {profile.lookingFor && (
                  <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-amber-800 flex items-center gap-1 font-extrabold uppercase">
                      <UserCheck className="w-3 h-3 text-amber-600" /> Đang tìm kiếm:
                    </span>
                    <p className="text-slate-800 italic text-[11px] leading-relaxed">{profile.lookingFor}</p>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Member ID: {profile.id}</span>
                <button
                  onClick={() => alert(`Đã gửi lời mời kết nối tới ${profile.fullName}!`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 hover:border-emerald-300"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" /> Kết Nối
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
