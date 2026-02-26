import { NextResponse } from 'next/server';

// NYC Open Data SODA endpoints
const HVI_URL = 'https://data.cityofnewyork.us/resource/4mhf-duep.json?$limit=500';
const NTA_URL = 'https://data.cityofnewyork.us/resource/9nt8-h7nd.geojson?$limit=300';

type AnyRecord = Record<string, unknown>;

/** Pick the first non-empty value from a record given a priority list of field names */
function pick(rec: AnyRecord, ...fields: string[]): string | null {
  for (const f of fields) {
    const v = rec[f];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return null;
}

/** Normalize a neighborhood name for fuzzy matching */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  try {
    const [hviRes, ntaRes] = await Promise.all([
      fetch(HVI_URL, { next: { revalidate: 86400 } }),
      fetch(NTA_URL, { next: { revalidate: 86400 } }),
    ]);

    if (!hviRes.ok) throw new Error(`HVI fetch failed: ${hviRes.status}`);
    if (!ntaRes.ok) throw new Error(`NTA fetch failed: ${ntaRes.status}`);

    const hviRecords: AnyRecord[] = await hviRes.json();
    const ntaGeoJSON = await ntaRes.json();

    // ── Debug: log actual field names (visible in Vercel function logs) ──
    if (hviRecords.length > 0) {
      console.log('[HVI API] fields:', Object.keys(hviRecords[0]));
      console.log('[HVI API] sample record:', JSON.stringify(hviRecords[0]));
    }
    const sampleProps = ntaGeoJSON.features?.[0]?.properties ?? {};
    console.log('[NTA API] fields:', Object.keys(sampleProps));
    console.log('[NTA API] sample props:', JSON.stringify(sampleProps));

    // ── Build HVI lookup by NTA code (try every known field name) ──
    const hviByCode: Record<string, AnyRecord> = {};
    const hviByName: Record<string, AnyRecord> = {};

    for (const rec of hviRecords) {
      const code = pick(
        rec,
        'nta_code', 'geo_id', 'geoid', 'ntacode', 'nta2020',
        'geoID', 'GeoID', 'NTACode', 'nta_id',
      );
      if (code) hviByCode[code] = rec;

      const name = pick(rec, 'neighborhood', 'nta_name', 'ntaname', 'name', 'neighborhood_name');
      if (name) hviByName[norm(name)] = rec;
    }

    console.log(
      `[HVI API] indexed ${Object.keys(hviByCode).length} by code, ${Object.keys(hviByName).length} by name`,
    );

    // ── Join onto NTA boundary features ──
    let codeMatches = 0;
    let nameMatches = 0;

    const features = (ntaGeoJSON.features ?? []).map(
      (f: { geometry: unknown; properties: AnyRecord }) => {
        const p = f.properties ?? {};

        // Try to get NTA code from boundary
        const ntaCode = pick(
          p,
          'nta2020', 'ntacode', 'nta_code', 'geoid', 'geo_id',
          'NTA2020', 'NTACode',
        ) ?? '';

        // Try code-based lookup first, then name-based fallback
        let hvi = ntaCode ? hviByCode[ntaCode] : null;
        let matchType = 'code';

        if (!hvi) {
          const boundaryName = pick(p, 'ntaname', 'nta_name', 'name', 'neighborhood') ?? '';
          if (boundaryName) {
            hvi = hviByName[norm(boundaryName)] ?? null;
            matchType = 'name';
          }
        }

        if (hvi) {
          if (matchType === 'code') codeMatches++;
          else nameMatches++;
        }

        // Resolve HVI score — try every plausible column name
        const rawScore = hvi
          ? pick(hvi as AnyRecord, 'hvi', 'hvi_score', 'score', 'rank', 'heat_vulnerability_index', 'value')
          : null;
        const hviScore = rawScore != null ? Number(rawScore) : null;

        // Resolve component fields
        const surfaceTemp = hvi
          ? pick(hvi as AnyRecord, 'surface_temp_percentile', 'surfacetemp', 'surface_temp', 'lst_percentile')
          : null;
        const greenSpace = hvi
          ? pick(hvi as AnyRecord, 'green_space_percentile', 'greenspace', 'green_space', 'pct_green')
          : null;
        const pctAC = hvi
          ? pick(hvi as AnyRecord, 'pct_hh_ac', 'ac_access_percentile', 'pct_ac', 'percent_ac', 'pct_households_with_ac')
          : null;
        const income = hvi
          ? pick(hvi as AnyRecord, 'median_hh_income', 'median_household_income', 'income', 'median_income')
          : null;
        const pctBlack = hvi
          ? pick(hvi as AnyRecord, 'pct_black_non_hisp', 'pct_non_hispanic_black', 'black_non_hisp', 'pct_black')
          : null;

        const neighborhoodName =
          (hvi ? pick(hvi as AnyRecord, 'neighborhood', 'nta_name', 'ntaname') : null) ??
          pick(p, 'ntaname', 'nta_name', 'name') ??
          ntaCode;

        const borough =
          (hvi ? pick(hvi as AnyRecord, 'borough', 'boro_name', 'boroname') : null) ??
          pick(p, 'boroname', 'boro_name', 'borough') ??
          '';

        return {
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            nta_code: ntaCode,
            neighborhood_name: neighborhoodName,
            borough,
            hvi_score: hviScore,
            surface_temp: surfaceTemp != null ? Number(surfaceTemp) : null,
            green_space: greenSpace != null ? Number(greenSpace) : null,
            pct_hh_ac: pctAC != null ? Number(pctAC) : null,
            median_hh_income: income != null ? Number(income) : null,
            pct_black_non_hisp: pctBlack != null ? Number(pctBlack) : null,
          },
        };
      },
    );

    console.log(
      `[HVI API] join complete: ${codeMatches} code matches, ${nameMatches} name matches, ` +
        `${features.length - codeMatches - nameMatches} unmatched`,
    );

    return NextResponse.json(
      { type: 'FeatureCollection', features },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[HVI API] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
