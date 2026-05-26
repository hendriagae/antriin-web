'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    category: '',
    customCategory: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Salon & Barbershop',
    'Klinik & Dokter',
    'Bengkel',
    'Apotek',
    'Laundry',
    'Fotografi',
    'Notaris',
    'Lainnya'
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError(null);

    if (!form.name || !form.category || !form.phone || !form.password) {
      setError('Semua field wajib diisi kecuali email');
      return;
    }

    if (form.category === 'lainnya' && !form.customCategory) {
      setError('Tulis kategori tokomu');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama');
      return;
    }

    if (form.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', {
        name: form.name,
        category: form.category === 'lainnya' ? form.customCategory : form.category,
        phone: form.phone,
        email: form.email || undefined,
        password: form.password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('merchant', JSON.stringify(res.data.merchant));
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Antriin</h1>
          <p className="text-gray-500 text-sm mt-2">Daftar dan kelola antrian tokomu</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nama Toko</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Salon Cantik Jaya"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Kategori Toko</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400 bg-white"
            >
              <option value="">Pilih kategori...</option>
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
            {form.category === 'lainnya' && (
              <input
                type="text"
                name="customCategory"
                value={form.customCategory}
                onChange={handleChange}
                placeholder="Tulis kategori tokomu..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400 mt-2"
              />
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Nomor HP</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="08123456789"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Email <span className="text-gray-400">(opsional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="toko@gmail.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Ulangi password"
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-green-400"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Daftar Sekarang'}
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Sudah punya akun?{' '}
          <a href="/login" className="text-green-500 font-medium">Masuk</a>
        </p>

      </div>
    </div>
  );
}