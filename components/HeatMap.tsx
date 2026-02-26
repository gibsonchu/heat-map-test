'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Map, { Source, Layer, MapRef, MapMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { fetchHviGeoJSON, NtaFeature, NtaGeoJSON } from '@/lib/data';
import { getHviFillColor } from '@/lib/color-scale';
import { Legend } from './Legend';
import { NeighborhoodPopup } from './NeighborhoodPopup';
import { AddressSearch } from './AddressSearch';

// Free CartoDB light basemap (no API key needed)
const MAP_STYLE = {
  version: 8 as const,
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sources: {
    'carto-light': {
      type: 'raster' as const,
      tiles: [
        'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
  },
  layers: [
    {
      id: 'carto-light-layer',
      type: 'raster' as const,
      source: 'carto-light',
    },
  ],
};

interface PopupState {
  feature: NtaFeature;
  longitude: number;
  latitude: number;
}

export default function HeatMap() {
  const mapRef = useRef<MapRef>(null);
  const [geoData, setGeoData] = useState<NtaGeoJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Load HVI + NTA data on mount
  useEffect(() => {
    fetchHviGeoJSON()
      .then(setGeoData)
      .catch(() => setError('Failed to load heat vulnerability data. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      const features = e.features;
      if (!features || features.length === 0) {
        setPopup(null);
        return;
      }
      const clicked = features[0];
      const props = clicked.properties as NtaFeature['properties'];
      if (!props) return;

      setPopup({
        feature: { type: 'Feature', geometry: clicked.geometry as GeoJSON.Geometry, properties: props },
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
      });
    },
    []
  );

  const handleMouseMove = useCallback((e: MapMouseEvent) => {
    const features = e.features;
    if (features && features.length > 0) {
      const props = features[0].properties as NtaFeature['properties'];
      setHoveredId(props?.nta_code ?? null);
      if (mapRef.current) {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      }
    } else {
      setHoveredId(null);
      if (mapRef.current) {
        mapRef.current.getCanvas().style.cursor = '';
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    if (mapRef.current) {
      mapRef.current.getCanvas().style.cursor = '';
    }
  }, []);

  const handleAddressSelect = useCallback(
    (result: { coordinates: [number, number] }) => {
      mapRef.current?.flyTo({
        center: result.coordinates,
        zoom: 14,
        duration: 1200,
      });
    },
    []
  );

  const fillColor = getHviFillColor();

  const fillOpacity = hoveredId
    ? (['case', ['==', ['get', 'nta_code'], hoveredId], 0.95, 0.75] as unknown as number)
    : 0.75;

  return (
    <div className="relative w-full h-dvh">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-600 font-medium">Loading heat vulnerability data…</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm text-center mx-4">
            <p className="text-red-600 font-medium mb-2">Error loading data</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      )}

      {/* Address Search */}
      <AddressSearch onSelect={handleAddressSelect} />

      {/* Map */}
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={{
          longitude: -73.944,
          latitude: 40.693,
          zoom: 10.5,
        }}
        minZoom={9}
        maxZoom={16}
        maxBounds={[
          [-74.6, 40.35],
          [-73.4, 41.05],
        ]}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={geoData ? ['nta-fill'] : []}
        style={{ width: '100%', height: '100%' }}
        attributionControl={{ compact: true }}
      >
        {/* NTA choropleth data */}
        {geoData && (
          <Source id="nta-hvi" type="geojson" data={geoData} generateId>
            {/* Fill layer */}
            <Layer
              id="nta-fill"
              type="fill"
              paint={{
                'fill-color': fillColor as unknown as string,
                'fill-opacity': fillOpacity,
              }}
            />
            {/* Hover highlight outline */}
            <Layer
              id="nta-hover-outline"
              type="line"
              paint={{
                'line-color': '#1a1a1a',
                'line-width': hoveredId
                  ? (['case', ['==', ['get', 'nta_code'], hoveredId], 2.5, 0.3] as unknown as number)
                  : 0.3,
                'line-opacity': 0.6,
              }}
            />
          </Source>
        )}

        {/* Neighborhood popup */}
        {popup && (
          <NeighborhoodPopup
            feature={popup.feature}
            longitude={popup.longitude}
            latitude={popup.latitude}
            onClose={() => setPopup(null)}
          />
        )}
      </Map>

      {/* Legend */}
      <Legend />

      {/* Title card */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 rounded-xl shadow-lg px-4 py-3 max-w-[200px] border border-gray-100">
        <h1 className="text-sm font-bold text-gray-900 leading-tight">
          NYC Extreme Heat Risk Map
        </h1>
        <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
          Heat Vulnerability Index by neighborhood
        </p>
        <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">
          Click a neighborhood for details
        </p>
      </div>
    </div>
  );
}
