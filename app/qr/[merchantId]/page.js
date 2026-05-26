'use client';

import { use } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRPage({ params }) {
  const { merchantId } = use(params);
  const qrUrl = `${window.location.origin}/toko/${merchantId}`;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="text-center">

        {/* Header */}
        <h1 className="text-3xl font-bold text-green-600 mb-2">Antriin</h1>
        <p className="text-gray-500 mb-8">Scan QR untuk ambil nomor antrian</p>

        {/* QR Code */}
        <div className="inline-block p-6 bg-white border-4 border-green-500 rounded-2xl shadow-lg mb-8">
          <QRCodeSVG
            value={qrUrl}
            size={250}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>

        {/* URL */}
        <p className="text-gray-400 text-sm mb-8 break-all max-w-xs mx-auto">
          {qrUrl}
        </p>

        {/* Tombol print */}
        <button
          onClick={() => window.print()}
          className="bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition"
        >
          🖨️ Print QR Code
        </button>

      </div>
    </div>
  );
}