import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Item from '@/lib/models/Item';
import { verifyAuthCookie } from '@/lib/jwt';
import { Types } from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const item = await Item.findById(params.id)
      .populate('category', 'name icon color')
      .populate('submittedBy', 'name email');

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item }, { status: 200 });
  } catch (error: any) {
    console.error('[v0] Get item error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

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
        { message: 'Invalid item ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const data = await req.json();

    const item = await Item.findByIdAndUpdate(params.id, data, {
      new: true,
    })
      .populate('category', 'name icon color')
      .populate('submittedBy', 'name email');

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Item updated successfully', item },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Update item error:', error);
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
        { message: 'Invalid item ID' },
        { status: 400 }
      );
    }

    await dbConnect();

    const item = await Item.findByIdAndDelete(params.id);

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Item deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Delete item error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
