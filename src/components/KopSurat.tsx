import React from 'react';
import { Shield } from 'lucide-react';

export default function KopSurat() {
  return (
    <div className="w-full bg-white text-black p-4 border-b-4 border-double border-zinc-900 flex items-center justify-between font-serif pb-4">
      
      {/* Official Satpol PP Logo – High Quality Authentic Emblem */}
      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center p-0.5 border border-zinc-300 rounded-full bg-slate-50">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Lambang_Polisi_Pamong_Praja.png" 
          alt="Logo Satpol PP" 
          className="w-14 h-14 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Corporate Letterhead Text */}
      <div className="flex-1 text-center font-serif px-4">
        <h2 className="text-base md:text-lg font-bold uppercase tracking-wide leading-tight text-zinc-900">
          PEMERINTAH KABUPATEN BANGKA BARAT
        </h2>
        <h1 className="text-lg md:text-xl font-extrabold uppercase tracking-widest leading-none text-emerald-900 font-sans my-1">
          SATUAN POLISI PAMONG PRAJA
        </h1>
        <p className="text-[10px] md:text-xs font-sans tracking-tight text-zinc-700 leading-snug">
          Kompleks Perkantoran Pemerintah Daerah Bangka Barat, Mentok, Kode Pos 33321
        </p>
        <p className="text-[9px] md:text-[10px] italic font-sans text-zinc-500">
          Telepon: (0716) 7321008 • Website: satpolpp.bangkabaratkab.go.id • Email: satpolpp@bangkabaratkab.go.id
        </p>
      </div>

      {/* Auxiliary seal marker or secondary local emblem */}
      <div className="w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center border border-dashed border-zinc-300 rounded text-[7px] font-mono text-zinc-400 uppercase text-center p-1 font-sans">
        <span>LOG-SEC</span>
        <span className="font-bold text-emerald-800 text-[8px] tracking-wider leading-none">POL-PP</span>
        <span>VERIFIED</span>
      </div>

    </div>
  );
}
