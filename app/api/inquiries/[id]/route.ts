import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Inquiry from '@/lib/models/Inquiry';
import { verifyAuthCookie } from '@/lib/jwt';
import { Types } from 'mongoose';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await verifyAuthCookie();

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const data = await req.json();

    // If responding to inquiry
    if (data.response && data.status === 'responded') {
      data.respondedAt = new Date();
    }

    const inquiry = await Inquiry.findByIdAndUpdate(params.id, data, {
      new: true,
    });

    if (!inquiry) {
      return NextResponse.json(
        { message: 'Inquiry not found' },
        { status: 404 }
      );
    }

    // Log activity
    if (data.response) {
      console.log('[v0] Inquiry responded to - ID:', params.id);
      console.log('  Response sent to:', inquiry.email);
    }

    return NextResponse.json(
      { message: 'Inquiry updated successfully', inquiry },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Update inquiry error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await verifyAuthCookie();

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const inquiry = await Inquiry.findByIdAndDelete(params.id);

    if (!inquiry) {
      return NextResponse.json(
        { message: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Inquiry deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Delete inquiry error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
