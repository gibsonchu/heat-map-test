export interface HviRecord {
  nta_code: string;
  neighborhood: string;
  borough: string;
  hvi: number;
  // Component factors (percentiles 1-100)
  surface_temp?: number;
  green_space?: number;
  pct_hh_ac?: number;
  median_hh_income?: number;
  pct_black_non_hisp?: number;
}

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

// NYC Open Data SODA endpoints (public, no auth required)
const HVI_ENDPOINT = 'https://data.cityofnewyork.us/resource/4mhf-duep.json?$limit=500';
const NTA_GEOJSON_ENDPOINT = 'https://data.cityofnewyork.us/resource/9nt8-h7nd.geojson?$limit=300';

export async function fetchHviGeoJSON(): Promise<NtaGeoJSON> {
  const [hviRecords, ntaGeoJSON] = await Promise.all([
    fetch(HVI_ENDPOINT).then((r) => r.json()),
    fetch(NTA_GEOJSON_ENDPOINT).then((r) => r.json()),
  ]);

  // Index HVI records by NTA code
  const hviByNta: Record<string, Record<string, string>> = {};
  for (const rec of hviRecords as Record<string, string>[]) {
    const code = rec.nta_code || rec.ntacode || rec.geoid;
    if (code) hviByNta[code] = rec;
  }

  // Join HVI data onto NTA features
  const features: NtaFeature[] = (ntaGeoJSON.features || []).map(
    (f: { type: string; geometry: GeoJSON.Geometry; properties: Record<string, string> }) => {
      const props = f.properties || {};
      const ntaCode = props.ntacode || props.nta2020 || props.geoid || '';
      const hvi = hviByNta[ntaCode];

      return {
        type: 'Feature',
        geometry: f.geometry,
        properties: {
          nta_code: ntaCode,
          neighborhood_name:
            (hvi?.neighborhood || props.ntaname || props.nta_name || ntaCode) as string,
          borough: (hvi?.borough || props.boroname || props.boro_name || '') as string,
          hvi_score: hvi?.hvi != null ? Number(hvi.hvi) : null,
          surface_temp: hvi?.surface_temp_percentile != null
            ? Number(hvi.surface_temp_percentile)
            : null,
          green_space: hvi?.green_space_percentile != null
            ? Number(hvi.green_space_percentile)
            : null,
          pct_hh_ac: hvi?.pct_hh_ac != null ? Number(hvi.pct_hh_ac) : null,
          median_hh_income: hvi?.median_hh_income != null
            ? Number(hvi.median_hh_income)
            : null,
          pct_black_non_hisp: hvi?.pct_black_non_hisp != null
            ? Number(hvi.pct_black_non_hisp)
            : null,
        },
      };
    }
  );

  return { type: 'FeatureCollection', features };
}
