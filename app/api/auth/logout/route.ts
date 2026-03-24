import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    await clearAuthCookie();

    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Logout error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
