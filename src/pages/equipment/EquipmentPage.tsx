import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@/components/Dialog';
import { ErrorState, LoadingState } from '@/components/AsyncState';
import { equipmentService } from '@/services/equipmentService';
import { Equipment } from '@/types';

const categories = ['All', 'AI', 'Robotics', 'IoT', 'Embedded', 'Maker', 'Vision'];

export const EquipmentPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    void fetchEquipment();
  }, [selectedCategory]);

  const fetchEquipment = async () => {
    setLoading(true);
    setError('');
    try {
      setEquipmentList(await equipmentService.getEquipment(selectedCategory));
    } catch {
      setError('Equipment inventory could not be loaded.');
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

  const handleSubmitBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedItem || !purpose) return;
    if (endDate < startDate) {
      setBookingError('The return date must be on or after the pickup date.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    try {
      await equipmentService.createBooking(selectedItem.id, startDate, endDate, purpose);
      setBookingSuccess(true);
      window.setTimeout(() => {
        setSelectedItem(null);
        navigate('/my-bookings');
      }, 1000);
    } catch (bookingErr: unknown) {
      setBookingError(bookingErr instanceof Error ? bookingErr.message : 'This equipment is not available for the selected dates.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-head">
        <div>
          <p className="page-kicker">03 / shared equipment</p>
          <h1 className="page-title">Tools that make prototypes run.</h1>
          <p className="page-intro">Browse the equipment on hand, find the right tool for your problem and reserve what your next prototype needs.</p>
        </div>
      </header>

      <div className="filter-row" aria-label="Filter by equipment category"><span className="mr-3 self-center font-mono text-[0.63rem] uppercase tracking-wider text-[var(--ink-soft)]">category</span>{categories.map((category) => <button key={category} type="button" onClick={() => setSelectedCategory(category)} aria-pressed={selectedCategory === category} className="filter-chip">{category}</button>)}</div>

      {loading ? <LoadingState message="Loading equipment catalog..." /> : error ? <ErrorState message={error} onRetry={fetchEquipment} /> : equipmentList.length === 0 ? <div className="empty-state"><p>No equipment matches this category.</p></div> : (
        <div className="resource-grid">
          {equipmentList.map((item) => <article key={item.id} className="tech-card resource-card catalog-card">
            <div>
              <div className="resource-card-meta"><span className="tag">{item.category}</span></div>
              <div className="mt-6 overflow-hidden border border-[var(--line)] bg-[var(--paper-deep)]">{item.imageUrl && !imageErrors[item.id] ? <img src={item.imageUrl} alt={item.name} onError={() => setImageErrors((current) => ({ ...current, [item.id]: true }))} className="h-44 w-full object-cover" /> : <div className="grid h-44 place-items-center px-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--accent)]">no image / equipment</div>}</div>
              <h2 className="mt-6 text-3xl">{item.name}</h2>
              <p>{item.description}</p>
              {item.specifications && <p className="mt-4 bg-[var(--accent-wash)] p-3 font-mono text-[0.64rem] text-[var(--accent-strong)]">{item.specifications}</p>}
              {item.status === 'Available' && <div className="mt-5 flex items-center justify-end border-t border-[var(--line)] pt-4"><button type="button" onClick={() => handleOpenBookingModal(item)} className="btn-primary">Reserve equipment</button></div>}
            </div>
          </article>)}
        </div>
      )}

      {selectedItem && <Dialog open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} title={selectedItem.name} size="md">
        {bookingSuccess ? <div className="space-y-3 py-6 text-center"><p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">booking confirmed</p><h2 className="text-3xl">Your reservation is held.</h2><p className="text-sm text-[var(--ink-soft)]">Taking you to your bookings.</p></div> : <form onSubmit={handleSubmitBooking} className="space-y-5">
          {bookingError && <div role="alert" className="border-l-2 border-[#bb7765] bg-[#f5e8e3] px-3 py-2 text-xs text-[#8c4535]">{bookingError}</div>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div><label htmlFor="booking-start" className="field-label">pickup date</label><input id="booking-start" type="date" required min={new Date().toISOString().split('T')[0]} value={startDate} onChange={(event) => setStartDate(event.target.value)} className="form-field" /></div><div><label htmlFor="booking-end" className="field-label">expected return date</label><input id="booking-end" type="date" required min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} className="form-field" /></div></div>
          <div><label htmlFor="booking-purpose" className="field-label">what will you use it for?</label><textarea id="booking-purpose" rows={4} required value={purpose} onChange={(event) => setPurpose(event.target.value)} placeholder="Briefly describe the experiment you want to run" className="form-field" /></div>
          <div className="border-l-2 border-[var(--accent)] bg-[var(--accent-wash)] p-3 text-xs leading-5 text-[var(--ink-soft)]"><span className="field-label mr-2 inline">note</span>Dates are checked for conflicts before the request reaches the lab manager.</div>
          <div className="flex justify-end gap-3 border-t border-[var(--line)] pt-4"><button type="button" onClick={() => setSelectedItem(null)} className="btn-secondary">Cancel</button><button type="submit" disabled={bookingLoading} className="btn-primary disabled:cursor-wait disabled:opacity-50">{bookingLoading ? 'Checking...' : 'Confirm reservation'}</button></div>
        </form>}
      </Dialog>}
    </div>
  );
};
