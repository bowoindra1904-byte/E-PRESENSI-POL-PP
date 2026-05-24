import React, { useState, useRef } from 'react';
import { Shield, Cpu, RefreshCw, Smartphone, QrCode } from 'lucide-react';
import { Employee } from '../types';

interface VipCard3DProps {
  employee: Employee;
  onResetBinding?: () => void;
}

export default function VipCard3D({ employee, onResetBinding }: VipCard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; //x position within the element.
    const y = e.clientY - rect.top;  //y position within the element.
    
    // Normalize coordinates around center (0,0)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt angle (max 15 degrees)
    const tiltX = ((y - centerY) / centerY) * -12;
    const tiltY = ((x - centerX) / centerX) * 12;

    setRotation({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    setRotation({ x: 0, y: 0 });
  };

  // Generate responsive high contrast uniform avatars based on prompt
  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${employee.photoSeed || employee.nip}&backgroundColor=1e293b`;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 3D Wrapper */}
      <div 
        className="w-full max-w-[360px] h-[220px] perspective-1000 cursor-pointer no-print relative group"
        onClick={toggleFlip}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Body */}
        <div
          ref={cardRef}
          className="w-full h-full duration-500 preserve-3d shadow-2xl rounded-2xl relative border border-gold-accent/40 bg-gradient-to-br from-tactical-green via-tactical-dark to-black"
          style={{
            transform: isFlipped 
              ? 'rotateY(180deg)' 
              : `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* ================= CARD FRONT ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden p-4 flex flex-col justify-between overflow-hidden">
            {/* Glossy Reflective overlay */}
            <div className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none group-hover:animate-[wiggle_1s_infinite] rotate-45" />
            
            {/* Floating Gold Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold-accent/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-accent/5 rounded-full blur-2xl pointer-events-none" />

            {/* Top Row: Corp Header */}
            <div className="flex justify-between items-start z-10 border-b border-gold-accent/20 pb-2">
              <div className="flex items-center space-x-2">
                {/* SVG Mini Badge / SATPOL PP Emblem Representation */}
                <span className="w-7 h-7 rounded bg-white p-0.5 border border-gold-accent/30 flex items-center justify-center">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Lambang_Polisi_Pamong_Praja.png" 
                    alt="Logo" 
                    className="w-6 h-6 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </span>
                <div>
                  <h4 className="text-[10px] font-mono tracking-widest text-gold-accent font-semibold">SATUAN POLISI PAMONG PRAJA</h4>
                  <p className="text-[8px] font-mono uppercase tracking-wider text-slate-300">BANGKA BARAT &bull; KARTU VIP ELITE</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gold-accent text-tactical-dark font-bold tracking-widest leading-none">
                  VIP
                </span>
                <span className="text-[7px] text-white/50 tracking-tighter mt-1">SECURE ACCESS</span>
              </div>
            </div>

            {/* Middle Row: Avatar & Bio */}
            <div className="flex items-center space-x-3 z-10 my-2">
              <div className="w-16 h-16 rounded-full border-2 border-gold-accent/70 p-0.5 bg-tactical-dark/80 relative">
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 p-0.5 rounded-full bg-emerald-500 border border-tactical-dark">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-display text-sm font-bold truncate tracking-wide uppercase">
                  {employee.nama}
                </p>
                <p className="text-gold-accent font-mono text-[9px] font-semibold tracking-wider">
                  NIP. {employee.nip}
                </p>
                <div className="grid grid-cols-2 gap-1 mt-1 font-sans">
                  <div>
                    <span className="text-[8px] text-zinc-400 block uppercase">JABATAN</span>
                    <span className="text-[9px] font-semibold text-slate-100 truncate block">{employee.jabatan}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-zinc-400 block uppercase">PANGKAT</span>
                    <span className="text-[9px] font-semibold text-slate-100 truncate block">{employee.pangkat}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Smart Signature & Device binding status */}
            <div className="flex justify-between items-center z-10 border-t border-gold-accent/10 pt-2 text-[9px]">
              <div className="flex items-center space-x-1 text-zinc-300">
                <Smartphone size={10} className="text-gold-accent" />
                <span className="font-mono text-[8px] truncate max-w-[150px]">
                  {employee.deviceId ? `BOUND: ${employee.deviceId.substring(0, 16)}...` : 'Device: NOT BOUNDED'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Cpu size={11} className="text-gold-accent animate-spin-slow" />
                <span className="text-[8px] font-mono text-gold-accent bg-gold-accent/10 px-1 py-0.2 rounded border border-gold-accent/20">
                  {employee.shiftPreference === 'shift' ? 'SHIFT PATROL' : 'HARIAN APARAT'}
                </span>
              </div>
            </div>
          </div>

          {/* ================= CARD BACK ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 p-4 bg-gradient-to-br from-tactical-dark via-black to-tactical-green flex flex-col justify-between text-zinc-300">
            {/* Magnetic Strip Simulation */}
            <div className="absolute top-5 left-0 w-full h-10 bg-gradient-to-r from-zinc-900 to-black border-y border-zinc-800/50" />
            
            <div className="mt-12 z-10 flex justify-between space-x-2">
              {/* Security Warning T&C */}
              <div className="flex-1 text-[7px] font-sans text-zinc-400 leading-normal border-r border-gold-accent/20 pr-2">
                <span className="text-gold-accent font-semibold block uppercase mb-0.5">SYARAT & KETENTUAN VIP APARAT</span>
                1. Kartu & Device Binding ini wajib terdaftar di database utama Mako Satpol PP.<br />
                2. Penyalahgunaan absensi digital atau manipulasi GPS akan diproses secara disiplin Kode Etik Militer.<br />
                3. Jika terdapat kendala, hubungi Admin untuk reset hardware binding.
              </div>

              {/* QR and Barcode signature simulation */}
              <div className="flex flex-col items-center justify-center p-1 bg-white rounded border border-gold-accent">
                <QrCode size={40} className="text-black" />
                <span className="text-[6px] font-mono mt-0.5 text-black font-bold font-mono">POL-PP-SEC</span>
              </div>
            </div>

            {/* Back footer with signature metadata */}
            <div className="flex justify-between items-end border-t border-gold-accent/10 pt-2 z-10 text-[9px] font-mono">
              <div>
                <span className="text-[7px] block text-zinc-500">DIGITAL DECRYPT ID</span>
                <span className="text-gold-accent text-[8px]">{`SHA256: ${employee.nip.substring(0, 8)}...`}</span>
              </div>
              <span className="text-[8px] text-zinc-400 bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded border border-red-900/40 font-semibold tracking-wide flex items-center gap-1">
                <Shield size={9} /> ANTI-TEMPER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset button action below card (only for admins/views that request it) */}
      {onResetBinding && employee.deviceId && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onResetBinding();
          }}
          type="button"
          className="mt-3 flex items-center space-x-1.5 px-3 py-1 bg-red-950 border border-red-800 hover:bg-red-900 text-red-200 text-xs rounded-full font-sans transition-all no-print hover:scale-105 active:scale-95 shadow-md"
        >
          <RefreshCw size={12} className="animate-spin-slow" />
          <span>Setel Ulang Binding Device Pegawai</span>
        </button>
      )}

      <p className="text-[10px] text-zinc-400 mt-2 italic flex items-center gap-1 font-sans no-print">
        💡 Klik kartu untuk memutar balik & melihat strip keamanan
      </p>
    </div>
  );
}
