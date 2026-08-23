import { NextRequest, NextResponse } from 'next/server';
import { getPriceHistory } from '../../../../lib/mandiPricesService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commodity = searchParams.get('commodity') || 'Wheat';
    const state = searchParams.get('state') || 'All';
    const daysStr = searchParams.get('days') || '30';
    const days = parseInt(daysStr, 10) || 30;

    const data = await getPriceHistory({ commodity, state, days });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error?.message || 'Failed to retrieve mandi price history',
      },
      { status: 500 }
    );
  }
}
