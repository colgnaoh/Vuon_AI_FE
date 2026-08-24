import React, { useState } from 'react';
import { Dialog } from '@/components/Dialog';
import { eventService } from '@/services/eventService';
import { TechEvent } from '@/types';

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newEvent: TechEvent) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ open, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TechEvent['category']>('Workshop');
  const [speaker, setSpeaker] = useState('');
  const [speakerRole, setSpeakerRole] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(50);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !speaker || !date || !location || !description) return;

    setLoading(true);
    try {
      const created = await eventService.createEvent({
        title,
        category,
        speaker,
        speakerRole,
        date: new Date(date).toISOString(),
        location,
        maxParticipants,
        description,
        agenda: [
          { time: '09:00 - 09:30', topic: 'Check-in & Khai mạc' },
          { time: '09:30 - 11:30', topic: 'Nội dung chính sự kiện & Thực hành' }
        ]
      });
      onSuccess(created);
      onClose();
    } catch {
      alert('Tạo sự kiện thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Tạo Sự Kiện Công Nghệ Mới" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="field-label">Tên sự kiện</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Workshop Tối Ưu Hóa Model AI Trên Jetson..."
            className="form-field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Thể loại</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TechEvent['category'])}
              className="form-field"
            >
              <option value="Workshop">Workshop</option>
              <option value="Tech Talk">Tech Talk</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Build Night">Build Night</option>
              <option value="Demo Day">Demo Day</option>
            </select>
          </div>

          <div>
            <label className="field-label">Số lượng tham gia tối đa</label>
            <input
              type="number"
              min={5}
              max={500}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(Number(e.target.value))}
              className="form-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Diễn giả / Người chủ trì</label>
            <input
              type="text"
              required
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="VD: TS. Nguyễn Văn A"
              className="form-field"
            />
          </div>

          <div>
            <label className="field-label">Chức danh / Đơn vị</label>
            <input
              type="text"
              value={speakerRole}
              onChange={(e) => setSpeakerRole(e.target.value)}
              placeholder="VD: AI Lead @ Vườn AI"
              className="form-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Thời gian tổ chức</label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-field"
            />
          </div>

          <div>
            <label className="field-label">Địa điểm</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="VD: Zone 02 - AI Lab"
              className="form-field"
            />
          </div>
        </div>

        <div>
          <label className="field-label">Mô tả sự kiện</label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nội dung chi tiết của sự kiện..."
            className="form-field"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--line)]">
          <button type="button" onClick={onClose} className="btn-secondary">
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : 'Tạo sự kiện'}
          </button>
        </div>
      </form>
    </Dialog>
  );
};
