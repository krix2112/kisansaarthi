import { NextRequest, NextResponse } from 'next/server';
import { getAggregatePrices } from '../../../lib/mandiPricesService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commodity = searchParams.get('commodity') || 'Wheat';
    const state = searchParams.get('state') || 'All';

    const data = await getAggregatePrices({ commodity, state });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error?.message || 'Failed to retrieve aggregate mandi prices',
      },
      { status: 500 }
    );
  }
}
