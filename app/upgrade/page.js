'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function UpgradePage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('merchant');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      router.push('/login');
      return;
    }
    setMerchant(JSON.parse(stored));
    fetchStatus(token);
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchStatus = async (token) => {
    try {
      const res = await axios.get('/api/subscription/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscription(res.data);
    } catch (err) {
      console.error('Gagal ambil status');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    const token = localStorage.getItem('token');
    setProcessing(true);
    try {
      const res = await axios.post('/api/subscription/create', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      window.snap.pay(res.data.token, {
        onSuccess: (result) => {
          alert('Pembayaran berhasil! Akun kamu sudah Premium.');
          router.push('/dashboard');
        },
        onPending: (result) => {
          alert('Pembayaran pending. Selesaikan pembayaranmu.');
        },
        onError: (result) => {
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: () => {
          setProcessing(false);
        }
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal membuat transaksi');
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-600">Memuat...</p>
    </div>
  );

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
        <h2 className="text-xl font-bold text-gray-700 mt-2">Upgrade ke Premium</h2>

        {subscription?.is_premium && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-green-600 font-bold text-lg">Kamu sudah Premium!</p>
            {subscription.subscription?.expired_at && (
              <p className="text-green-500 text-sm mt-1">
                Aktif hingga: {new Date(subscription.subscription.expired_at).toLocaleDateString('id-ID')}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <p className="font-bold text-gray-700 mb-1">Gratis</p>
            <p className="text-2xl font-bold text-gray-400 mb-4">Rp 0</p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-500">✓ 20 antrian/hari</p>
              <p className="text-gray-500">✓ 1 loket</p>
              <p className="text-gray-500">✓ QR Code</p>
              <p className="text-gray-300">✗ Logo custom</p>
              <p className="text-gray-300">✗ Warna tema</p>
              <p className="text-gray-300">✗ Notifikasi WA</p>
              <p className="text-gray-300">✗ Analytics</p>
            </div>
          </div>

          <div className="bg-green-500 border-2 border-green-500 rounded-2xl p-5">
            <p className="font-bold text-white mb-1">Premium</p>
            <p className="text-2xl font-bold text-white mb-4">Rp 49rb<span className="text-sm font-normal">/bln</span></p>
            <div className="space-y-2 text-sm">
              <p className="text-white">✓ Unlimited antrian</p>
              <p className="text-white">✓ Multiple loket</p>
              <p className="text-white">✓ QR Code</p>
              <p className="text-white">✓ Logo custom</p>
              <p className="text-white">✓ Warna tema</p>
              <p className="text-white">✓ Notifikasi WA</p>
              <p className="text-white">✓ Analytics</p>
            </div>
          </div>
        </div>

        {!subscription?.is_premium && (
          <button
            onClick={handleUpgrade}
            disabled={processing}
            className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {processing ? 'Memproses...' : 'Upgrade Sekarang — Rp 49.000/bulan'}
          </button>
        )}

        {!subscription?.is_premium && (
          <p className="text-center text-gray-400 text-sm">
            Pembayaran aman via Midtrans. Bisa bayar dengan transfer bank, GoPay, OVO, QRIS, dan lainnya.
          </p>
        )}
      </div>
    </div>
  );
}