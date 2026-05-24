import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Navigation, Signal, Shield, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LocationSlot, getDistanceHaversine } from '../types';

interface MapMockupProps {
  selectedSlot: LocationSlot;
  userCoords: { latitude: number; longitude: number } | null;
  onRefreshCoords: () => void;
  isLoadingCoords: boolean;
  distance: number | null;
  antiFakeActive: boolean;
  isMockEnabled: boolean;
  onToggleMock: () => void;
  onSetCustomCoords: (lat: number, lng: number) => void;
}

export default function MapMockup({
  selectedSlot,
  userCoords,
  onRefreshCoords,
  isLoadingCoords,
  distance,
  antiFakeActive,
  isMockEnabled,
  onToggleMock,
  onSetCustomCoords,
}: MapMockupProps) {
  // Angle for radar sweeping animation
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 3) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const distanceText = distance !== null 
    ? `${distance.toLocaleString()} meter`
    : 'Menghitung koordinat...';

  const isWithinRadius = distance !== null && distance <= selectedSlot.radius;

  // Let's create an elegant helper to easily simulate being at various locations or offset
  const quickOffsetOptions = [
    { label: 'Tepat di Lokasi (0m)', lat: selectedSlot.latitude, lng: selectedSlot.longitude },
    { label: 'Dekat Pos Jaga (35m)', lat: selectedSlot.latitude + 0.0002, lng: selectedSlot.longitude + 0.0002 },
    { label: 'Di Luar Radius (850m)', lat: selectedSlot.latitude + 0.005, lng: selectedSlot.longitude + 0.006 },
    { label: 'Gunakan Koordinat Asli GPS HP', lat: null, lng: null }
  ];

  return (
    <div className="w-full bg-slate-950 border border-tactical-green/50 rounded-xl overflow-hidden shadow-2xl relative font-sans no-print text-zinc-300">
      {/* Interactive Top Telemetry Bar */}
      <div className="flex bg-tactical-dark border-b border-tactical-green/40 px-4 py-2 text-[10px] font-mono justify-between items-center text-zinc-400">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
          <span className="text-emerald-400 font-semibold tracking-wider">TACTICAL TELEMETRY ACTIVE</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1">
            <Signal size={12} className="text-gold-accent" /> COMPASS RADAR GPS v4
          </span>
          <span className="px-1.5 py-0.5 rounded bg-tactical-light/60 text-gold-accent font-bold uppercase tracking-tight">
            10-NODE MATRIX
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Left Side: Dynamic Radar SVG Console */}
        <div className="md:col-span-7 bg-black p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden border-b md:border-b-0 md:border-r border-tactical-green/30">
          
          {/* Circular Radar Canvas */}
          <div className="relative w-64 h-64 rounded-full border border-tactical-green/35 flex items-center justify-center">
            
            {/* Concentric rings */}
            <div className="absolute w-52 h-52 rounded-full border border-tactical-green/20" />
            <div className="absolute w-40 h-40 rounded-full border border-tactical-green/15" />
            <div className="absolute w-28 h-28 rounded-full border border-tactical-green/10" />
            <div className="absolute w-14 h-14 rounded-full border border-tactical-green/10" />
            
            {/* Axes grid */}
            <div className="absolute w-full h-[0.5px] bg-tactical-green/20" />
            <div className="absolute h-full w-[0.5px] bg-tactical-green/20" />
            
            {/* Sector sweep line representing Radar sweep */}
            <div 
              className="absolute top-1/2 left-1/2 w-[130px] h-[130px] origin-top-left -translate-y-full -translate-x-full pointer-events-none"
              style={{
                transform: `rotate(${angle}deg)`,
                background: 'conic-gradient(from 0deg, transparent 270deg, rgba(220,174,66,0.15) 360deg)',
                borderRadius: '0 0 100% 0'
              }}
            />

            {/* Target Location Nodes (Predefined Slots highlight) */}
            <div className="absolute w-3.5 h-3.5 rounded-full bg-gold-accent border-2 border-black glow-gold flex items-center justify-center">
              <MapPin size={10} className="text-tactical-dark font-bold" />
              <div className="absolute -top-6 text-[8px] font-mono text-gold-accent bg-tactical-green/95 border border-gold-accent/40 rounded px-1 py-0.5 whitespace-nowrap">
                TARGET: SLOT {selectedSlot.id}
              </div>
            </div>

            {/* Selected Radius Limit Bubble representing safe zone */}
            <div 
              className={`absolute rounded-full border-2 border-dashed transition-all duration-300 ${isWithinRadius ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5'}`}
              style={{ width: '130px', height: '130px' }}
            />

            {/* User Location Node (Flashing dot representing employee GPS) */}
            {userCoords && (
              <div 
                className={`absolute w-3 h-3 rounded-full border border-white translate-x-12 -translate-y-8 animate-pulse ${isWithinRadius ? 'bg-emerald-400' : 'bg-red-400'}`}
              >
                <div className={`absolute -inset-1.5 rounded-full border animate-ping ${isWithinRadius ? 'border-emerald-400/30' : 'border-red-400/30'}`} />
                <div className="absolute -bottom-6 text-[8px] font-mono bg-tactical-dark/95 border border-zinc-500 rounded px-1 py-0.5 whitespace-nowrap text-zinc-300">
                  ANDA ({isWithinRadius ? 'RADIUS AMAN' : 'DILUAR RADIUS'})
                </div>
              </div>
            )}

            {/* Outer Compass Cardinal Marks */}
            <span className="absolute top-1 text-[8px] font-mono text-zinc-500 font-bold">N</span>
            <span className="absolute bottom-1 text-[8px] font-mono text-zinc-500 font-bold">S</span>
            <span className="absolute left-1 text-[8px] font-mono text-zinc-500 font-bold">W</span>
            <span className="absolute right-1 text-[8px] font-mono text-zinc-500 font-bold">E</span>
          </div>

          {/* Calibrator Legend or quick tips */}
          <div className="text-center mt-3 z-10">
            <span className="text-[10px] font-mono text-zinc-400 tracking-wide font-medium bg-tactical-green/60 px-2 py-0.5 rounded border border-tactical-green/50">
              POL-PP SECURE GNSS SATELLITE NETWORK ACTIVE
            </span>
          </div>
        </div>

        {/* Right Side: Coordinate Controls and Telemetry */}
        <div className="md:col-span-5 p-4 flex flex-col justify-between space-y-4">
          
          {/* Target Location Metadata */}
          <div>
            <h5 className="text-xs uppercase font-display font-bold text-gold-accent tracking-wider flex items-center gap-1.5">
              <Compass size={14} className="text-gold-accent animate-spin-slow" />
              TITIK TUJUAN PRESENSI
            </h5>
            <div className="mt-2 bg-tactical-dark/60 border border-tactical-green/30 rounded-lg p-2.5 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Nama Lokasi:</span>
                <span className="font-semibold text-white text-right truncate max-w-[155px]">{selectedSlot.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400 text-[11px]">Latitude:</span>
                <span className="text-gold-accent font-semibold">{selectedSlot.latitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400 text-[11px]">Longitude:</span>
                <span className="text-gold-accent font-semibold">{selectedSlot.longitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Batas Radius:</span>
                <span className="font-bold text-emerald-400">{selectedSlot.radius} meter</span>
              </div>
            </div>
          </div>

          {/* User Coordinates Telemetry */}
          <div>
            <h5 className="text-xs uppercase font-display font-medium text-white tracking-wider flex items-center gap-1.5">
              <Navigation size={14} className="text-emerald-400" />
              KOORDINAT GPS AKTUAL ANDA
            </h5>
            <div className="mt-2 bg-tactical-dark/50 border border-tactical-green/20 rounded-lg p-2.5 space-y-1.5">
              {isLoadingCoords ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-1">
                  <span className="w-5 h-5 rounded-full border-2 border-t-transparent border-emerald-400 animate-spin" />
                  <span className="text-[10px] font-mono text-emerald-400">Locking Satellite GPS Signal...</span>
                </div>
              ) : userCoords ? (
                <>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400 text-[11px]">Lat:</span>
                    <span className="text-white font-semibold">{userCoords.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400 text-[11px]">Lng:</span>
                    <span className="text-white font-semibold">{userCoords.longitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-tactical-green/10 pt-1.5">
                    <span className="text-zinc-400">Selisih Jarak:</span>
                    <span className={`font-mono font-bold text-sm ${isWithinRadius ? 'text-emerald-400' : 'text-red-400'}`}>
                      {distanceText}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-2 text-zinc-500 text-xs">
                  ⛔ Mohon izinkan GPS browser anda untuk presensi real-time
                </div>
              )}
            </div>
          </div>

          {/* Interactive Calibration for development */}
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gold-accent tracking-wider font-semibold uppercase">
                ⚙️ KOORDINAT SIMULASI (UJI COBA)
              </span>
              <button 
                onClick={onToggleMock}
                className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded transition-all ${
                  isMockEnabled 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {isMockEnabled ? 'MANUAL ACTIVE' : 'REAL GPS'}
              </button>
            </div>
            
            {isMockEnabled ? (
              <div className="mt-2 p-2 bg-yellow-950/20 border border-yellow-800/40 rounded-lg space-y-1.5">
                <p className="text-[9px] text-yellow-300 italic mb-1">
                  Pilih mode simulasi koordinat di bawah untuk mencoba presensi dari berbagai skenario jarak:
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {quickOffsetOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (opt.lat !== null && opt.lng !== null) {
                          onSetCustomCoords(opt.lat, opt.lng);
                        } else {
                          onRefreshCoords();
                        }
                      }}
                      className="px-2 py-1 bg-zinc-900 hover:bg-tactical-light/30 border border-zinc-800 rounded text-[9px] font-semibold tracking-wide text-zinc-300 cursor-pointer text-left truncate"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={onRefreshCoords}
                disabled={isLoadingCoords}
                className="mt-2 w-full py-2 bg-gradient-to-r from-tactical-green to-tactical-light border border-gold-accent/40 hover:from-tactical-light hover:to-tactical-green text-xs font-semibold text-white rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer hover:shadow-lg shadow shadow-teal-900/30"
              >
                <Navigation size={13} className="animate-pulse text-gold-accent" />
                <span>SYNC CAPTURE GPS ANDA SEKARANG</span>
              </button>
            )}
          </div>

          {/* MILITARY STANDARD SHIELD LABEL */}
          <div className={`p-2 rounded-lg flex items-center space-x-2 border text-[10px] uppercase font-mono tracking-wider ${
            isWithinRadius 
              ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400' 
              : 'bg-red-950/30 border-red-900/40 text-red-400'
          }`}>
            {isWithinRadius ? (
              <>
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>KOORDINAT SAH & DI AUTHORISASI MASUK RADIUS PRESENSI</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} className="text-red-400 shrink-0 animate-bounce" />
                <span>KOORDINAT INVALID! ANDA BERADA DILUAR RADIUS {selectedSlot.radius}M</span>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
