import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Claim from '@/lib/models/Claim';
import Item from '@/lib/models/Item';
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
        { message: 'Invalid claim ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const data = await req.json();

    const claim = await Claim.findByIdAndUpdate(params.id, data, {
      new: true,
    })
      .populate('itemId', 'referenceCode title description')
      .populate('claimedBy', 'name email');

    if (!claim) {
      return NextResponse.json(
        { message: 'Claim not found' },
        { status: 404 }
      );
    }

    // If status is approved or completed, update item status
    if (data.status === 'approved' || data.status === 'completed') {
      await Item.findByIdAndUpdate(
        claim.itemId,
        { status: 'claimed' },
        { new: true }
      );
    }

    // Log activity
    console.log('[v0] Claim updated - ID:', params.id, 'Status:', data.status);

    return NextResponse.json(
      { message: 'Claim updated successfully', claim },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Update claim error:', error);
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
        { message: 'Invalid claim ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const claim = await Claim.findByIdAndDelete(params.id);

    if (!claim) {
      return NextResponse.json(
        { message: 'Claim not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Claim deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Delete claim error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
