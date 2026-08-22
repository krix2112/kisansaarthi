// POST /voice/tool/get-payment
export async function handleGetPaymentTool(context: Record<string, unknown>) {
  // TODO: Fetch payment status for voice agent
  return { payment_status: 'PAID', amount: 45500 };
}
