import { StatusVocabulary } from '@/components/StatusBadge';

export const MANDI_PRICE_PER_QUINTAL = 2600; // ₹/quintal wheat — Source: Agmarknet
export const MANDI_NAME = 'Karnal Grain Mandi';

// ─────────────────────────────────────────────
// Shape definitions (mirrors DB_SCHEMA.md)
// ─────────────────────────────────────────────
export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  language: 'hi' | 'en';
  mandi_id: string;
  crop: 'wheat' | 'paddy';
}

export interface Booking {
  id: string;
  farmer_id: string;
  slot_id: string;
  token: number;
  status: StatusVocabulary;
}

export interface QueueEvent {
  id: string;
  booking_id: string;
  event_type: 'ARRIVED' | 'CALLED' | 'SERVED';
  timestamp: string;
  sequence: number;
}

export interface Procurement {
  id: string;
  booking_id: string;
  quantity_quintals: number;
  quality_grade: 'A' | 'B' | 'C';
  price_per_quintal: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED';
}

export interface Payment {
  id: string;
  procurement_id: string;
  status: 'PENDING' | 'PROCESSING' | 'PAID';
  reference?: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Composed view type (what every page uses)
// ─────────────────────────────────────────────
export interface FarmerRecord {
  farmer: Farmer;
  booking: Booking;
  procurement?: Procurement;
  payment?: Payment;
  queuePosition?: number; // 1-based within IN_QUEUE list
}

// ─────────────────────────────────────────────
// Seed data — 18 farmers
// ─────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);

const slots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '13:00', '13:30', '14:00',
  '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

interface SeedRow {
  name: string;
  village: string;
  district: string;
  crop: 'wheat' | 'paddy';
  status: StatusVocabulary;
  quantity?: number;
  grade?: 'A' | 'B' | 'C';
}

const SEED: SeedRow[] = [
  { name: 'Ramesh Kumar',    village: 'Nilokheri',    district: 'Karnal',      crop: 'wheat',  status: 'PAID',               quantity: 22, grade: 'A' },
  { name: 'Sukhwinder Singh', village: 'Taraori',     district: 'Karnal',      crop: 'wheat',  status: 'PAID',               quantity: 18, grade: 'B' },
  { name: 'Gurmail Singh',   village: 'Assandh',      district: 'Karnal',      crop: 'wheat',  status: 'PAYMENT_PROCESSING', quantity: 15, grade: 'A' },
  { name: 'Harpreet Kaur',   village: 'Indri',        district: 'Karnal',      crop: 'paddy',  status: 'PAYMENT_PROCESSING', quantity: 20, grade: 'B' },
  { name: 'Mohan Lal',       village: 'Gharaunda',    district: 'Karnal',      crop: 'wheat',  status: 'PROCURED',           quantity: 12, grade: 'C' },
  { name: 'Balwant Rana',    village: 'Kunjpura',     district: 'Karnal',      crop: 'wheat',  status: 'PROCURED',           quantity: 25, grade: 'A' },
  { name: 'Rajvir Hooda',    village: 'Uchana',       district: 'Jind',        crop: 'wheat',  status: 'IN_QUEUE' },
  { name: 'Dharamvir Malik', village: 'Julana',       district: 'Jind',        crop: 'paddy',  status: 'IN_QUEUE' },
  { name: 'Satbir Nain',     village: 'Safidon',      district: 'Jind',        crop: 'wheat',  status: 'IN_QUEUE' },
  { name: 'Joginder Phogat', village: 'Pehowa',       district: 'Kurukshetra', crop: 'wheat',  status: 'IN_QUEUE' },
  { name: 'Kuldeep Sangwan', village: 'Ismailabad',   district: 'Kurukshetra', crop: 'paddy',  status: 'IN_QUEUE' },
  { name: 'Parveen Devi',    village: 'Ladwa',        district: 'Kurukshetra', crop: 'wheat',  status: 'ARRIVED' },
  { name: 'Baljeet Sheoran', village: 'Shahabad',     district: 'Kurukshetra', crop: 'paddy',  status: 'ARRIVED' },
  { name: 'Naresh Goyal',    village: 'Pipli',        district: 'Kurukshetra', crop: 'wheat',  status: 'ARRIVED' },
  { name: 'Sunita Yadav',    village: 'Kaithal',      district: 'Kaithal',     crop: 'wheat',  status: 'BOOKED' },
  { name: 'Vikram Jangra',   village: 'Kalayat',      district: 'Kaithal',     crop: 'paddy',  status: 'BOOKED' },
  { name: 'Amrit Lal',       village: 'Guhla',        district: 'Kaithal',     crop: 'wheat',  status: 'BOOKED' },
  { name: 'Ranjit Bishnoi',  village: 'Fatehpur',     district: 'Kaithal',     crop: 'wheat',  status: 'BOOKED' },
];

function buildRecords(): FarmerRecord[] {
  return SEED.map((row, i) => {
    const farmerId  = `F${String(i + 1).padStart(3, '0')}`;
    const bookingId = `B${String(i + 1).padStart(3, '0')}`;
    const procId    = `P${String(i + 1).padStart(3, '0')}`;
    const payId     = `PAY${String(i + 1).padStart(3, '0')}`;
    const token     = i + 1;

    const farmer: Farmer = {
      id: farmerId,
      name: row.name,
      phone: `98${String(1000000000 + i).slice(1)}`,
      village: row.village,
      district: row.district,
      language: 'hi',
      mandi_id: 'MANDI001',
      crop: row.crop,
    };

    const booking: Booking = {
      id: bookingId,
      farmer_id: farmerId,
      slot_id: `SLOT${String(i + 1).padStart(2, '0')}`,
      token,
      status: row.status,
    };

    let procurement: Procurement | undefined;
    let payment: Payment | undefined;

    if (row.quantity && row.grade) {
      const amount = row.quantity * MANDI_PRICE_PER_QUINTAL;
      procurement = {
        id: procId,
        booking_id: bookingId,
        quantity_quintals: row.quantity,
        quality_grade: row.grade,
        price_per_quintal: MANDI_PRICE_PER_QUINTAL,
        amount,
        status: 'COMPLETED',
      };

      if (row.status === 'PAID' || row.status === 'PAYMENT_PROCESSING') {
        payment = {
          id: payId,
          procurement_id: procId,
          status: row.status === 'PAID' ? 'PAID' : 'PROCESSING',
          reference: row.status === 'PAID' ? `DBT${100 + i}` : undefined,
          updated_at: `${today}T10:${String(20 + i % 40).padStart(2, '0')}:00Z`,
        };
      }
    }

    return { farmer, booking, procurement, payment };
  });
}

export const INITIAL_RECORDS: FarmerRecord[] = buildRecords();

// Attach slot times for display
export function slotTime(tokenIndex: number): string {
  return `${today} ${slots[tokenIndex] ?? '17:00'}`;
}
