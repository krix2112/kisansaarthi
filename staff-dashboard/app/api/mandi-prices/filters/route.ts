import { NextResponse } from 'next/server';
import { getAvailableFilters } from '../../../../lib/mandiPricesService';

export async function GET() {
  try {
    const filters = getAvailableFilters();
    return NextResponse.json(filters);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error?.message || 'Failed to load filter options',
      },
      { status: 500 }
    );
  }
}
