export interface Employee {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  pangkat: string;
  deviceId: string | null;
  shiftPreference: 'harian' | 'shift';
  regu?: 'Regu 1' | 'Regu 2' | 'Regu 3' | 'Regu 4' | 'Harian';
  isVipCardActive: boolean;
  photoSeed: string; // for unique avatar generation
  assignedSlotId?: number | 'ALL';
}

export interface LocationSlot {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters (allowable area)
}

export interface AttendanceRecord {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  type: 'Masuk' | 'Pulang';
  locationName: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distanceInMeters: number;
  workSystemName: string; // e.g. "Harian - Senin-Kamis"
  isLate: boolean;
  secureHash: string; // Cryptographic representation
  deviceSignature: string; // Device ID verified
  isVerified: boolean; // Anti Fake GPS confirmation
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  nip: string;
  nama: string;
  action: string;
  status: 'SECURE' | 'WARNING' | 'BREACH_DEFENDED';
  details: string;
}

export interface LeavePermit {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  dateStart: string; // YYYY-MM-DD
  dateEnd: string; // YYYY-MM-DD
  type: 'Sakit' | 'Cuti' | 'Tugas Luar' | 'Izin Lainnya';
  reason: string;
  status: 'Menunggu' | 'Disetujui' | 'Ditolak';
  createdAt: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string; // HH:MM:SS or ISO string
  type: 'info' | 'warning' | 'error' | 'success';
  recipientRole: 'admin' | 'pegawai' | 'all';
  recipientNip?: string;
  read: boolean;
}

// Default Coordinates around Mentok, Bangka Barat (Coordinates represent actual locales)
export const DEFAULT_SLOTS: LocationSlot[] = [
  { id: 1, name: "Mako Satpol PP Bangka Barat", latitude: -2.062088, longitude: 105.166942, radius: 100 },
  { id: 2, name: "Kantor Bupati Bangka Barat", latitude: -2.068212, longitude: 105.172401, radius: 150 },
  { id: 3, name: "Pos Jaga Rumah Dinas Bupati", latitude: -2.059421, longitude: 105.164890, radius: 80 },
  { id: 4, name: "Pos Jaga Gedung DPRD", latitude: -2.067451, longitude: 105.171120, radius: 120 },
  { id: 5, name: "Pos Jaga Pelabuhan Mentok", latitude: -2.072312, longitude: 105.143241, radius: 200 },
  { id: 6, name: "Pos Jaga Kecamatan Parittiga", latitude: -1.614620, longitude: 105.378901, radius: 150 },
  { id: 7, name: "Pos Wilayah Kecamatan Jebus", latitude: -1.674501, longitude: 105.421501, radius: 150 },
  { id: 8, name: "Pos Wilayah Kecamatan Kelapa", latitude: -1.912401, longitude: 105.679002, radius: 150 },
  { id: 9, name: "Pos Wilayah Kecamatan Tempilang", latitude: -2.391201, longitude: 105.903423, radius: 150 },
  { id: 10, name: "Pos Pengamatan Simpang Teritip", latitude: -1.821012, longitude: 105.398412, radius: 100 }
];

// Helper functions for GPS Math
export function getDistanceHaversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters
}

export function generateUUID(): string {
  return 'polpp-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16).toUpperCase();
  });
}

// Generate simple hash representing standard military signature verification
export function calculateAttendanceHash(
  nip: string,
  date: string,
  time: string,
  locationName: string,
  coords: string,
  deviceSignature: string
): string {
  const input = `${nip}|${date}|${time}|${locationName}|${coords}|${deviceSignature}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'SEC-HASH-' + Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}
