import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { verifyAuthCookie } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const payload = await verifyAuthCookie();

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ inquiries }, { status: 200 });
  } catch (error: any) {
    console.error('[v0] Get inquiries error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data = await req.json();

    const inquiry = new Inquiry(data);
    await inquiry.save();

    // Log activity (email notification in production)
    console.log('[v0] New inquiry received:');
    console.log('  From:', data.name, `(${data.email})`);
    console.log('  Subject:', data.subject);
    console.log('  Message:', data.message);

    return NextResponse.json(
      { message: 'Inquiry submitted successfully', inquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[v0] Create inquiry error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
