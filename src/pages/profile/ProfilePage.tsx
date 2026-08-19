import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import { UserProfile } from '@/types';
import { ErrorState, LoadingState } from '@/components/AsyncState';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
      setFullName(data.fullName);
      setBio(data.bio || '');
      setLookingFor(data.lookingFor || '');
      setSkills(data.skills || []);
    } catch {
      setError('Your profile could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await profileService.updateMyProfile({
        fullName,
        bio,
        lookingFor,
        skills,
      });
      setProfile(updated);
      setIsEditing(false);
    } catch {
      // Handled
    }
  };

  if (loading) return <LoadingState message="Loading your profile..." />;
  if (error || !profile) return <ErrorState message={error || 'No profile information available.'} onRetry={fetchProfile} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Banner */}
      <div className="tech-card p-6 md:p-8 space-y-6 relative overflow-hidden bg-white border-emerald-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-4">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 font-extrabold flex items-center justify-center text-xl border-2 border-emerald-300">
                {profile?.fullName.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                {profile?.fullName}
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  {profile?.globalRole}
                </span>
              </h1>
              <p className="text-xs font-mono text-slate-500 mt-1 font-semibold">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors border border-slate-300 shadow-2xs self-start sm:self-auto"
          >
            {isEditing ? (
              <>
                 Cancel editing
              </>
            ) : (
              <>
                 Edit profile
              </>
            )}
          </button>
        </div>

        {/* Profile Content View / Edit */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-6 pt-2">
            <div>
              <label htmlFor="profile-name" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Full name</label>
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              />
            </div>

            <div>
              <label htmlFor="profile-bio" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">About you (bio)</label>
              <textarea
                id="profile-bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. AI Engineer | Computer Vision, ROS2 & NVIDIA Jetson..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              />
            </div>

            <div>
              <label htmlFor="profile-looking-for" className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Looking for</label>
              <input
                id="profile-looking-for"
                type="text"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                placeholder="e.g. An ESP32 developer for a robot vision project..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
              />
            </div>

            {/* Skills Editor */}
            <div className="space-y-2">
              <label htmlFor="profile-new-skill" className="block text-xs font-mono text-slate-700 uppercase font-bold">Technical skills</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-mono border border-emerald-300 font-bold flex items-center gap-1.5"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove skill ${skill}`}
                      className="hover:text-rose-600"
                    >
                      remove
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  id="profile-new-skill"
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="Add a skill (e.g. PyTorch, STM32)..."
                  className="flex-1 rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-xs text-emerald-800 border border-emerald-300 rounded flex items-center gap-1 font-mono font-bold"
                >
                   Add skill
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="btn-primary"
              >
                 Save changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1 font-bold">About</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {profile?.bio || 'No bio added yet.'}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2 font-bold">Technical skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No skills added yet.</span>
                )}
              </div>
            </div>

            {profile?.lookingFor && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-xs font-mono text-amber-800 font-extrabold flex items-center gap-1.5 uppercase">
                   Looking for an opportunity / teammate:
                </span>
                <p className="text-xs text-slate-800 italic leading-relaxed">{profile.lookingFor}</p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
