import { NextResponse } from 'next/server';
import { lookupHvi } from '@/lib/hvi-lookup';

// Only the NTA boundary GeoJSON is fetched at runtime — HVI scores are embedded statically.
const NTA_URL = 'https://data.cityofnewyork.us/resource/9nt8-h7nd.geojson?$limit=300';

export async function GET() {
  try {
    const ntaRes = await fetch(NTA_URL, { next: { revalidate: 86400 } });
    if (!ntaRes.ok) throw new Error(`NTA boundary fetch failed: ${ntaRes.status}`);

    const ntaGeoJSON = await ntaRes.json();
    const features = ntaGeoJSON.features ?? [];

    let matched = 0;

    const joined = features.map((f: { geometry: unknown; properties: Record<string, string> }) => {
      const p = f.properties ?? {};
      // ntaname is the confirmed field name in the NYC Open Data 9nt8-h7nd dataset
      const ntaName: string =
        p.ntaname ?? p.nta_name ?? p.name ?? '';
      const borough: string =
        p.boroname ?? p.boro_name ?? p.borough ?? '';

      const hvi = lookupHvi(ntaName);
      if (hvi) matched++;

      return {
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          nta_code: p.nta2020 ?? p.ntacode ?? p.nta_code ?? '',
          neighborhood_name: ntaName || (hvi ? '' : ''),
          borough: borough || (hvi?.borough ?? ''),
          hvi_score: hvi?.hvi_score ?? null,
          // Component fields not available from the EHDP summary data
          surface_temp: null,
          green_space: null,
          pct_hh_ac: null,
          median_hh_income: null,
          pct_black_non_hisp: null,
        },
      };
    });

    console.log(
      `[HVI API] ${matched}/${features.length} NTA features matched with HVI scores`,
    );

    return NextResponse.json(
      { type: 'FeatureCollection', features: joined },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[HVI API] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
