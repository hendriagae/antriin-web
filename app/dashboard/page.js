'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState(null);
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('merchant');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      router.push('/login');
      return;
    }
    setMerchant(JSON.parse(stored));
    fetchQueue(token);
    const interval = setInterval(() => fetchQueue(token), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async (token) => {
    try {
      const res = await axios.get('/api/queue/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data.entries);
      setSummary(res.data.summary);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenClose = async () => {
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      if (merchant.is_open) {
        await axios.post('/api/queue/close', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updated = { ...merchant, is_open: false };
        setMerchant(updated);
        localStorage.setItem('merchant', JSON.stringify(updated));
      } else {
        await axios.post('/api/queue/open', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const updated = { ...merchant, is_open: true };
        setMerchant(updated);
        localStorage.setItem('merchant', JSON.stringify(updated));
      }
      fetchQueue(token);
    } catch (err) {
      alert('Gagal mengubah status antrian');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCallNext = async () => {
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      const res = await axios.post('/api/queue/call-next', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchQueue(token);
    } catch (err) {
      alert(err.response?.data?.error || 'Tidak ada antrian tersisa');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDone = async (entryId) => {
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      await axios.post('/api/queue/done', { entry_id: entryId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQueue(token);
    } catch (err) {
      alert('Gagal menandai selesai');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkip = async (entryId, displayNumber) => {
    if (!confirm(`Skip nomor ${displayNumber}?`)) return;
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      await axios.post('/api/queue/skip', { entry_id: entryId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQueue(token);
    } catch (err) {
      alert('Gagal skip antrian');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('merchant');
    router.push('/login');
  };

  const statusLabel = {
    waiting: 'Menunggu',
    called: 'Dipanggil',
    serving: 'Dilayani',
    done: 'Selesai',
    cancelled: 'Dibatalkan',
    skipped: 'Dilewati',
    expired: 'Hangus'
  };

  const statusColor = {
    waiting: 'bg-yellow-100 text-yellow-700',
    called: 'bg-blue-100 text-blue-700',
    serving: 'bg-green-100 text-green-700',
    done: 'bg-gray-100 text-gray-500',
    cancelled: 'bg-red-100 text-red-500',
    skipped: 'bg-orange-100 text-orange-600',
    expired: 'bg-gray-100 text-gray-400'
  };

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-600 text-lg">Memuat dashboard...</p>
    </div>
  );

  const waitingEntries = entries.filter(e => e.status === 'waiting');
  const calledEntries = entries.filter(e => e.status === 'called');
  const doneEntries = entries.filter(e => ['done', 'cancelled', 'skipped', 'expired'].includes(e.status));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-green-600">Antriin</h1>
          <p className="text-sm text-gray-500">{merchant?.name}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-red-500 transition"
        >
          Keluar
        </button>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">

        <div className={`rounded-2xl p-5 ${merchant?.is_open ? 'bg-green-500' : 'bg-gray-400'}`}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-white text-sm opacity-80">Status Toko</p>
              <p className="text-white font-bold text-xl">
                {merchant?.is_open ? 'Buka' : 'Tutup'}
              </p>
            </div>
            <button
              onClick={handleOpenClose}
              disabled={actionLoading}
              className="bg-white text-green-600 px-5 py-2 rounded-xl font-semibold text-sm hover:bg-green-50 transition disabled:opacity-50"
            >
              {actionLoading ? '...' : merchant?.is_open ? 'Tutup Antrian' : 'Buka Antrian'}
            </button>
          </div>

          {summary && (
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-green-600 text-2xl font-bold">{summary.waiting}</p>
                <p className="text-gray-500 text-xs">Menunggu</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-green-600 text-2xl font-bold">{summary.done + summary.skipped + summary.cancelled}</p>
                <p className="text-gray-500 text-xs">Selesai</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center">
                <p className="text-green-600 text-2xl font-bold">{summary.total}</p>
                <p className="text-gray-500 text-xs">Total</p>
              </div>
            </div>
          )}
        </div>

        {merchant?.is_open && (
          <button
            onClick={handleCallNext}
            disabled={actionLoading || waitingEntries.length === 0}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition disabled:opacity-40 disabled:bg-gray-300"
          >
            Panggil Berikutnya
            {waitingEntries.length > 0 && (
              <span className="ml-2 bg-white text-green-600 text-sm px-2 py-0.5 rounded-full">
                {waitingEntries.length} menunggu
              </span>
            )}
          </button>
        )}

        <a
          href={`/qr/${merchant?.id}`}
          target="_blank"
          className="block w-full border-2 border-green-500 text-green-600 py-3 rounded-2xl font-semibold text-center hover:bg-green-50 transition"
        >
          Lihat QR Code Toko
        </a>

        <a
          href="/upgrade"
          className="block w-full border-2 border-yellow-400 text-yellow-600 py-3 rounded-2xl font-semibold text-center hover:bg-yellow-50 transition"
        >
          Upgrade ke Premium
        </a>

        <a
          href="/settings"
          className="block w-full border-2 border-gray-200 text-gray-500 py-3 rounded-2xl font-semibold text-center hover:bg-gray-50 transition"
        >
          Pengaturan Branding
        </a>

        <a
          href="/analytics"
          className="block w-full border-2 border-blue-300 text-blue-500 py-3 rounded-2xl font-semibold text-center hover:bg-blue-50 transition"
        >
          Analytics & Laporan
        </a>

        {calledEntries.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Sedang Dipanggil</h2>
            <div className="space-y-2">
              {calledEntries.map(entry => (
                <div key={entry.id} className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      {String(entry.display_number).padStart(3, '0')}
                    </span>
                    {entry.customer_name && (
                      <p className="text-sm text-gray-500 mt-0.5">{entry.customer_name}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDone(entry.id)}
                      className="text-sm text-green-500 border border-green-300 px-3 py-1.5 rounded-lg hover:bg-green-50"
                    >
                      Selesai
                    </button>
                    <button
                      onClick={() => handleSkip(entry.id, entry.display_number)}
                      className="text-sm text-orange-500 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-50"
                    >
                      Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {waitingEntries.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Menunggu ({waitingEntries.length})</h2>
            <div className="space-y-2">
              {waitingEntries.map(entry => (
                <div key={entry.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-gray-700">
                      {String(entry.display_number).padStart(3, '0')}
                    </span>
                    {entry.customer_name && (
                      <p className="text-sm text-gray-500 mt-0.5">{entry.customer_name}</p>
                    )}
                    {entry.customer_phone && (
                      <p className="text-xs text-gray-400">{entry.customer_phone}</p>
                    )}
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${statusColor[entry.status]}`}>
                    {statusLabel[entry.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {doneEntries.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-700 mb-2">Riwayat Hari Ini</h2>
            <div className="space-y-2">
              {doneEntries.map(entry => (
                <div key={entry.id} className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center opacity-60">
                  <span className="font-semibold text-gray-500">
                    {String(entry.display_number).padStart(3, '0')}
                    {entry.customer_name && (
                      <span className="text-sm font-normal ml-2">{entry.customer_name}</span>
                    )}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full ${statusColor[entry.status]}`}>
                    {statusLabel[entry.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {entries.length === 0 && merchant?.is_open && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada antrian hari ini</p>
            <p className="text-gray-400 text-sm mt-1">Tempel QR Code di depan toko</p>
          </div>
        )}

      </div>
    </div>
  );
}