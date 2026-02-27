'use client';

import { Popup } from 'react-map-gl/maplibre';
import { NtaFeature } from '@/lib/data';
import { HVI_COLORS, HVI_LABELS, fmtPct, fmtDollars, fmtDegF } from '@/lib/color-scale';

interface Props {
  feature: NtaFeature;
  longitude: number;
  latitude: number;
  onClose: () => void;
}

function ScoreBar({ score }: { score: number | null }) {
  if (score == null) return <span className="text-gray-400 text-sm">No data</span>;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className="w-5 h-5 rounded-sm border border-black/10"
            style={{ backgroundColor: s <= score ? HVI_COLORS[s as keyof typeof HVI_COLORS] : '#e5e7eb' }}
          />
        ))}
      </div>
      <span className="text-sm font-semibold" style={{ color: HVI_COLORS[score as keyof typeof HVI_COLORS] }}>
        {score} / 5 — {HVI_LABELS[score as keyof typeof HVI_LABELS]}
      </span>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-1 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500 leading-tight">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}

export function NeighborhoodPopup({ feature, longitude, latitude, onClose }: Props) {
  const p = feature.properties;
  const hviScore = p.hvi_score;

  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClose={onClose}
      closeButton
      closeOnClick={false}
      maxWidth="280px"
      className="hvi-popup"
    >
      <div className="p-1 min-w-[220px]">
        {/* Header */}
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-900 leading-tight">
            {p.neighborhood_name}
          </h2>
          {p.borough && (
            <p className="text-xs text-gray-500">{p.borough}</p>
          )}
        </div>

        {/* HVI Score */}
        <div className="mb-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Heat Vulnerability Index
          </p>
          <ScoreBar score={hviScore} />
        </div>

        {/* Component Factors */}
        {hviScore != null && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
              Risk Factors
            </p>
            <div>
              <DataRow
                label="Surface temperature"
                value={fmtDegF(p.surface_temp)}
              />
              <DataRow
                label="Green space coverage"
                value={fmtPct(p.green_space)}
              />
              <DataRow
                label="Households with AC"
                value={fmtPct(p.pct_hh_ac)}
              />
              <DataRow
                label="Median household income"
                value={fmtDollars(p.median_hh_income)}
              />
              <DataRow
                label="% Non-Hispanic Black"
                value={fmtPct(p.pct_black_non_hisp)}
              />
            </div>
          </div>
        )}

        <p className="text-[9px] text-gray-400 mt-2">
          NYC Dept. of Health &amp; Mental Hygiene, 2024
        </p>
      </div>
    </Popup>
  );
}
