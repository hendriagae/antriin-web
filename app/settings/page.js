'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [merchant, setMerchant] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('merchant');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      router.push('/login');
      return;
    }
    const m = JSON.parse(stored);
    setMerchant(m);
    fetchSettings(m.id);
  }, []);

  const fetchSettings = async (merchantId) => {
    try {
      const res = await axios.get(`/api/upload/settings/${merchantId}`);
      setSettings(res.data.settings);
      setIsPremium(res.data.settings.is_premium);
    } catch (err) {
      console.error('Gagal ambil settings');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran file maksimal 2MB' });
      return;
    }
    setSelectedFile(file);
    setPreviewLogo(URL.createObjectURL(file));
  };

  const handleUploadLogo = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem('token');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', selectedFile);
      const res = await axios.post('/api/upload/logo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSettings({ ...settings, logo_url: res.data.logo_url });
      setSelectedFile(null);
      setMessage({ type: 'success', text: 'Logo berhasil diupload!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal upload logo' });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBranding = async () => {
    const token = localStorage.getItem('token');
    setSaving(true);
    try {
      await axios.put('/api/upload/branding', {
        brand_color: settings.brand_color,
        tagline: settings.tagline,
        welcome_message: settings.welcome_message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Branding berhasil disimpan!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan branding' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <p className="text-green-600">Memuat settings...</p>
    </div>
  );

  // Tampilan untuk merchant non-premium
  if (!isPremium) return (
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

      <div className="p-4 max-w-lg mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-5xl mb-4">⭐</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Fitur Premium</h2>
          <p className="text-gray-500 mb-6">
            Custom branding hanya tersedia untuk pengguna Premium. 
            Upgrade sekarang untuk menampilkan logo dan warna toko kamu di halaman antrian pelanggan.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <p className="text-sm text-gray-600">Yang kamu dapatkan:</p>
            <p className="text-sm text-gray-700">✓ Upload logo toko</p>
            <p className="text-sm text-gray-700">✓ Warna tema custom</p>
            <p className="text-sm text-gray-700">✓ Tagline toko</p>
            <p className="text-sm text-gray-700">✓ Pesan sambutan pelanggan</p>
            <p className="text-sm text-gray-700">✓ Notifikasi WA otomatis</p>
            <p className="text-sm text-gray-700">✓ Unlimited antrian</p>
            <p className="text-sm text-gray-700">✓ Analytics & laporan lengkap</p>
          </div>

          <a
            href="/upgrade"
            className="block w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition text-center"
          >
            Upgrade ke Premium — Rp 49.000/bulan
          </a>
        </div>
      </div>
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

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-700 mt-2">Pengaturan Branding</h2>

        {message && (
          <div className={`px-4 py-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Logo Toko</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-xl border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
              {previewLogo || settings?.logo_url ? (
                <img
                  src={previewLogo || settings.logo_url}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-300 text-xs text-center">Belum ada logo</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Format: JPG, PNG, WebP</p>
              <p className="text-sm text-gray-500">Maksimal: 2MB</p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 mb-3"
          />
          {selectedFile && (
            <button
              onClick={handleUploadLogo}
              disabled={uploading}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-600 transition disabled:opacity-50"
            >
              {uploading ? 'Mengupload...' : 'Upload Logo'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Warna Tema</h3>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={settings?.brand_color || '#22c55e'}
              onChange={(e) => setSettings({ ...settings, brand_color: e.target.value })}
              className="w-16 h-16 rounded-xl border-2 border-gray-200 cursor-pointer"
            />
            <div>
              <p className="font-semibold text-gray-700">{settings?.brand_color}</p>
              <p className="text-sm text-gray-400">Warna utama tampilan toko</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Teks Custom</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Tagline Toko</label>
              <input
                type="text"
                value={settings?.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="Contoh: Cantik itu mudah!"
                maxLength={100}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Pesan Sambutan</label>
              <textarea
                value={settings?.welcome_message || ''}
                onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
                placeholder="Contoh: Selamat datang! Terima kasih sudah menunggu."
                maxLength={200}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400 resize-none"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveBranding}
          disabled={saving}
          className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition disabled:opacity-50"
        >
          {saving ? 'Menyimpan...' : 'Simpan Branding'}
        </button>
      </div>
    </div>
  );
}