import { NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/db/queries/categories';
import { insertCategorySchema } from '@/db/schema/zod';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to get categories:', error);
    return NextResponse.json(
      { error: 'Failed to get categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedData = insertCategorySchema.parse(json);
    const newCategory = await createCategory(validatedData);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
