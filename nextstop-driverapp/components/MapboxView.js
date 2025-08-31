import React, { useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from './ui/Theme';

// Reusable Mapbox GL JS webview map. Works in Expo Go.
// Props:
// - accessToken: Mapbox public token
// - center: { latitude, longitude }
// - markers: [{ id, latitude, longitude, title }]
// - zoom: number (default 12)
// - style: RN style for container
export default function MapboxView({ accessToken, center, markers = [], lineCoordinates = [], zoom = 12, style }) {
  const html = useMemo(() => {
    const centerLng = center?.longitude ?? 0;
    const centerLat = center?.latitude ?? 0;
    const markerFeatures = markers.map(m => ({
      type: 'Feature',
      properties: { title: m.title || '' },
      geometry: { type: 'Point', coordinates: [m.longitude, m.latitude] },
    }));
    const routeCoords = (lineCoordinates || []).map(c => [c.longitude, c.latitude]);

    return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .marker {
      background: #22c55e;
      width: 12px; height: 12px; border-radius: 6px;
      border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js"></script>
  <script>
    mapboxgl.accessToken = '${accessToken}';
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [${centerLng}, ${centerLat}],
      zoom: ${zoom},
    });
    map.addControl(new mapboxgl.NavigationControl());

    const geojson = {
      type: 'FeatureCollection',
      features: ${JSON.stringify(markerFeatures)}
    };

    geojson.features.forEach(function(marker) {
      const el = document.createElement('div');
      el.className = 'marker';
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(map);
    });

    map.on('load', function() {
      const routeCoords = ${JSON.stringify(routeCoords)};
      if (routeCoords && routeCoords.length > 1) {
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: routeCoords }
          }
        });
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#22c55e', 'line-width': 4 }
        });
      }

      // Fit bounds for markers + route
      const bounds = new mapboxgl.LngLatBounds();
      let hasBounds = false;
      geojson.features.forEach(f => { bounds.extend(f.geometry.coordinates); hasBounds = true; });
      if (routeCoords && routeCoords.length) {
        routeCoords.forEach(c => { bounds.extend(c); hasBounds = true; });
      }
      if (hasBounds) {
        map.fitBounds(bounds, { padding: 40, maxZoom: 14, duration: 600 });
      }
    });
  </script>
</body>
</html>`;
  }, [accessToken, center, markers, zoom]);

  if (!accessToken) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={["*"]}
      style={[styles.webview, style]}
      source={{ html }}
    />
  );
}

const styles = StyleSheet.create({
  webview: { width: '100%', height: 220, backgroundColor: colors.muted, borderRadius: 8 },
  loading: { width: '100%', height: 220, alignItems: 'center', justifyContent: 'center' },
});
