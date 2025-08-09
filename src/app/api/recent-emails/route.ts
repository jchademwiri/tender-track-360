import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for recent email activity (in production, use a database)
let recentEmails: Array<{
  id: string;
  type: string;
  to: string;
  from: string;
  subject: string;
  status: 'sent' | 'failed';
  timestamp: string;
  error?: string;
}> = [];

export function addEmailLog(emailLog: {
  id?: string;
  type: string;
  to: string;
  from: string;
  subject: string;
  status: 'sent' | 'failed';
  error?: string;
}) {
  const log = {
    id:
      emailLog.id ||
      `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...emailLog,
    timestamp: new Date().toISOString(),
  };

  recentEmails.unshift(log);

  // Keep only last 50 emails
  if (recentEmails.length > 50) {
    recentEmails = recentEmails.slice(0, 50);
  }

  console.log('📝 Email log added:', log);
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const email = url.searchParams.get('email');

  let filteredEmails = recentEmails;

  if (email) {
    filteredEmails = recentEmails.filter((e) => e.to.includes(email));
  }

  const result = filteredEmails.slice(0, limit);

  return NextResponse.json({
    emails: result,
    total: filteredEmails.length,
    timestamp: new Date().toISOString(),
  });
}

export async function DELETE() {
  recentEmails = [];
  return NextResponse.json({ message: 'Email logs cleared' });
}
