import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  console.log('Received webhook:', requestBody);
  return new NextResponse('Webhook received', { status: 200 });
}
