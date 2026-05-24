import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { AttendanceRecord, LeavePermit } from '../types';

interface MonthlyReportChartsProps {
  filteredAttendance: AttendanceRecord[];
  rekapMonth: string;
  leavePermits: LeavePermit[];
  rekapFilterNip: string;
}

export default function MonthlyReportCharts({
  filteredAttendance,
  rekapMonth,
  leavePermits,
  rekapFilterNip
}: MonthlyReportChartsProps) {
  
  // 1. Prepare Bar Chart Data: Daily check-ins count
  const year = parseInt(rekapMonth.split('-')[0]) || 2026;
  const month = parseInt(rekapMonth.split('-')[1]) || 5;
  const daysInMonth = new Date(year, month, 0).getDate();
  
  const dailyAttendanceData = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${rekapMonth}-${String(d).padStart(2, '0')}`;
    
    // Count attendances on this specific calendar date
    const checkIns = filteredAttendance.filter(rec => rec.date === dayStr && rec.type === 'Masuk').length;
    const checkOuts = filteredAttendance.filter(rec => rec.date === dayStr && rec.type === 'Pulang').length;
    
    dailyAttendanceData.push({
      date: `Tgl ${d}`,
      'Absen Masuk': checkIns,
      'Absen Pulang': checkOuts
    });
  }

  // Determine if there is actually any data to show
  const totalAttendancesInMonth = filteredAttendance.length;

  // 2. Prepare Pie Chart Data: Status distribution
  // Status categories:
  // - Tepat Waktu (Masuk & !isLate)
  // - Terlambat (Masuk & isLate)
  // - Sakit (Approved Sakit leave within selected month)
  // - Cuti (Approved Cuti leave within selected month)
  // - Tugas Luar (Approved Tugas Luar leave within selected month)
  // - Izin Lainnya (Approved Izin Lainnya leave within selected month)
  
  const tepatWaktuCount = filteredAttendance.filter(rec => rec.type === 'Masuk' && !rec.isLate).length;
  const terlambatCount = filteredAttendance.filter(rec => rec.type === 'Masuk' && rec.isLate).length;
  
  // Filter approved leaves matching month and targeted employee (if not ALL)
  const approvedLeaves = leavePermits.filter(permit => {
    const isApproved = permit.status === 'Disetujui';
    const startsWithMonth = permit.dateStart.startsWith(rekapMonth) || permit.dateEnd.startsWith(rekapMonth);
    const matchesNip = rekapFilterNip === 'ALL' || permit.nip === rekapFilterNip;
    return isApproved && startsWithMonth && matchesNip;
  });

  const sakitCount = approvedLeaves.filter(p => p.type === 'Sakit').length;
  const cutiCount = approvedLeaves.filter(p => p.type === 'Cuti').length;
  const tugasLuarCount = approvedLeaves.filter(p => p.type === 'Tugas Luar').length;
  const izinLainnyaCount = approvedLeaves.filter(p => p.type === 'Izin Lainnya').length;

  const totalStatusEntities = tepatWaktuCount + terlambatCount + sakitCount + cutiCount + tugasLuarCount + izinLainnyaCount;

  const pieChartData = [
    { name: 'Tepat Waktu', value: tepatWaktuCount, color: '#10b981' }, // emerald-500
    { name: 'Terlambat', value: terlambatCount, color: '#ef4444' }, // red-500
    { name: 'Sakit (Disetujui)', value: sakitCount, color: '#06b6d4' }, // cyan-500
    { name: 'Cuti Resmi', value: cutiCount, color: '#8b5cf6' }, // purple-500
    { name: 'Dinas Tugas Luar', value: tugasLuarCount, color: '#f59e0b' }, // amber-500
    { name: 'Izin Lainnya', value: izinLainnyaCount, color: '#64748b' } // slate-500
  ].filter(item => item.value > 0); // Only render slices that have real logs

  // Fallback data if pie is completely empty
  const hasPieData = pieChartData.length > 0;
  const fallbackPieData = [
    { name: 'Belum Ada Data', value: 1, color: '#cbd5e1' }
  ];

  return (
    <div className="space-y-6 no-print my-6">
      
      {/* Analytics Info Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 shadow-lg text-center">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Total Absensi Harian</span>
          <div className="text-xl font-bold font-mono text-amber-500 mt-0.5">{totalAttendancesInMonth} Log</div>
          <span className="text-[9px] text-zinc-400">Masuk & Pulang</span>
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 shadow-lg text-center">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Persentase Ontime</span>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
            {tepatWaktuCount + terlambatCount > 0 
              ? Math.round((tepatWaktuCount / (tepatWaktuCount + terlambatCount)) * 100) 
              : 0}%
          </div>
          <span className="text-[9px] text-emerald-500">Dari total presensi masuk</span>
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 shadow-lg text-center">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Absen Terlambat</span>
          <div className="text-xl font-bold font-mono text-red-400 mt-0.5">{terlambatCount} Kali</div>
          <span className="text-[9px] text-red-500">Butuh pengawasan disiplin</span>
        </div>
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/60 shadow-lg text-center">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Izin Kerja Disetujui</span>
          <div className="text-xl font-bold font-mono text-blue-400 mt-0.5">{approvedLeaves.length} Hari</div>
          <span className="text-[9px] text-blue-400">Cuti/Sakit/Tugas luar</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Bar Chart Daily Attendance Activity */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-700/70 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">Aktivitas Absensi Harian</h4>
              <p className="text-[10px] text-slate-400">Distribusi login masuk dan pulang per tanggal kalender</p>
            </div>
            <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase">
              Grafik Batang
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyAttendanceData}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '8px' }} />
                <Bar dataKey="Absen Masuk" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Absen Pulang" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Chart Status Contribution */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-700/70 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">Proporsi Kehadiran & Izin</h4>
              <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">
                Pie Chart
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mb-4">Persentase ketepatan waktu serta izin kerja yang disahkan</p>
          </div>

          <div className="h-44 sm:h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hasPieData ? pieChartData : fallbackPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={hasPieData ? 40 : 0}
                  outerRadius={hasPieData ? 65 : 60}
                  paddingAngle={hasPieData ? 3 : 0}
                  dataKey="value"
                >
                  {(hasPieData ? pieChartData : fallbackPieData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', fontSize: '10px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {hasPieData && (
              <div className="absolute text-center">
                <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-semibold">Total Log</span>
                <span className="text-lg font-bold font-mono text-white">{totalStatusEntities}</span>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
            {hasPieData ? (
              pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10px] text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }}></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100">
                    {item.value} ({Math.round((item.value / totalStatusEntities) * 100)}%)
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-500 italic text-center py-2">
                Tidak ada data status atau izin pada periode ini.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
