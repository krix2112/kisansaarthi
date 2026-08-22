// POST /voice/tool/get-slot
export async function handleGetSlotTool(context: Record<string, unknown>) {
  // TODO: Fetch slot availability for voice agent
  return { available_slots: ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM'] };
}
