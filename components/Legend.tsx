'use client';

import { HVI_COLORS, HVI_LABELS, HVI_NULL_COLOR } from '@/lib/color-scale';

export function Legend() {
  return (
    <div className="absolute bottom-8 left-4 z-10 rounded-xl bg-white/95 shadow-lg px-4 py-3 min-w-[180px] border border-gray-100">
      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
        Heat Vulnerability Index
      </p>
      <div className="space-y-1">
        {([5, 4, 3, 2, 1] as const).map((score) => (
          <div key={score} className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-sm flex-shrink-0 border border-black/10"
              style={{ backgroundColor: HVI_COLORS[score] }}
              aria-hidden="true"
            />
            <span className="text-xs text-gray-700">
              {score} — {HVI_LABELS[score]}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-100">
          <span
            className="w-5 h-5 rounded-sm flex-shrink-0 border border-black/10"
            style={{ backgroundColor: HVI_NULL_COLOR }}
            aria-hidden="true"
          />
          <span className="text-xs text-gray-400">No data</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 leading-tight">
        Source: NYC DOHMH, 2024
      </p>
    </div>
  );
}
