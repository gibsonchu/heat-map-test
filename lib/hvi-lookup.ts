/**
 * NYC Heat Vulnerability Index (HVI) 2020 — static lookup by NTA name.
 *
 * Data sources (both from NYC DOHMH Environment & Health Data Portal):
 *   HVI scores: https://raw.githubusercontent.com/nychealth/EHDP-data/production/indicators/data/2411.json
 *   NTA names:  https://raw.githubusercontent.com/nychealth/EHDP-data/production/geography/GeoLookup.csv
 *
 * Joined on numeric GeoID; NTA names here are identical to the
 * `ntaname` field in the NYC Open Data 2020 NTA boundary GeoJSON (9nt8-h7nd).
 *
 * HVI score meanings:
 *   1 = Low risk, 2 = Low-medium, 3 = Medium, 4 = Medium-high, 5 = High risk
 */

export interface HviEntry {
  geo_id: number;
  borough: string;
  hvi_score: number;
}

/**
 * Keyed by exact 2020 NTA neighborhood name (matches `ntaname` in NYC Open Data).
 * Use normalizeForLookup() for fuzzy matching.
 */
export const HVI_BY_NAME: Record<string, HviEntry> = {
  // ── Bronx ────────────────────────────────────────────────────────────────
  "Mott Haven-Port Morris": { geo_id: 50101, borough: "Bronx", hvi_score: 5 },
  "Melrose": { geo_id: 50102, borough: "Bronx", hvi_score: 5 },
  "Hunts Point": { geo_id: 50201, borough: "Bronx", hvi_score: 5 },
  "Longwood": { geo_id: 50202, borough: "Bronx", hvi_score: 5 },
  "Morrisania": { geo_id: 50301, borough: "Bronx", hvi_score: 5 },
  "Claremont Village-Claremont (East)": { geo_id: 50302, borough: "Bronx", hvi_score: 5 },
  "Crotona Park East": { geo_id: 50303, borough: "Bronx", hvi_score: 5 },
  "Concourse-Concourse Village": { geo_id: 50401, borough: "Bronx", hvi_score: 5 },
  "Highbridge": { geo_id: 50402, borough: "Bronx", hvi_score: 4 },
  "Mount Eden-Claremont (West)": { geo_id: 50403, borough: "Bronx", hvi_score: 5 },
  "University Heights (South)-Morris Heights": { geo_id: 50501, borough: "Bronx", hvi_score: 5 },
  "Mount Hope": { geo_id: 50502, borough: "Bronx", hvi_score: 5 },
  "Fordham Heights": { geo_id: 50503, borough: "Bronx", hvi_score: 5 },
  "West Farms": { geo_id: 50601, borough: "Bronx", hvi_score: 5 },
  "Tremont": { geo_id: 50602, borough: "Bronx", hvi_score: 5 },
  "Belmont": { geo_id: 50603, borough: "Bronx", hvi_score: 5 },
  "University Heights (North)-Fordham": { geo_id: 50701, borough: "Bronx", hvi_score: 4 },
  "Bedford Park": { geo_id: 50702, borough: "Bronx", hvi_score: 3 },
  "Norwood": { geo_id: 50703, borough: "Bronx", hvi_score: 3 },
  "Kingsbridge Heights-Van Cortlandt Village": { geo_id: 50801, borough: "Bronx", hvi_score: 3 },
  "Kingsbridge-Marble Hill": { geo_id: 50802, borough: "Bronx", hvi_score: 4 },
  "Riverdale-Spuyten Duyvil": { geo_id: 50803, borough: "Bronx", hvi_score: 1 },
  "Soundview-Bruckner-Bronx River": { geo_id: 50901, borough: "Bronx", hvi_score: 4 },
  "Soundview-Clason Point": { geo_id: 50902, borough: "Bronx", hvi_score: 4 },
  "Castle Hill-Unionport": { geo_id: 50903, borough: "Bronx", hvi_score: 4 },
  "Parkchester": { geo_id: 50904, borough: "Bronx", hvi_score: 4 },
  "Westchester Square": { geo_id: 51001, borough: "Bronx", hvi_score: 5 },
  "Throgs Neck-Schuylerville": { geo_id: 51002, borough: "Bronx", hvi_score: 2 },
  "Pelham Bay-Country Club-City Island": { geo_id: 51003, borough: "Bronx", hvi_score: 2 },
  "Co-op City": { geo_id: 51004, borough: "Bronx", hvi_score: 4 },
  "Pelham Parkway-Van Nest": { geo_id: 51101, borough: "Bronx", hvi_score: 4 },
  "Morris Park": { geo_id: 51102, borough: "Bronx", hvi_score: 3 },
  "Pelham Gardens": { geo_id: 51103, borough: "Bronx", hvi_score: 4 },
  "Allerton": { geo_id: 51104, borough: "Bronx", hvi_score: 4 },
  "Williamsbridge-Olinville": { geo_id: 51201, borough: "Bronx", hvi_score: 5 },
  "Eastchester-Edenwald-Baychester": { geo_id: 51202, borough: "Bronx", hvi_score: 5 },
  "Wakefield-Woodlawn": { geo_id: 51203, borough: "Bronx", hvi_score: 5 },

  // ── Brooklyn ─────────────────────────────────────────────────────────────
  "Greenpoint": { geo_id: 470101, borough: "Brooklyn", hvi_score: 2 },
  "Williamsburg": { geo_id: 470102, borough: "Brooklyn", hvi_score: 2 },
  "South Williamsburg": { geo_id: 470103, borough: "Brooklyn", hvi_score: 4 },
  "East Williamsburg": { geo_id: 470104, borough: "Brooklyn", hvi_score: 4 },
  "Brooklyn Heights": { geo_id: 470201, borough: "Brooklyn", hvi_score: 1 },
  "Downtown Brooklyn-DUMBO-Boerum Hill": { geo_id: 470202, borough: "Brooklyn", hvi_score: 2 },
  "Fort Greene": { geo_id: 470203, borough: "Brooklyn", hvi_score: 2 },
  "Clinton Hill": { geo_id: 470204, borough: "Brooklyn", hvi_score: 2 },
  "Bedford-Stuyvesant (West)": { geo_id: 470301, borough: "Brooklyn", hvi_score: 3 },
  "Bedford-Stuyvesant (East)": { geo_id: 470302, borough: "Brooklyn", hvi_score: 4 },
  "Bushwick (West)": { geo_id: 470401, borough: "Brooklyn", hvi_score: 4 },
  "Bushwick (East)": { geo_id: 470402, borough: "Brooklyn", hvi_score: 4 },
  "Cypress Hills": { geo_id: 470501, borough: "Brooklyn", hvi_score: 4 },
  "East New York (North)": { geo_id: 470502, borough: "Brooklyn", hvi_score: 5 },
  "East New York-New Lots": { geo_id: 470503, borough: "Brooklyn", hvi_score: 5 },
  "Spring Creek-Starrett City": { geo_id: 470504, borough: "Brooklyn", hvi_score: 4 },
  "East New York-City Line": { geo_id: 470505, borough: "Brooklyn", hvi_score: 4 },
  "Carroll Gardens-Cobble Hill-Gowanus-Red Hook": { geo_id: 470601, borough: "Brooklyn", hvi_score: 2 },
  "Park Slope": { geo_id: 470602, borough: "Brooklyn", hvi_score: 1 },
  "Windsor Terrace-South Slope": { geo_id: 470701, borough: "Brooklyn", hvi_score: 1 },
  "Sunset Park (West)": { geo_id: 470702, borough: "Brooklyn", hvi_score: 3 },
  "Sunset Park (Central)": { geo_id: 470703, borough: "Brooklyn", hvi_score: 2 },
  "Prospect Heights": { geo_id: 470801, borough: "Brooklyn", hvi_score: 2 },
  "Crown Heights (North)": { geo_id: 470802, borough: "Brooklyn", hvi_score: 4 },
  "Crown Heights (South)": { geo_id: 470901, borough: "Brooklyn", hvi_score: 4 },
  "Prospect Lefferts Gardens-Wingate": { geo_id: 470902, borough: "Brooklyn", hvi_score: 5 },
  "Bay Ridge": { geo_id: 471001, borough: "Brooklyn", hvi_score: 2 },
  "Dyker Heights": { geo_id: 471002, borough: "Brooklyn", hvi_score: 3 },
  "Bensonhurst": { geo_id: 471101, borough: "Brooklyn", hvi_score: 4 },
  "Bath Beach": { geo_id: 471102, borough: "Brooklyn", hvi_score: 2 },
  "Gravesend (West)": { geo_id: 471103, borough: "Brooklyn", hvi_score: 4 },
  "Sunset Park (East)-Borough Park (West)": { geo_id: 471201, borough: "Brooklyn", hvi_score: 3 },
  "Borough Park": { geo_id: 471202, borough: "Brooklyn", hvi_score: 4 },
  "Kensington": { geo_id: 471203, borough: "Brooklyn", hvi_score: 3 },
  "Mapleton-Midwood (West)": { geo_id: 471204, borough: "Brooklyn", hvi_score: 3 },
  "Gravesend (South)": { geo_id: 471301, borough: "Brooklyn", hvi_score: 4 },
  "Coney Island-Sea Gate": { geo_id: 471302, borough: "Brooklyn", hvi_score: 5 },
  "Brighton Beach": { geo_id: 471303, borough: "Brooklyn", hvi_score: 4 },
  "Flatbush": { geo_id: 471401, borough: "Brooklyn", hvi_score: 4 },
  "Flatbush (West)-Ditmas Park-Parkville": { geo_id: 471402, borough: "Brooklyn", hvi_score: 3 },
  "Midwood": { geo_id: 471403, borough: "Brooklyn", hvi_score: 3 },
  "Gravesend (East)-Homecrest": { geo_id: 471501, borough: "Brooklyn", hvi_score: 3 },
  "Madison": { geo_id: 471502, borough: "Brooklyn", hvi_score: 3 },
  "Sheepshead Bay-Manhattan Beach-Gerritsen Beach": { geo_id: 471503, borough: "Brooklyn", hvi_score: 2 },
  "Ocean Hill": { geo_id: 471601, borough: "Brooklyn", hvi_score: 5 },
  "Brownsville": { geo_id: 471602, borough: "Brooklyn", hvi_score: 5 },
  "East Flatbush-Erasmus": { geo_id: 471701, borough: "Brooklyn", hvi_score: 5 },
  "East Flatbush-Farragut": { geo_id: 471702, borough: "Brooklyn", hvi_score: 5 },
  "East Flatbush-Rugby": { geo_id: 471703, borough: "Brooklyn", hvi_score: 5 },
  "East Flatbush-Remsen Village": { geo_id: 471704, borough: "Brooklyn", hvi_score: 5 },
  "Flatlands": { geo_id: 471801, borough: "Brooklyn", hvi_score: 3 },
  "Marine Park-Mill Basin-Bergen Beach": { geo_id: 471802, borough: "Brooklyn", hvi_score: 4 },
  "Canarsie": { geo_id: 471803, borough: "Brooklyn", hvi_score: 1 },

  // ── Manhattan ────────────────────────────────────────────────────────────
  "Financial District-Battery Park City": { geo_id: 610101, borough: "Manhattan", hvi_score: 1 },
  "Tribeca-Civic Center": { geo_id: 610102, borough: "Manhattan", hvi_score: 1 },
  "SoHo-Little Italy-Hudson Square": { geo_id: 610201, borough: "Manhattan", hvi_score: 1 },
  "Greenwich Village": { geo_id: 610202, borough: "Manhattan", hvi_score: 1 },
  "West Village": { geo_id: 610203, borough: "Manhattan", hvi_score: 1 },
  "Chinatown-Two Bridges": { geo_id: 610301, borough: "Manhattan", hvi_score: 3 },
  "Lower East Side": { geo_id: 610302, borough: "Manhattan", hvi_score: 2 },
  "East Village": { geo_id: 610303, borough: "Manhattan", hvi_score: 2 },
  "Chelsea-Hudson Yards": { geo_id: 610401, borough: "Manhattan", hvi_score: 1 },
  "Hell's Kitchen": { geo_id: 610402, borough: "Manhattan", hvi_score: 2 },
  "Midtown South-Flatiron-Union Square": { geo_id: 610501, borough: "Manhattan", hvi_score: 1 },
  "Midtown-Times Square": { geo_id: 610502, borough: "Manhattan", hvi_score: 1 },
  "Stuyvesant Town-Peter Cooper Village": { geo_id: 610601, borough: "Manhattan", hvi_score: 1 },
  "Gramercy": { geo_id: 610602, borough: "Manhattan", hvi_score: 1 },
  "Murray Hill-Kips Bay": { geo_id: 610603, borough: "Manhattan", hvi_score: 1 },
  "East Midtown-Turtle Bay": { geo_id: 610604, borough: "Manhattan", hvi_score: 1 },
  "Upper West Side-Lincoln Square": { geo_id: 610701, borough: "Manhattan", hvi_score: 1 },
  "Upper West Side (Central)": { geo_id: 610702, borough: "Manhattan", hvi_score: 1 },
  "Upper West Side-Manhattan Valley": { geo_id: 610703, borough: "Manhattan", hvi_score: 1 },
  "Upper East Side-Lenox Hill-Roosevelt Island": { geo_id: 610801, borough: "Manhattan", hvi_score: 1 },
  "Upper East Side-Carnegie Hill": { geo_id: 610802, borough: "Manhattan", hvi_score: 1 },
  "Upper East Side-Yorkville": { geo_id: 610803, borough: "Manhattan", hvi_score: 1 },
  "Morningside Heights": { geo_id: 610901, borough: "Manhattan", hvi_score: 2 },
  "Manhattanville-West Harlem": { geo_id: 610902, borough: "Manhattan", hvi_score: 3 },
  "Hamilton Heights-Sugar Hill": { geo_id: 610903, borough: "Manhattan", hvi_score: 3 },
  "Harlem (South)": { geo_id: 611001, borough: "Manhattan", hvi_score: 5 },
  "Harlem (North)": { geo_id: 611002, borough: "Manhattan", hvi_score: 5 },
  "East Harlem (South)": { geo_id: 611101, borough: "Manhattan", hvi_score: 4 },
  "East Harlem (North)": { geo_id: 611102, borough: "Manhattan", hvi_score: 5 },
  "Washington Heights (South)": { geo_id: 611201, borough: "Manhattan", hvi_score: 2 },
  "Washington Heights (North)": { geo_id: 611202, borough: "Manhattan", hvi_score: 1 },
  "Inwood": { geo_id: 611203, borough: "Manhattan", hvi_score: 3 },

  // ── Queens ───────────────────────────────────────────────────────────────
  "Astoria (North)-Ditmars-Steinway": { geo_id: 810101, borough: "Queens", hvi_score: 2 },
  "Old Astoria-Hallets Point": { geo_id: 810102, borough: "Queens", hvi_score: 3 },
  "Astoria (Central)": { geo_id: 810103, borough: "Queens", hvi_score: 2 },
  "Astoria (East)-Woodside (North)": { geo_id: 810104, borough: "Queens", hvi_score: 3 },
  "Queensbridge-Ravenswood-Dutch Kills": { geo_id: 810105, borough: "Queens", hvi_score: 2 },
  "Long Island City-Hunters Point": { geo_id: 810201, borough: "Queens", hvi_score: 3 },
  "Sunnyside": { geo_id: 810202, borough: "Queens", hvi_score: 3 },
  "Woodside": { geo_id: 810203, borough: "Queens", hvi_score: 2 },
  "Jackson Heights": { geo_id: 810301, borough: "Queens", hvi_score: 3 },
  "East Elmhurst": { geo_id: 810302, borough: "Queens", hvi_score: 3 },
  "North Corona": { geo_id: 810303, borough: "Queens", hvi_score: 2 },
  "Elmhurst": { geo_id: 810401, borough: "Queens", hvi_score: 4 },
  "Corona": { geo_id: 810402, borough: "Queens", hvi_score: 3 },
  "Maspeth": { geo_id: 810501, borough: "Queens", hvi_score: 3 },
  "Ridgewood": { geo_id: 810502, borough: "Queens", hvi_score: 3 },
  "Glendale": { geo_id: 810503, borough: "Queens", hvi_score: 3 },
  "Middle Village": { geo_id: 810504, borough: "Queens", hvi_score: 2 },
  "Rego Park": { geo_id: 810601, borough: "Queens", hvi_score: 2 },
  "Forest Hills": { geo_id: 810602, borough: "Queens", hvi_score: 2 },
  "College Point": { geo_id: 810701, borough: "Queens", hvi_score: 3 },
  "Whitestone-Beechhurst": { geo_id: 810702, borough: "Queens", hvi_score: 2 },
  "Bay Terrace-Clearview": { geo_id: 810703, borough: "Queens", hvi_score: 2 },
  "Murray Hill-Broadway Flushing": { geo_id: 810704, borough: "Queens", hvi_score: 2 },
  "East Flushing": { geo_id: 810705, borough: "Queens", hvi_score: 1 },
  "Queensboro Hill": { geo_id: 810706, borough: "Queens", hvi_score: 3 },
  "Flushing-Willets Point": { geo_id: 810707, borough: "Queens", hvi_score: 3 },
  "Kew Gardens Hills": { geo_id: 810801, borough: "Queens", hvi_score: 2 },
  "Pomonok-Electchester-Hillcrest": { geo_id: 810802, borough: "Queens", hvi_score: 4 },
  "Fresh Meadows-Utopia": { geo_id: 810803, borough: "Queens", hvi_score: 2 },
  "Jamaica Estates-Holliswood": { geo_id: 810804, borough: "Queens", hvi_score: 2 },
  "Jamaica Hills-Briarwood": { geo_id: 810805, borough: "Queens", hvi_score: 2 },
  "Kew Gardens": { geo_id: 810901, borough: "Queens", hvi_score: 1 },
  "Richmond Hill": { geo_id: 810902, borough: "Queens", hvi_score: 1 },
  "South Richmond Hill": { geo_id: 810903, borough: "Queens", hvi_score: 1 },
  "Ozone Park (North)": { geo_id: 810904, borough: "Queens", hvi_score: 1 },
  "Woodhaven": { geo_id: 810905, borough: "Queens", hvi_score: 1 },
  "South Ozone Park": { geo_id: 811001, borough: "Queens", hvi_score: 1 },
  "Ozone Park": { geo_id: 811002, borough: "Queens", hvi_score: 1 },
  "Howard Beach-Lindenwood": { geo_id: 811003, borough: "Queens", hvi_score: 5 },
  "Auburndale": { geo_id: 811101, borough: "Queens", hvi_score: 5 },
  "Bayside": { geo_id: 811102, borough: "Queens", hvi_score: 5 },
  "Douglaston-Little Neck": { geo_id: 811103, borough: "Queens", hvi_score: 5 },
  "Oakland Gardens-Hollis Hills": { geo_id: 811104, borough: "Queens", hvi_score: 5 },
  "Jamaica": { geo_id: 811201, borough: "Queens", hvi_score: 5 },
  "South Jamaica": { geo_id: 811202, borough: "Queens", hvi_score: 2 },
  "Baisley Park": { geo_id: 811203, borough: "Queens", hvi_score: 2 },
  "Springfield Gardens (North)-Rochdale Village": { geo_id: 811204, borough: "Queens", hvi_score: 4 },
  "St. Albans": { geo_id: 811205, borough: "Queens", hvi_score: 4 },
  "Hollis": { geo_id: 811206, borough: "Queens", hvi_score: 4 },
  "Glen Oaks-Floral Park-New Hyde Park": { geo_id: 811301, borough: "Queens", hvi_score: 3 },
  "Bellerose": { geo_id: 811302, borough: "Queens", hvi_score: 3 },
  "Queens Village": { geo_id: 811303, borough: "Queens", hvi_score: 3 },
  "Cambria Heights": { geo_id: 811304, borough: "Queens", hvi_score: 4 },
  "Laurelton": { geo_id: 811305, borough: "Queens", hvi_score: 5 },
  "Springfield Gardens (South)-Brookville": { geo_id: 811306, borough: "Queens", hvi_score: 3 },
  "Rosedale": { geo_id: 811307, borough: "Queens", hvi_score: 3 },
  "Far Rockaway-Bayswater": { geo_id: 811401, borough: "Queens", hvi_score: 4 },
  "Rockaway Beach-Arverne-Edgemere": { geo_id: 811402, borough: "Queens", hvi_score: 3 },
  "Breezy Point-Belle Harbor-Rockaway Park-Broad Channel": { geo_id: 811403, borough: "Queens", hvi_score: 1 },

  // ── Staten Island ────────────────────────────────────────────────────────
  "St. George-New Brighton": { geo_id: 850101, borough: "Staten Island", hvi_score: 2 },
  "Tompkinsville-Stapleton-Clifton-Fox Hills": { geo_id: 850102, borough: "Staten Island", hvi_score: 4 },
  "Rosebank-Shore Acres-Park Hill": { geo_id: 850103, borough: "Staten Island", hvi_score: 2 },
  "West New Brighton-Silver Lake-Grymes Hill": { geo_id: 850104, borough: "Staten Island", hvi_score: 2 },
  "Westerleigh-Castleton Corners": { geo_id: 850105, borough: "Staten Island", hvi_score: 2 },
  "Port Richmond": { geo_id: 850106, borough: "Staten Island", hvi_score: 1 },
  "Mariner's Harbor-Arlington-Graniteville": { geo_id: 850107, borough: "Staten Island", hvi_score: 1 },
  "Grasmere-Arrochar-South Beach-Dongan Hills": { geo_id: 850201, borough: "Staten Island", hvi_score: 1 },
  "New Dorp-Midland Beach": { geo_id: 850202, borough: "Staten Island", hvi_score: 1 },
  "Todt Hill-Emerson Hill-Lighthouse Hill-Manor Heights": { geo_id: 850203, borough: "Staten Island", hvi_score: 1 },
  "New Springville-Willowbrook-Bulls Head-Travis": { geo_id: 850204, borough: "Staten Island", hvi_score: 1 },
  "Oakwood-Richmondtown": { geo_id: 850301, borough: "Staten Island", hvi_score: 1 },
  "Great Kills-Eltingville": { geo_id: 850302, borough: "Staten Island", hvi_score: 1 },
  "Arden Heights-Rossville": { geo_id: 850303, borough: "Staten Island", hvi_score: 1 },
  "Annadale-Huguenot-Prince's Bay-Woodrow": { geo_id: 850304, borough: "Staten Island", hvi_score: 1 },
  "Tottenville-Charleston": { geo_id: 850305, borough: "Staten Island", hvi_score: 1 },
};

/** Normalize a neighborhood name for fuzzy lookup */
export function normalizeForLookup(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Pre-build normalized lookup for runtime use
const _normalizedCache: Record<string, HviEntry> = {};
for (const [name, entry] of Object.entries(HVI_BY_NAME)) {
  _normalizedCache[normalizeForLookup(name)] = entry;
}

/** Look up HVI entry by neighborhood name (exact or fuzzy). Returns null if not found. */
export function lookupHvi(ntaName: string): HviEntry | null {
  // Try exact match first
  if (HVI_BY_NAME[ntaName]) return HVI_BY_NAME[ntaName];
  // Fall back to normalized match
  return _normalizedCache[normalizeForLookup(ntaName)] ?? null;
}
