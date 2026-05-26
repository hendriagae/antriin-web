'use client';

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TokoPage({ params }) {
  const { merchantId } = use(params);
  const router = useRouter();
  const [merchant, setMerchant] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Cek apakah ada nomor antrian yang tersimpan untuk toko ini
    const savedEntry = localStorage.getItem(`queue_${merchantId}`);
    if (savedEntry) {
      const entry = JSON.parse(savedEntry);
      // Cek apakah antrian masih aktif
      axios.get(`/api/queue/status/${entry.id}`)
        .then(res => {
          const status = res.data.entry.status;
          // Kalau masih waiting atau called, redirect ke halaman status
          if (status === 'waiting' || status === 'called') {
            router.push(`/q/${entry.id}`);
            return;
          } else {
            // Kalau sudah selesai/cancel, hapus dari localStorage
            localStorage.removeItem(`queue_${merchantId}`);
          }
        })
        .catch(() => {
          localStorage.removeItem(`queue_${merchantId}`);
        });
    }
    fetchData();
  }, [merchantId]);

  const fetchData = async () => {
    try {
      const [merchantRes, settingsRes] = await Promise.all([
        axios.get(`/api/merchant/${merchantId}`),
        axios.get(`/api/upload/settings/${merchantId}`)
      ]);
      setMerchant(merchantRes.data.merchant);
      setSettings(settingsRes.data.settings);
    } catch (err) {
      setError('Toko tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  const handleTakeNumber = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post('/api/queue/take', {
        merchant_id: merchantId,
        customer_name: name || null,
        customer_phone: phone || null
      });

      // Simpan ID antrian ke localStorage
      localStorage.setItem(`queue_${merchantId}`, JSON.stringify({
        id: res.data.entry.id,
        display_number: res.data.entry.display_number,
        created_at: new Date().toISOString()
      }));

      router.push(`/q/${res.data.entry.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengambil nomor antrian');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-600 text-lg">Memuat...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <p className="text-red-600 text-lg">{error}</p>
    </div>
  );

  const brandColor = settings?.brand_color || '#22c55e';

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: `${brandColor}15` }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

        <div className="text-center mb-8">
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt="Logo toko"
              className="w-20 h-20 object-cover rounded-xl mx-auto mb-3"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-3" style={{ color: brandColor }}>Antriin</h1>
          )}
          <div className="mt-2 p-4 rounded-xl" style={{ backgroundColor: `${brandColor}15` }}>
            <p className="text-xl font-bold text-gray-800">{merchant.name}</p>
            <p className="text-sm text-gray-500 mt-1 capitalize">{merchant.category}</p>
            {settings?.tagline && (
              <p className="text-sm mt-2 font-medium" style={{ color: brandColor }}>{settings.tagline}</p>
            )}
          </div>
        </div>

        {!merchant.is_open ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-4">🔒</p>
            <p className="text-gray-600 font-medium">Toko sedang tutup</p>
            <p className="text-gray-400 text-sm mt-2">Silakan datang kembali nanti</p>
          </div>
        ) : (
          <>
            {settings?.welcome_message && (
              <p className="text-gray-500 text-sm text-center mb-4 italic">
                {settings.welcome_message}
              </p>
            )}

            <p className="text-gray-500 text-sm text-center mb-6">
              Isi data di bawah untuk ambil nomor antrian
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Nama <span className="text-gray-400">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Nomor HP <span className="text-gray-400">(opsional, untuk notifikasi WA)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400"
                />
              </div>
            </div>

            <button
              onClick={handleTakeNumber}
              disabled={submitting}
              className="w-full text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50"
              style={{ backgroundColor: brandColor }}
            >
              {submitting ? 'Memproses...' : 'Ambil Nomor Antrian'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}