export const VOICE_INTENTS = [
  'get_slot',
  'get_queue',
  'get_price',
  'get_payment',
  'booking_create',
  'booking_update'
] as const;

export type VoiceIntent = (typeof VOICE_INTENTS)[number];
