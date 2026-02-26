export interface NtaFeature {
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: {
    nta_code: string;
    neighborhood_name: string;
    borough: string;
    hvi_score: number | null;
    surface_temp?: number | null;
    green_space?: number | null;
    pct_hh_ac?: number | null;
    median_hh_income?: number | null;
    pct_black_non_hisp?: number | null;
  };
}

export interface NtaGeoJSON {
  type: 'FeatureCollection';
  features: NtaFeature[];
}

/**
 * Fetches pre-joined NTA + HVI GeoJSON from the server-side API route,
 * which handles the join and field-name detection with logging.
 */
export async function fetchHviGeoJSON(): Promise<NtaGeoJSON> {
  const res = await fetch('/api/hvi');
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string })?.error ?? `API error ${res.status}`);
  }
  return res.json() as Promise<NtaGeoJSON>;
}
