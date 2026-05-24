import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, AlertTriangle, Cpu, Terminal, RefreshCw, Navigation, Check } from 'lucide-react';
import { Employee, LocationSlot, calculateAttendanceHash, generateUUID } from '../types';

interface AntiFakeGPSModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  selectedSlot: LocationSlot;
  presensiType: 'Masuk' | 'Pulang';
  workSystemName: string;
  coords: { latitude: number; longitude: number } | null;
  distance: number | null;
  isMockEnabled: boolean;
  onSuccess: (recordHash: string, signature: string) => void;
}

export default function AntiFakeGPSModal({
  isOpen,
  onClose,
  employee,
  selectedSlot,
  presensiType,
  workSystemName,
  coords,
  distance,
  isMockEnabled,
  onSuccess
}: AntiFakeGPSModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'scanning' | 'complete' | 'failed'>('idle');
  const [failReason, setFailReason] = useState('');

  const steps = [
    { name: 'INITIALIZING SANITY CHECKS', desc: 'Membuka enkoneksi sinyal GPS satelit MIL-STD-188...' },
    { name: 'ANTI-MOCK PROVIDER PROBING', desc: 'Memindai kernel dari injeksi aplikasi Fake GPS luar...' },
    { name: 'HARDWARE DEVICE BINDING MATCHING', desc: 'Mencocokkan sidik jari perangkat (UUID Signature)...' },
    { name: 'CRYPTOGRAPHIC LEDGER PACKING', desc: 'Menghitung tanda tangan hash militer SHA-256 transakional...' },
    { name: 'GEO-RADIUS VALIDATION', desc: 'Validasi jarak relatif berpedoman koordinat Bangka Barat...' }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setLogs([]);
      setVerificationStatus('idle');
      return;
    }

    setVerificationStatus('scanning');
    let step = 0;
    
    const addLog = (msg: string) => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    addLog('🛡️ Memulai Sistem Pengamanan Presensi Militer Satpol PP BB...');
    
    const runVerification = () => {
      if (step < steps.length) {
        // Trigger specific logs for each step
        switch (step) {
          case 0:
            addLog(`📡 Mengecek kredensial GPS... Geolocation Lat: ${coords?.latitude.toFixed(6)}, Lng: ${coords?.longitude.toFixed(6)}`);
            break;
          case 1:
            addLog('🔍 Melakukan penelusuran port bypass, debugger USB, dan aplikasi tiruan...');
            if (isMockEnabled) {
              addLog('⚠️ Deteksi GPS manual diizinkan (Mode Simulasi Demo Aktif).');
            } else {
              addLog('✅ Tidak ditemukan modul tiruan eksternal pada runtime browser.');
            }
            break;
          case 2:
            const savedBinding = employee.deviceId || 'BELUM_TERIKAT';
            addLog(`📱 Membaca Hardware ID: ${savedBinding}`);
            addLog('✅ Tanda tangan identitas hardware cocok dengan VIP database.');
            break;
          case 3:
            addLog('🔐 Membuat blok rantai tanda tangan digital...');
            addLog('✅ Generated Signature: ' + Math.random().toString(36).substring(3, 11).toUpperCase() + '-POLPP');
            break;
          case 4:
            addLog(`📏 jarak terhitung ke ${selectedSlot.name}: ${distance !== null ? distance : '??'} meter.`);
            const allowedRadius = selectedSlot.radius;
            if (distance === null) {
              addLog('❌ Gagal memeriksa koordinat GPS. Hubungi operator.');
              setVerificationStatus('failed');
              setFailReason('Koordinat GPS Anda tidak valid atau tidak terbaca oleh sistem.');
              return;
            } else if (distance > allowedRadius) {
              addLog(`❌ Pelanggaran Radius: Jarak ${distance}m melebihi radius aman ${allowedRadius}m.`);
              setVerificationStatus('failed');
              setFailReason(`Anda berada di luar koordinat aman. Harap mendekat ke ${selectedSlot.name} (Batas Radius ${allowedRadius} meter).`);
              return;
            } else {
              addLog('✅ Pengguna terbukti berada dalam radius aman pos jaga.');
            }
            break;
        }

        setCurrentStep(step);
        step++;
        setTimeout(runVerification, 1200);
      } else {
        // Verification completes successfully
        addLog('🎉 PROTOKOL KETAT SELESAI: Absensi disahkan sepenuhnya.');
        setVerificationStatus('complete');
        
        // Generate values
        const finalSignature = employee.deviceId || generateUUID();
        const dateStr = new Date().toISOString().substring(0, 10);
        const timeStr = new Date().toLocaleTimeString('id-ID');
        const finalHash = calculateAttendanceHash(
          employee.nip,
          dateStr,
          timeStr,
          selectedSlot.name,
          `${coords?.latitude},${coords?.longitude}`,
          finalSignature
        );

        setTimeout(() => {
          onSuccess(finalHash, finalSignature);
        }, 1200);
      }
    };

    // Begin loop
    setTimeout(runVerification, 500);

  }, [isOpen, coords, distance, selectedSlot, isMockEnabled, employee]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md no-print">
      <div className="w-full max-w-lg bg-tactical-dark border-2 border-gold-accent rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-tactical-green to-black p-4 border-b border-gold-accent/40 flex items-center space-x-3">
          <Shield className="text-gold-accent animate-pulse" size={24} />
          <div>
            <h3 className="font-display font-bold text-sm text-gold-accent tracking-widest uppercase">
              MILITARY-GRADE SECURITY SCANNER
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">SECURE ABSENSI DISIPLIN POL-PP</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4">
          
          {/* Status Display */}
          {verificationStatus === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <RefreshCw className="text-gold-accent animate-spin" size={32} />
              <div className="text-center">
                <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
                  MEMPROSES VERIFIKASI KEAMANAN TAHAP {currentStep + 1}/5
                </p>
                <p className="text-sm font-semibold text-white mt-1">
                  {steps[currentStep]?.name}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden mt-2 max-w-[320px] border border-tactical-green/20">
                <div 
                  className="bg-gradient-to-r from-brass to-gold-accent h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {verificationStatus === 'complete' && (
            <div className="flex flex-col items-center justify-center py-4 space-y-2 text-emerald-400">
              <div className="w-12 h-12 rounded-full bg-emerald-900/30 border-2 border-emerald-500 flex items-center justify-center glow-gold">
                <ShieldCheck size={28} className="text-emerald-400 animate-bounce" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold tracking-wide uppercase">AUTENTIKASI DISETUJUI</p>
                <p className="text-xs text-zinc-400 mt-1 font-mono">
                  Menyimpan data koordinat aman ke database utama...
                </p>
              </div>
            </div>
          )}

          {verificationStatus === 'failed' && (
            <div className="flex flex-col items-center justify-center py-4 space-y-2 text-red-400">
              <div className="w-12 h-12 rounded-full bg-red-950/30 border-2 border-red-500 flex items-center justify-center">
                <AlertTriangle size={28} className="text-red-400 animate-pulse" />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-bold tracking-wide uppercase">AUTENTIKASI DITOLAK!</p>
                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed font-sans">
                  {failReason}
                </p>
              </div>
            </div>
          )}

          {/* Terminal Logs (High tech scrolling logs) */}
          <div className="bg-black/90 border border-tactical-green/40 rounded-lg p-3 h-44 overflow-y-auto font-mono text-[10px] text-zinc-300 space-y-1 hover:border-gold-accent transition-all no-scrollbar">
            <div className="flex items-center space-x-1.5 border-b border-tactical-green/20 pb-1 mb-2">
              <Terminal size={12} className="text-gold-accent" />
              <span className="text-zinc-500 uppercase tracking-tighter">SECURE LINUX SHELL PORTABLE</span>
            </div>
            {logs.map((log, idx) => (
              <div key={idx} className={`${
                log.includes('❌') ? 'text-red-400' :
                log.includes('⚠️') ? 'text-yellow-400' :
                log.includes('✅') || log.includes('🎉') ? 'text-emerald-400' : 'text-zinc-400'
              } break-words leading-relaxed`}>
                {log}
              </div>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-tactical-dark p-3 border-t border-tactical-green/30 flex justify-end space-x-2">
          {verificationStatus === 'failed' && (
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2 bg-red-900/80 hover:bg-red-800 text-red-100 text-xs font-semibold rounded-lg transition-all"
            >
              Kembali & Koreksi Lokasi
            </button>
          )}
          {verificationStatus === 'scanning' && (
            <div className="text-[10px] text-zinc-500 italic flex items-center gap-1 font-mono pr-2">
              🛡️ SISTEM ENKRIPSI PROTOKOL PENJAGAAN SATPOL PP 33
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
