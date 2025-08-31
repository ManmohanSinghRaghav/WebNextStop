import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { supabase } from '../lib/supabaseClient'
import BottomSheet from './BottomSheet.jsx'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Unicode-safe base64 encoding function
const unicodeToBase64 = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
}

// Custom icons
const busIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + unicodeToBase64(`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
      <rect x="8" y="10" width="16" height="12" rx="2" fill="white"/>
      <rect x="10" y="12" width="4" height="3" fill="#4CAF50"/>
      <rect x="18" y="12" width="4" height="3" fill="#4CAF50"/>
      <circle cx="12" cy="20" r="1.5" fill="#4CAF50"/>
      <circle cx="20" cy="20" r="1.5" fill="#4CAF50"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
})

const stopIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + unicodeToBase64(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#2196F3" stroke="#fff" stroke-width="2"/>
      <rect x="8" y="6" width="8" height="12" rx="1" fill="white"/>
      <rect x="9" y="8" width="6" height="1" fill="#2196F3"/>
      <rect x="9" y="10" width="6" height="1" fill="#2196F3"/>
      <rect x="9" y="12" width="6" height="1" fill="#2196F3"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
})

// Component to handle map updates
function MapUpdater({ center, buses, mapRef, routePolyline, routeWaypoints }) {
  const map = useMap()
  const busMarkersRef = useRef(new Map())

  useEffect(() => {
    if (mapRef) {
      mapRef.current = map
    }
  }, [map, mapRef])

  useEffect(() => {
    if (center) {
      map.setView(center, 15)
    }
  }, [center, map])

  useEffect(() => {
    const currentMarkers = busMarkersRef.current

    // Remove markers for buses that no longer exist
    for (const [busId, marker] of currentMarkers) {
      if (!buses.find(bus => bus.id === busId)) {
        map.removeLayer(marker)
        currentMarkers.delete(busId)
      }
    }

    // Add or update markers for current buses
    buses.forEach(bus => {
      const existingMarker = currentMarkers.get(bus.id)
      const newLatLng = [bus.latitude, bus.longitude]

      if (existingMarker) {
        existingMarker.setLatLng(newLatLng)
      } else {
        const marker = L.marker(newLatLng, { icon: busIcon })
          .addTo(map)
          .bindPopup(`
            <div>
              <strong>Bus ${bus.route_number || bus.id}</strong><br/>
              Status: ${bus.status || 'Active'}<br/>
              Last updated: ${new Date(bus.updated_at).toLocaleTimeString()}
            </div>
          `)
        currentMarkers.set(bus.id, marker)
      }
    })
  }, [buses, map])

  return null
}

export default function Map() {
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyStops, setNearbyStops] = useState([])
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [selectedStop, setSelectedStop] = useState(null)
  const [routePolyline, setRoutePolyline] = useState(null)
  const [routeWaypoints, setRouteWaypoints] = useState([])
  const mapRef = useRef(null)

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          fetchNearbyStops(location.lat, location.lng)
        },
        (error) => {
          console.error('Error getting location:', error)
          setError('Unable to get your location')
          setLoading(false)
          // Fallback to Mathura coordinates
          const fallbackLocation = { lat: 27.4924, lng: 77.6737 }
          setUserLocation(fallbackLocation)
          fetchNearbyStops(fallbackLocation.lat, fallbackLocation.lng)
        }
      )
    } else {
      setError('Geolocation is not supported by this browser.')
      setLoading(false)
    }
  }, [])

  const fetchNearbyStops = async (lat, lng) => {
    try {
      setLoading(true)
      
      // Since we don't have a waypoints table, let's fetch from routes instead
      // and create mock stops from route waypoints
      const { data: routes, error } = await supabase
        .from('routes')
        .select('*')
        .eq('active', true)
        .limit(20)

      if (error) {
        console.error('Error fetching routes:', error)
        setError('Unable to fetch nearby stops.')
        return
      }

      // Transform routes into stops for display
      const transformedStops = []
      routes?.forEach(route => {
        if (route.waypoints && Array.isArray(route.waypoints)) {
          route.waypoints.forEach((waypoint, index) => {
            if (waypoint.lat && waypoint.lng) {
              transformedStops.push({
                id: `${route.id}-${index}`,
                name: waypoint.name || `${route.name} - Stop ${index + 1}`,
                latitude: waypoint.lat,
                longitude: waypoint.lng,
                route_id: route.id,
                route_name: route.name,
                distance: null // We'll calculate this client-side if needed
              })
            }
          })
        }
      })

      setNearbyStops(transformedStops)
    } catch (err) {
      console.error('Error:', err)
      setError('An error occurred while fetching stops.')
    } finally {
      setLoading(false)
    }
  }

  // Set up real-time subscription for buses
  useEffect(() => {
    const subscription = supabase
      .from('buses')
      .on('*', (payload) => {
        console.log('Bus update received:', payload)
        
        if (payload.eventType === 'INSERT') {
          setBuses(prev => [...prev, payload.new])
        } else if (payload.eventType === 'UPDATE') {
          setBuses(prev => prev.map(bus => 
            bus.id === payload.new.id ? payload.new : bus
          ))
        } else if (payload.eventType === 'DELETE') {
          setBuses(prev => prev.filter(bus => bus.id !== payload.old.id))
        }
      })
      .subscribe()

    fetchCurrentBuses()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleStopClick = (stop) => {
    setSelectedStop(stop)
    setBottomSheetOpen(true)
  }

  const handleCloseBottomSheet = () => {
    setBottomSheetOpen(false)
    setSelectedStop(null)
    setRoutePolyline(null)
    setRouteWaypoints([])
  }

  const handleViewRoute = async (routeId, routeName) => {
    try {
      const { data, error } = await supabase
        .from('waypoints')
        .select('*')
        .eq('route_id', routeId)
        .order('sequence_order')

      if (error) {
        console.error('Error fetching route waypoints:', error)
        alert('Failed to load route information')
        return
      }

      if (!data || data.length === 0) {
        alert('No waypoints found for this route')
        return
      }

      const coordinates = data.map(waypoint => [waypoint.latitude, waypoint.longitude])
      
      setRouteWaypoints(data)
      setRoutePolyline({
        positions: coordinates,
        routeName: routeName,
        color: '#2196F3',
        weight: 4
      })

      if (mapRef.current) {
        const bounds = L.latLngBounds(coordinates)
        mapRef.current.fitBounds(bounds, { padding: [20, 20] })
      }

      setBottomSheetOpen(false)

    } catch (err) {
      console.error('Error viewing route:', err)
      alert('An error occurred while loading the route')
    }
  }

  const clearRoute = () => {
    setRoutePolyline(null)
    setRouteWaypoints([])
  }

  const fetchCurrentBuses = async () => {
    try {
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .eq('active', true)

      if (error) {
        console.error('Error fetching buses:', error)
        return
      }

      // Transform bus data to include coordinates
      const busesWithCoords = (data || []).map(bus => {
        // Extract coordinates from geography point if available
        let latitude = 27.4924 // Default to Mathura
        let longitude = 77.6737
        
        if (bus.current_location) {
          // Parse geography point (assumes POINT format)
          const coords = bus.current_location.coordinates || [longitude, latitude]
          longitude = coords[0]
          latitude = coords[1]
        }

        return {
          ...bus,
          latitude,
          longitude,
          route_number: bus.bus_number,
          updated_at: bus.updated_at || new Date().toISOString()
        }
      })

      setBuses(busesWithCoords)
    } catch (err) {
      console.error('Error fetching buses:', err)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '24px' }}>🗺️</div>
        <div>Loading map...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '24px', color: '#f44336' }}>⚠️</div>
        <div style={{ color: '#f44336' }}>{error}</div>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : [27.4924, 77.6737]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          center={userLocation ? [userLocation.lat, userLocation.lng] : null}
          buses={buses}
          mapRef={mapRef}
          routePolyline={routePolyline}
          routeWaypoints={routeWaypoints}
        />

        {/* Route Polyline */}
        {routePolyline && (
          <Polyline
            positions={routePolyline.positions}
            color={routePolyline.color}
            weight={routePolyline.weight}
            opacity={0.8}
          />
        )}

        {/* Route Waypoints */}
        {routeWaypoints.map((waypoint, index) => (
          <Marker
            key={`route-waypoint-${waypoint.id}`}
            position={[waypoint.latitude, waypoint.longitude]}
            icon={stopIcon}
          >
            <Popup>
              <div>
                <strong>{waypoint.name}</strong><br/>
                Stop #{waypoint.sequence_order}<br/>
                Route: {routePolyline?.routeName}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <div>
                <strong>You are here</strong><br/>
                Lat: {userLocation.lat.toFixed(6)}<br/>
                Lng: {userLocation.lng.toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Bus stops markers */}
        {nearbyStops.map((stop, index) => (
          <Marker 
            key={stop.id || index} 
            position={[stop.latitude, stop.longitude]}
            icon={stopIcon}
            eventHandlers={{
              click: () => handleStopClick(stop)
            }}
          >
            <Popup>
              <div>
                <strong>{stop.name || 'Bus Stop'}</strong><br/>
                {stop.route_name && <span>Route: {stop.route_name}<br/></span>}
                {stop.distance && <span>Distance: {stop.distance.toFixed(2)} km away</span>}
                <br/>
                <button
                  onClick={() => handleStopClick(stop)}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  View Schedules
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 1000
      }}>
        <button
          onClick={() => {
            if (userLocation && navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                const newLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
                setUserLocation(newLocation)
                fetchNearbyStops(newLocation.lat, newLocation.lng)
              })
            }
          }}
          style={{
            padding: '12px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            fontSize: '16px'
          }}
          title="Center on my location"
        >
          📍
        </button>
        
        <button
          onClick={clearRoute}
          style={{
            padding: '12px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: routePolyline ? '#FF9800' : '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            fontSize: '16px',
            opacity: routePolyline ? 1 : 0.5
          }}
          title="Clear route"
          disabled={!routePolyline}
        >
          🗑️
        </button>
      </div>

      {/* Status Bar */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        fontSize: '14px',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>🚏 {nearbyStops.length} stops nearby</span>
          <span>🚌 {buses.length} buses active</span>
        </div>
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={bottomSheetOpen}
        onClose={handleCloseBottomSheet}
        stopData={selectedStop}
        onViewRoute={handleViewRoute}
      />
    </div>
  )
}
