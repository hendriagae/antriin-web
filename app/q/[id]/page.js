'use client';

import { useEffect, useState, use } from 'react';
import axios from 'axios';

export default function QueuePage({ params }) {
  const { id } = use(params);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`/api/queue/status/${id}`);
      setEntry(res.data.entry);
    } catch (err) {
      setError('Antrian tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Yakin mau batalkan antrian?')) return;
    try {
      await axios.post('/api/queue/cancel', { entry_id: id });
      fetchStatus();
    } catch (err) {
      alert('Gagal membatalkan antrian');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-600 text-lg">Memuat antrian...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <p className="text-red-600 text-lg">{error}</p>
    </div>
  );

  const statusLabel = {
    waiting: '⏳ Menunggu',
    called: '📢 Dipanggil!',
    serving: '✅ Sedang Dilayani',
    done: '🎉 Selesai',
    cancelled: '❌ Dibatalkan',
    skipped: '⏭️ Dilewati',
    expired: '🔒 Antrian Tutup'
  };

  const statusColor = {
    waiting: 'bg-yellow-100 text-yellow-800',
    called: 'bg-blue-100 text-blue-800',
    serving: 'bg-green-100 text-green-800',
    done: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    skipped: 'bg-orange-100 text-orange-800',
    expired: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-600">Antriin</h1>
          <p className="text-gray-500 text-sm mt-1">Nomor Antrianmu</p>
        </div>

        <div className="bg-green-500 text-white rounded-2xl py-8 mb-6">
          <p className="text-8xl font-bold">{String(entry.display_number).padStart(3, '0')}</p>
        </div>

        <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${statusColor[entry.status]}`}>
          {statusLabel[entry.status]}
        </div>

        {entry.status === 'waiting' && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Di depanmu</span>
              <span className="font-semibold text-sm text-gray-800">{entry.ahead} orang</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Estimasi tunggu</span>
              <span className="font-semibold text-sm text-gray-800">~{entry.estimasi_menit} menit</span>
            </div>
          </div>
        )}

        {entry.status === 'called' && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-700 font-medium">Giliranmu sekarang!</p>
            <p className="text-blue-500 text-sm mt-1">Segera menuju ke kasir</p>
          </div>
        )}

        {entry.customer_name && (
          <p className="text-gray-400 text-sm mb-4">Halo, {entry.customer_name} 👋</p>
        )}

        {entry.status === 'waiting' && (
          <button
            onClick={handleCancel}
            className="w-full border border-red-300 text-red-500 py-3 rounded-xl text-sm hover:bg-red-50 transition"
          >
            Batalkan Antrian
          </button>
        )}

        <p className="text-gray-300 text-xs mt-4">Halaman diperbarui otomatis setiap 10 detik</p>
      </div>
    </div>
  );
}