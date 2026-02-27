// ColorBrewer YlOrRd 5-class sequential palette for HVI scores 1-5
// Accessible color ramp: yellow (low) → orange → red (high risk)
export const HVI_COLORS: Record<number, string> = {
  1: '#ffffb2',
  2: '#fecc5c',
  3: '#fd8d3c',
  4: '#f03b20',
  5: '#bd0026',
};

// Null/unknown color
export const HVI_NULL_COLOR = '#d4d4d4';

export const HVI_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Low-Medium',
  3: 'Medium',
  4: 'Medium-High',
  5: 'High',
};

/**
 * Returns a MapLibre GL expression for filling NTA polygons by HVI score.
 * This avoids re-rendering the map layer on hover — colors are baked into the style.
 */
export function getHviFillColor() {
  return [
    'case',
    ['==', ['get', 'hvi_score'], 1], HVI_COLORS[1],
    ['==', ['get', 'hvi_score'], 2], HVI_COLORS[2],
    ['==', ['get', 'hvi_score'], 3], HVI_COLORS[3],
    ['==', ['get', 'hvi_score'], 4], HVI_COLORS[4],
    ['==', ['get', 'hvi_score'], 5], HVI_COLORS[5],
    HVI_NULL_COLOR,
  ];
}

/** Returns a MapLibre expression that highlights hovered feature */
export function getHviFillOpacity(hoveredId: string | null) {
  if (!hoveredId) return 0.75;
  return ['case', ['==', ['get', 'nta_code'], hoveredId], 1.0, 0.75];
}

/** Format a percentage value for display */
export function fmtPct(val: number | null | undefined): string {
  if (val == null) return 'N/A';
  return `${Math.round(val)}%`;
}

/** Format a dollar value for display */
export function fmtDollars(val: number | null | undefined): string {
  if (val == null) return 'N/A';
  return `$${Math.round(val).toLocaleString()}`;
}

/** Format a temperature in degrees Fahrenheit */
export function fmtDegF(val: number | null | undefined): string {
  if (val == null) return 'N/A';
  return `${val.toFixed(1)}°F`;
}

/** Format a percentile for display */
export function fmtPercentile(val: number | null | undefined): string {
  if (val == null) return 'N/A';
  return `${Math.round(val)}th percentile`;
}
