import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

/**
 * Seed script for KisanSaarthi demo data.
 * Run from backend/: node scripts/seed.js
 *
 * Uses the SERVICE ROLE key — this is a backend-only script, never run
 * this in a browser context or commit real credentials into it.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ---------- 1. Mandis (procurement centers) ----------
// A handful of realistic UP/NCR-region mandi names — swap in real ones
// once Navya confirms which are used for the demo.
const mandiSeed = [
  { name: 'Ghaziabad Mandi', location: 'Ghaziabad, UP', external_id: 'UP-GZB-01' },
  { name: 'Meerut Mandi', location: 'Meerut, UP', external_id: 'UP-MRT-01' },
  { name: 'Bulandshahr Mandi', location: 'Bulandshahr, UP', external_id: 'UP-BSR-01' },
];

// ---------- 2. Farmers ----------
// Realistic Indian first names + a fixed dummy phone prefix so none of
// these collide with real numbers. crop is one of a few common UP crops.
const firstNames = [
  'Ramesh', 'Suresh', 'Mahesh', 'Rajesh', 'Sanjay', 'Vijay', 'Ajay', 'Anil',
  'Sunil', 'Rakesh', 'Dinesh', 'Naresh', 'Yogesh', 'Mukesh', 'Umesh',
  'Pradeep', 'Sandeep', 'Manoj', 'Vinod', 'Ashok', 'Ramveer', 'Satveer',
  'Om Prakash', 'Ram Lal', 'Chhotu', 'Ganga Ram', 'Hari Om', 'Jai Prakash',
  'Kailash', 'Lakhan',
];

const crops = ['Wheat', 'Sugarcane', 'Mustard', 'Rice', 'Potato'];

function randomPhone(i) {
  // 90000-prefixed dummy numbers, guaranteed unique via loop index
  return `9000${String(100000 + i).slice(1)}`;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  console.log('Seeding mandis...');
  const { data: mandis, error: mandiError } = await supabase
    .from('mandis')
    .insert(mandiSeed)
    .select();

  if (mandiError) {
    console.error('Failed to seed mandis:', mandiError.message);
    return;
  }
  console.log(`Inserted ${mandis.length} mandis.`);

  console.log('Seeding farmers...');
  const farmerRows = firstNames.map((name, i) => ({
    name,
    phone: randomPhone(i),
    preferred_mandi_id: pick(mandis).id,
    crop: pick(crops),
    language: 'hi',
  }));

  const { data: farmers, error: farmerError } = await supabase
    .from('farmers')
    .insert(farmerRows)
    .select();

  if (farmerError) {
    console.error('Failed to seed farmers:', farmerError.message);
    return;
  }
  console.log(`Inserted ${farmers.length} farmers.`);

  console.log('Seeding slots...');
  const today = new Date();
  const slotRows = farmers.map((farmer, i) => {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + (i % 3)); // spread across today + next 2 days
    const hour = 9 + (i % 8); // 9am–4pm slots

    return {
      farmer_id: farmer.id,
      mandi_id: farmer.preferred_mandi_id,
      slot_date: slotDate.toISOString().slice(0, 10),
      slot_time: `${String(hour).padStart(2, '0')}:00:00`,
      status: 'BOOKED',
    };
  });

  const { data: slots, error: slotError } = await supabase
    .from('slots')
    .insert(slotRows)
    .select();

  if (slotError) {
    console.error('Failed to seed slots:', slotError.message);
    return;
  }
  console.log(`Inserted ${slots.length} slots.`);

  console.log('Seed complete.');
}

seed();
