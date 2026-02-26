/**
 * Fetches NYC Heat Vulnerability Index (HVI) data and NTA boundaries,
 * joins them, and writes a pre-joined GeoJSON to public/data/.
 *
 * Run with: node scripts/fetch-hvi-data.mjs
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'public', 'data', 'nyc-nta-hvi.geojson');

// NYC Open Data SODA API endpoints
const HVI_API = 'https://data.cityofnewyork.us/resource/4mhf-duep.json?$limit=500';
const NTA_GEOJSON_API = 'https://data.cityofnewyork.us/resource/9nt8-h7nd.geojson?$limit=300';

async function fetchJSON(url) {
  console.log(`Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function main() {
  // 1. Fetch HVI scores
  const hviRecords = await fetchJSON(HVI_API);
  console.log(`  Got ${hviRecords.length} HVI records`);

  // Build lookup: NTA code -> HVI record
  const hviByNta = {};
  for (const rec of hviRecords) {
    // The dataset uses nta_code or ntacode field
    const ntaCode = rec.nta_code || rec.ntacode || rec.geoid;
    if (ntaCode) {
      hviByNta[ntaCode] = rec;
    }
  }
  console.log(`  Indexed ${Object.keys(hviByNta).length} NTAs by code`);

  // 2. Fetch NTA GeoJSON boundaries
  const ntaGeoJSON = await fetchJSON(NTA_GEOJSON_API);
  console.log(`  Got ${ntaGeoJSON.features?.length ?? 0} NTA features`);

  // 3. Join: add HVI properties to each NTA feature
  let matched = 0;
  const features = ntaGeoJSON.features.map((feature) => {
    const props = feature.properties || {};
    // NTA boundary dataset uses ntacode or nta2020 field
    const ntaCode = props.ntacode || props.nta2020 || props.geoid;
    const hvi = hviByNta[ntaCode];

    if (hvi) matched++;

    return {
      ...feature,
      properties: {
        ...props,
        // HVI score (1-5, or null if not matched)
        hvi_score: hvi ? Number(hvi.hvi) : null,
        // Component indicators
        surface_temp_percentile: hvi ? Number(hvi.surface_temp_percentile ?? hvi.surfacetemp) : null,
        green_space_percentile: hvi ? Number(hvi.green_space_percentile ?? hvi.greenspace) : null,
        ac_access_percentile: hvi ? Number(hvi.ac_access_percentile ?? hvi.pct_hh_ac) : null,
        poverty_percentile: hvi ? Number(hvi.poverty_percentile ?? hvi.pct_poverty) : null,
        black_non_hisp_percentile: hvi ? Number(hvi.black_non_hisp_percentile ?? hvi.pct_black_non_hisp) : null,
        // Neighborhood name (prefer HVI dataset name if available)
        neighborhood_name: hvi?.neighborhood ?? props.ntaname ?? props.nta_name ?? props.ntacode,
        borough: hvi?.borough ?? props.boroname ?? props.borough_name ?? props.boro_name,
        nta_code: ntaCode,
      },
    };
  });

  console.log(`  Matched ${matched} / ${features.length} NTA features with HVI data`);

  // 4. Write output
  const output = {
    type: 'FeatureCollection',
    features,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nWrote joined GeoJSON to: ${OUTPUT_PATH}`);
  console.log(`  Total features: ${features.length}`);
  console.log(`  Features with HVI score: ${matched}`);

  // Print sample HVI record to help debug field names
  if (hviRecords.length > 0) {
    console.log('\nSample HVI record fields:', Object.keys(hviRecords[0]));
    console.log('Sample:', JSON.stringify(hviRecords[0], null, 2));
  }
  if (ntaGeoJSON.features?.length > 0) {
    console.log('\nSample NTA feature properties:', Object.keys(ntaGeoJSON.features[0].properties || {}));
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
