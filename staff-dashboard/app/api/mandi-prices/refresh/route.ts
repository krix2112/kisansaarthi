import { NextRequest, NextResponse } from 'next/server';
import { fetchAndCachePrices } from '../../../../lib/mandiPricesService';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is okay
    }

    const commodity = body.commodity || undefined;
    const state = body.state || undefined;

    const refreshed = await fetchAndCachePrices({ commodity, state, limit: 50 });
    return NextResponse.json({
      success: true,
      count: refreshed.length,
      message: `Successfully synchronized ${refreshed.length} live mandi price records from data.gov.in`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error?.message || 'Failed to refresh mandi prices from data.gov.in',
      },
      { status: 500 }
    );
  }
}
