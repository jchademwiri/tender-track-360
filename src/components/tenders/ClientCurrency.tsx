'use client';

import { useState, useEffect } from 'react';

function formatCurrency(value: number | null, currency = 'USD') {
  if (value === null || typeof value !== 'number' || isNaN(value)) {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function ClientCurrency({ value }: { value: number | null }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    return null;
  }

  return <>{formatCurrency(value)}</>;
}
