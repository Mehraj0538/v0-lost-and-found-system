import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Claim from '@/lib/models/Claim';
import Item from '@/lib/models/Item';
import { verifyAuthCookie } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const payload = await verifyAuthCookie();

    if (!payload) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const itemId = searchParams.get('itemId');

    const query: any = {};
    if (payload.role !== 'admin') {
      query.claimedBy = payload.userId;
    }
    if (status) query.status = status;
    if (itemId) query.itemId = itemId;

    const claims = await Claim.find(query)
      .populate('itemId', 'referenceCode title description')
      .populate('claimedBy', 'name email')
      .sort({ claimDate: -1 });

    return NextResponse.json({ claims }, { status: 200 });
  } catch (error: any) {
    console.error('[v0] Get claims error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await verifyAuthCookie();

    if (!payload) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await req.json();

    // Check if item exists
    const item = await Item.findById(data.itemId);
    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user already claimed this item
    const existingClaim = await Claim.findOne({
      itemId: data.itemId,
      claimedBy: payload.userId,
    });

    if (existingClaim) {
      return NextResponse.json(
        { message: 'You have already claimed this item' },
        { status: 409 }
      );
    }

    const claim = new Claim({
      ...data,
      claimedBy: payload.userId,
    });

    await claim.save();
    await claim.populate('itemId', 'referenceCode title description');

    // Log activity
    console.log('[v0] Claim created - Item:', data.itemId, 'User:', payload.userId);

    return NextResponse.json(
      { message: 'Claim submitted successfully', claim },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[v0] Create claim error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
