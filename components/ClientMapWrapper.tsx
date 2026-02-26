'use client';

import dynamic from 'next/dynamic';

const HeatMap = dynamic(() => import('./HeatMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-dvh w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading map…</p>
      </div>
    </div>
  ),
});

export default function ClientMapWrapper() {
  return <HeatMap />;
}
