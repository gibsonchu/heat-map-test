import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

// Only the NTA boundary GeoJSON is fetched at runtime — HVI + component data come from local CSV.
const NTA_URL = 'https://data.cityofnewyork.us/resource/9nt8-h7nd.geojson?$limit=300';

interface HviRecord {
  nta_code: string;
  hvi_score: number;
  surface_temp: number;
  median_hh_income: number;
  green_space: number;
  pct_hh_ac: number;
  pct_black_non_hisp: number;
  borough: string;
}

function parseBoroughFromCode(ntaCode: string): string {
  const prefix = ntaCode.slice(0, 2).toUpperCase();
  switch (prefix) {
    case 'BX': return 'Bronx';
    case 'BK': return 'Brooklyn';
    case 'MN': return 'Manhattan';
    case 'QN': return 'Queens';
    case 'SI': return 'Staten Island';
    default: return '';
  }
}

function normalizeForLookup(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function loadHviData(): Map<string, HviRecord> {
  const csvPath = path.join(process.cwd(), 'public', 'data', 'hvi-nta-2020.csv');
  const text = readFileSync(csvPath, 'utf-8');
  const lines = text.trim().split('\n');
  // Skip header (line 0)
  const map = new Map<string, HviRecord>();

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 10) continue;
    const ntaCode = cols[0].trim();
    const geoname = cols[2].trim();
    if (!geoname) continue;

    const record: HviRecord = {
      nta_code: ntaCode,
      hvi_score: parseInt(cols[4].trim(), 10),
      surface_temp: parseFloat(cols[5].trim()),
      median_hh_income: parseFloat(cols[6].trim()),
      green_space: parseFloat(cols[7].trim()),
      pct_hh_ac: parseFloat(cols[8].trim()),
      pct_black_non_hisp: parseFloat(cols[9].trim()),
      borough: parseBoroughFromCode(ntaCode),
    };

    // Index by exact name and normalized name
    map.set(geoname, record);
    map.set(normalizeForLookup(geoname), record);
  }

  return map;
}

export async function GET() {
  try {
    const hviData = loadHviData();

    const ntaRes = await fetch(NTA_URL, { next: { revalidate: 86400 } });
    if (!ntaRes.ok) throw new Error(`NTA boundary fetch failed: ${ntaRes.status}`);

    const ntaGeoJSON = await ntaRes.json();
    const features = ntaGeoJSON.features ?? [];

    let matched = 0;

    const joined = features.map((f: { geometry: unknown; properties: Record<string, string> }) => {
      const p = f.properties ?? {};
      const ntaName: string = p.ntaname ?? p.nta_name ?? p.name ?? '';
      const borough: string = p.boroname ?? p.boro_name ?? p.borough ?? '';

      // Look up by exact name, then normalized name
      const hvi = hviData.get(ntaName) ?? hviData.get(normalizeForLookup(ntaName)) ?? null;
      if (hvi) matched++;

      return {
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          nta_code: p.nta2020 ?? p.ntacode ?? p.nta_code ?? '',
          neighborhood_name: ntaName,
          borough: borough || (hvi?.borough ?? ''),
          hvi_score: hvi?.hvi_score ?? null,
          surface_temp: hvi?.surface_temp ?? null,
          green_space: hvi?.green_space ?? null,
          pct_hh_ac: hvi?.pct_hh_ac ?? null,
          median_hh_income: hvi?.median_hh_income ?? null,
          pct_black_non_hisp: hvi?.pct_black_non_hisp ?? null,
        },
      };
    });

    console.log(
      `[HVI API] ${matched}/${features.length} NTA features matched with HVI data`,
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
