import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Category from '@/lib/models/Category';
import { verifyAuthCookie } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const categories = await Category.find({}).sort({ name: 1 });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    console.error('[v0] Get categories error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await verifyAuthCookie();

    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const data = await req.json();

    const category = new Category(data);
    await category.save();

    return NextResponse.json(
      { message: 'Category created successfully', category },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[v0] Create category error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
