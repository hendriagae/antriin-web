import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-green-600">Antriin</h1>
        <div className="flex gap-3">
          <Link href="/login" className="text-gray-500 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            Masuk
          </Link>
          <Link href="/register" className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition">
            Daftar Gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-b from-green-50 to-white px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="bg-green-100 text-green-600 text-sm font-medium px-4 py-1.5 rounded-full">
            Gratis untuk UMKM Indonesia
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mt-6 mb-4 leading-tight">
            Kelola Antrian Tokomu<br />dari HP, Mudah & Gratis
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Pelanggan scan QR Code, ambil nomor antrian, dan tunggu notifikasi. 
            Tidak perlu install aplikasi apapun.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/register" className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-600 transition">
              Mulai Gratis Sekarang
            </Link>
            <Link href="/login" className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition">
              Masuk
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-4">Tidak perlu kartu kredit. Gratis selamanya.</p>
        </div>
      </section>

      {/* Masalah */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-12">Masalah yang Sering Terjadi di Tokomu</h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: '😤', text: 'Pelanggan antri panjang dan tidak sabar' },
              { icon: '📋', text: 'Antrian masih pakai kertas atau teriakan nama' },
              { icon: '🚶', text: 'Pelanggan kabur karena tidak tahu berapa lama menunggu' },
              { icon: '😰', text: 'Kamu kewalahan mengatur urutan pelayanan' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-red-50 rounded-2xl p-4 text-left">
                <span className="text-3xl">{item.icon}</span>
                <p className="text-gray-700 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solusi */}
      <section className="px-6 py-16 bg-green-50">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Antriin Solusinya</h3>
          <p className="text-gray-500 mb-12">Sistem antrian digital yang mudah dipakai siapa saja</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '📱', title: 'Tanpa Install App', desc: 'Pelanggan cukup scan QR, langsung buka di browser' },
              { icon: '🔲', title: 'QR Code Otomatis', desc: 'Cetak dan tempel di depan toko, selesai' },
              { icon: '🔔', title: 'Notifikasi WA', desc: 'Pelanggan dapat WA saat giliran hampir tiba' },
              { icon: '📊', title: 'Analytics', desc: 'Pantau jam tersibuk dan rata-rata waktu tunggu' },
              { icon: '🎨', title: 'Custom Branding', desc: 'Logo dan warna toko tampil di halaman antrian' },
              { icon: '💳', title: 'Berbagai Pembayaran', desc: 'GoPay, OVO, Transfer Bank, QRIS dan lainnya' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 text-left shadow-sm">
                <span className="text-3xl">{item.icon}</span>
                <p className="font-bold text-gray-800 mt-2">{item.title}</p>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-12">Cara Kerja Antriin</h3>
          <div className="grid grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Daftar & Print QR', desc: 'Daftar gratis, download QR Code, tempel di toko' },
              { step: '2', title: 'Pelanggan Scan', desc: 'Pelanggan scan QR, isi nama, dapat nomor antrian' },
              { step: '3', title: 'Kelola dari HP', desc: 'Panggil nomor berikutnya langsung dari dashboard' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <p className="font-bold text-gray-800 mb-2">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Harga */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Harga Transparan</h3>
          <p className="text-gray-500 mb-12">Mulai gratis, upgrade kapan saja</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-left">
              <p className="font-bold text-gray-700 text-lg mb-1">Gratis</p>
              <p className="text-3xl font-bold text-gray-400 mb-6">Rp 0</p>
              <div className="space-y-3 text-sm mb-8">
                <p className="text-gray-600">✓ 20 antrian per hari</p>
                <p className="text-gray-600">✓ Dashboard antrian</p>
                <p className="text-gray-600">✓ QR Code toko</p>
                <p className="text-gray-300">✗ Notifikasi WA</p>
                <p className="text-gray-300">✗ Logo & branding</p>
                <p className="text-gray-300">✗ Analytics</p>
                <p className="text-gray-300">✗ Unlimited antrian</p>
              </div>
              <Link href="/register" className="block w-full border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold text-center hover:bg-green-50 transition">
                Mulai Gratis
              </Link>
            </div>

            <div className="bg-green-500 border-2 border-green-500 rounded-2xl p-6 text-left">
              <p className="font-bold text-white text-lg mb-1">Premium</p>
              <div className="flex items-end gap-1 mb-6">
                <p className="text-3xl font-bold text-white">Rp 49rb</p>
                <p className="text-white opacity-70 text-sm mb-1">/bulan</p>
              </div>
              <div className="space-y-3 text-sm mb-8">
                <p className="text-white">✓ Unlimited antrian</p>
                <p className="text-white">✓ Dashboard antrian</p>
                <p className="text-white">✓ QR Code toko</p>
                <p className="text-white">✓ Notifikasi WA</p>
                <p className="text-white">✓ Logo & branding</p>
                <p className="text-white">✓ Analytics</p>
                <p className="text-white">✓ Multiple loket</p>
              </div>
              <Link href="/register" className="block w-full bg-white text-green-600 py-3 rounded-xl font-semibold text-center hover:bg-green-50 transition">
                Coba Gratis Dulu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bawah */}
      <section className="px-6 py-20 bg-green-500 text-center">
        <div className="max-w-xl mx-auto">
          <h3 className="text-3xl font-bold text-white mb-4">
            Siap rapikan antrian tokomu?
          </h3>
          <p className="text-green-100 mb-8 text-lg">
            Bergabung dengan ribuan UMKM Indonesia yang sudah pakai Antriin
          </p>
          <Link href="/register" className="bg-white text-green-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-50 transition inline-block">
            Daftar Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 px-6 py-8 text-center">
        <p className="text-green-400 font-bold text-xl mb-2">Antriin</p>
        <p className="text-gray-400 text-sm">Kelola antrian tokomu dari HP, gratis dan mudah</p>
        <p className="text-gray-600 text-xs mt-4">© 2026 Antriin. All rights reserved.</p>
      </footer>

    </div>
  );
}