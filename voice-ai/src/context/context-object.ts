export interface VoiceContextObject {
  farmer_id: string;
  language: string;
  preferred_mandi: string;
  crop: string;
  today_slot: string | null;
  queue_position: number | null;
  queue_eta: string | null;
  latest_price: number | null;
  price_date: string | null;
  procurement_status: string;
  payment_status: string;
  last_call_outcome: string;
}
