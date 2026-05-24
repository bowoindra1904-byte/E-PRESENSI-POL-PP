import React from 'react';

export default function RunningText() {
  const announcements = [
    "Selamat Pagi Pegawai SATPOL PP Bangka Barat",
    "Pastikan GPS Anda aktif sebelum melakukan absensi",
    "Tetap jaga integritas dan profesionalitas dalam bertugas",
    "Update Aplikasi versi 2.4.1 telah tersedia di Dashboard Admin"
  ];

  return (
    <div className="w-full h-10 bg-amber-500 text-slate-900 border-t border-b border-amber-600 overflow-hidden text-xs font-sans flex items-center shadow-inner no-print shrink-0">
      <div className="h-full bg-slate-900 text-amber-500 font-display font-extrabold px-6 uppercase tracking-wider flex items-center space-x-1.5 shrink-0 z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>PENGUMUMAN PENTING</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap space-x-12 hover:[animation-play-state:paused] cursor-pointer">
          {announcements.map((text, idx) => (
            <span key={idx} className="font-semibold text-xs tracking-wide flex items-center">
              {text} &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            </span>
          ))}
          {/* Duplicate to create seamless infinite loop */}
          {announcements.map((text, idx) => (
            <span key={`dup-${idx}`} className="font-semibold text-xs tracking-wide flex items-center">
              {text} &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
