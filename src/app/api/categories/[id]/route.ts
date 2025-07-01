import { NextResponse } from 'next/server';
import {
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '@/db/queries/categories';
import { insertCategorySchema } from '@/db/schema/zod';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await getCategoryById(params.id);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Failed to get category ${params.id}:`, error);
    return NextResponse.json(
      { error: `Failed to get category ${params.id}` },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const json = await request.json();
    const validatedData = insertCategorySchema.partial().parse(json);
    const updatedCategory = await updateCategory(params.id, validatedData);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(`Failed to update category ${params.id}:`, error);
    return NextResponse.json(
      { error: `Failed to update category ${params.id}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteCategory(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete category ${params.id}:`, error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: `Failed to delete category ${params.id}` },
      { status: 500 }
    );
  }
}
