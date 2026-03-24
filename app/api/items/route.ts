import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Item from '@/lib/models/Item';
import { verifyAuthCookie } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const itemType = searchParams.get('itemType');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;
    const query: any = {};

    if (category) query.category = category;
    if (itemType) query.itemType = itemType;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(query)
      .populate('category', 'name icon color')
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Item.countDocuments(query);

    return NextResponse.json(
      {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Get items error:', error);
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

    const item = new Item({
      ...data,
      submittedBy: payload.userId,
    });

    await item.save();

    await item.populate('category', 'name icon color');

    return NextResponse.json(
      { message: 'Item created successfully', item },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[v0] Create item error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
