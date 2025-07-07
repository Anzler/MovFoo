'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import PairingResultsInner from './PairingResultsInner';

export default function PairingResultsPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-gray-500">Loading your pairing…</div>}>
      <PairingResultsInner />
    </Suspense>
  );
}

