import React, { useState, useEffect } from 'react';
import { LoadingState } from '@/components/AsyncState';
import { equipmentService } from '@/services/equipmentService';
import { Booking } from '@/types';

export const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const data = await equipmentService.getMyBookings();
      setBookings(data);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleReturnEquipment = async (bookingId: string) => {
    if (!window.confirm('Confirm that you have handed the equipment back to the lab manager?')) return;

    try {
      await equipmentService.returnEquipment(bookingId);
      alert('Status updated: equipment returned.');
      fetchMyBookings();
    } catch {
      // Handled
    }
  };

  return (
    <div className="page-shell space-y-8">
      
      {/* Header */}
      <header className="page-head">
        <div>
          <p className="page-kicker">03 / equipment bookings</p>
          <h1 className="page-title">My equipment bookings.</h1>
          <p className="page-intro">
            Track due dates and usage, then return equipment to the shared VUON AI SPACE inventory.
          </p>
        </div>
      </header>

      {/* Bookings Table */}
      {loading ? (
        <LoadingState message="Loading your bookings..." />
      ) : bookings.length === 0 ? (
        <div className="tech-card p-12 text-center text-slate-600 font-mono text-xs">You have no equipment bookings yet.</div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-mono font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-6 py-4 whitespace-nowrap">Booking dates</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="px-6 py-4 font-bold text-slate-900 min-w-[200px]">
                      {bk.equipmentName}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-700 whitespace-nowrap">
                      {bk.startDate} <span className="text-slate-400">to</span> {bk.endDate}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 font-medium max-w-sm">
                      {bk.purpose}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold inline-block whitespace-nowrap ${
                        bk.status === 'Active'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {bk.status === 'Active' ? 'Active' : 'Returned to lab'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {bk.status === 'Active' ? (
                        <button
                          onClick={() => handleReturnEquipment(bk.id)}
                          className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-2xs"
                        >
                          Mark as returned
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono font-bold">Complete</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
