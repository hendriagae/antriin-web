'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('merchant');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      router.push('/login');
      return;
    }
    const m = JSON.parse(stored);
    setMerchant(m);
    fetchData(m.id, token);
  }, []);

  const fetchData = async (merchantId, token) => {
    try {
      const [analyticsRes, settingsRes] = await Promise.all([
        axios.get('/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`/api/upload/settings/${merchantId}`)
      ]);
      setAnalytics(analyticsRes.data);
      setIsPremium(settingsRes.data.settings.is_premium);
    } catch (err) {
      console.error('Gagal ambil analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-600">Memuat analytics...</p>
    </div>
  );

  const maxTotal = analytics?.weekly
    ? Math.max(...analytics.weekly.map(d => d.total), 1)
    : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-green-600">Antriin</h1>
          <p className="text-sm text-gray-500">{merchant?.name}</p>
        </div>
        <a href="/dashboard" className="text-sm text-green-500 font-medium">
          Kembali
        </a>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-4">
        <h2 className="text-xl font-bold text-gray-700 mt-2">Analytics</h2>

        {/* Summary hari ini - tersedia untuk semua */}
        <div className="bg-green-500 rounded-2xl p-5">
          <p className="text-white text-sm opacity-80 mb-3">Hari Ini</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-green-600 text-3xl font-bold">{analytics?.today.total}</p>
              <p className="text-gray-500 text-xs">Total Pelanggan</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-green-600 text-3xl font-bold">{analytics?.today.waiting}</p>
              <p className="text-gray-500 text-xs">Masih Menunggu</p>
            </div>
          </div>
        </div>

        {/* Fitur premium */}
        {isPremium ? (
          <>
            {/* Summary lengkap */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <p className="text-3xl mb-1">⏰</p>
                <p className="text-xl font-bold text-gray-700">{analytics?.today.peak_hour}</p>
                <p className="text-sm text-gray-400 mt-1">Jam Tersibuk</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <p className="text-3xl mb-1">⏱️</p>
                <p className="text-xl font-bold text-gray-700">{analytics?.today.avg_wait_minutes} mnt</p>
                <p className="text-sm text-gray-400 mt-1">Rata-rata Tunggu</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <p className="text-green-600 text-3xl font-bold">{analytics?.today.done}</p>
                <p className="text-sm text-gray-400 mt-1">Dilayani</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <p className="text-red-400 text-3xl font-bold">
                  {(analytics?.today.skipped || 0) + (analytics?.today.cancelled || 0)}
                </p>
                <p className="text-sm text-gray-400 mt-1">No Show & Cancel</p>
              </div>
            </div>

            {/* Grafik 7 hari */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Kunjungan 7 Hari Terakhir</h3>
              <div className="flex items-end justify-between gap-2 h-32">
                {analytics?.weekly.map((day, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <p className="text-xs text-gray-500 mb-1">{day.total}</p>
                    <div
                      className="w-full bg-green-500 rounded-t-lg transition-all"
                      style={{
                        height: `${Math.max((day.total / maxTotal) * 100, 4)}%`,
                        opacity: day.date === new Date().toISOString().split('T')[0] ? 1 : 0.5
                      }}
                    />
                    <p className="text-xs text-gray-400 mt-1">{day.day}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail per hari */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">Detail Per Hari</h3>
              <div className="space-y-3">
                {analytics?.weekly.slice().reverse().map((day, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(day.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                    <div className="flex gap-3 text-sm">
                      <span className="text-green-600 font-semibold">{day.total} total</span>
                      <span className="text-gray-400">{day.cancelled} cancel</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Banner upgrade untuk merchant gratis */
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center border-2 border-dashed border-green-200">
            <p className="text-4xl mb-3">📊</p>
            <h3 className="font-bold text-gray-800 mb-2">Analytics Lengkap</h3>
            <p className="text-gray-500 text-sm mb-4">
              Upgrade ke Premium untuk lihat grafik 7 hari, jam tersibuk, rata-rata waktu tunggu, dan detail per hari.
            </p>
            <a
              href="/upgrade"
              className="block w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
            >
              Upgrade ke Premium — Rp 49.000/bulan
            </a>
          </div>
        )}
      </div>
    </div>
  );
}