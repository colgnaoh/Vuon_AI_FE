import React, { useState, useEffect } from 'react';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
          MY EQUIPMENT BOOKINGS
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">My equipment bookings</h1>
        <p className="text-sm text-slate-600">
          Track due dates and usage, then return equipment to the shared VUON AI SPACE inventory.
        </p>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="tech-card p-12 text-center text-slate-600">You have no equipment bookings yet.</div>
      ) : (
        <div className="tech-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-mono font-bold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Equipment</th>
                  <th className="px-6 py-4">Booking dates</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      {bk.equipmentName}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-700">
                      {bk.startDate} <span className="text-slate-400">to</span> {bk.endDate}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate font-medium">
                      {bk.purpose}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        bk.status === 'Active'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {bk.status === 'Active' ? 'Active' : 'Returned to lab'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {bk.status === 'Active' ? (
                        <button
                          onClick={() => handleReturnEquipment(bk.id)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
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
