import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Animated, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapboxView from './MapboxView';
import { subscribeDriverLocation, subscribeActiveTripsForDriver } from '../utils/firebase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, fontWeights, radius } from './ui/Theme';
import { 
  ArrowLeft, 
  MapPin, 
  Navigation, 
  Clock, 
  Users,
  CheckCircle,
  Circle
} from 'lucide-react-native';

const StopItem = ({ stop, isLast }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (stop.isCurrent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [stop.isCurrent, pulseAnim]);

  const animatedStyle = { transform: [{ scale: pulseAnim }] };

  return (
    <View style={styles.stopRow}>
      <View style={styles.timeline}>
        {stop.isCompleted ? (
          <CheckCircle size={20} color={colors.green500} />
        ) : stop.isCurrent ? (
          <Animated.View style={[styles.currentDot, animatedStyle]} />
        ) : (
          <Circle size={20} color={colors.mutedForeground} />
        )}
        {!isLast && (
          <View style={[
            styles.timelineLine, 
            stop.isCompleted && styles.timelineLineCompleted
          ]} />
        )}
      </View>
      <View style={[styles.stopDetails, stop.isCurrent && styles.currentStopDetails]}>
        <View style={styles.stopHeader}>
          <View>
            <Text style={[styles.stopName, stop.isCurrent && styles.currentStopName]}>
              {stop.name}
            </Text>
            <View style={styles.timeContainer}>
              <Clock size={12} color={colors.mutedForeground} />
              <Text style={styles.stopTime}>{stop.estimatedTime}</Text>
            </View>
          </View>
          {stop.isCurrent && (
            <Badge style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>Current</Text>
            </Badge>
          )}
        </View>

        {/* Passenger info */}
        <View style={styles.passengerInfo}>
          {stop.isCompleted && (
            <View style={styles.passengerStat}>
              <Users size={12} color={colors.mutedForeground} />
              <Text style={styles.passengerText}>{stop.passengerCount} boarded</Text>
            </View>
          )}
          {!stop.isCompleted && stop.waitingPassengers > 0 && (
            <View style={styles.passengerStat}>
              <Users size={12} color={colors.mutedForeground} />
              <Text style={styles.passengerText}>{stop.waitingPassengers} waiting</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export function RouteMap({ driverId, onBack }) {
  const [stops, setStops] = useState([
    { id: '1', name: 'City Center Terminal', estimatedTime: '08:00', isCompleted: true, isCurrent: false, passengerCount: 15, waitingPassengers: 0 },
    { id: '2', name: 'Shopping District', estimatedTime: '08:15', isCompleted: true, isCurrent: false, passengerCount: 8, waitingPassengers: 0 },
    { id: '3', name: 'University Campus', estimatedTime: '08:30', isCompleted: true, isCurrent: false, passengerCount: 12, waitingPassengers: 0 },
    { id: '4', name: 'Business Park', estimatedTime: '08:45', isCompleted: true, isCurrent: false, passengerCount: 6, waitingPassengers: 0 },
    { id: '5', name: 'Mall Junction', estimatedTime: '09:00', isCompleted: false, isCurrent: true, passengerCount: 0, waitingPassengers: 5 },
    { id: '6', name: 'Tech Park', estimatedTime: '09:15', isCompleted: false, isCurrent: false, passengerCount: 0, waitingPassengers: 8 },
    { id: '7', name: 'Residential Area', estimatedTime: '09:30', isCompleted: false, isCurrent: false, passengerCount: 0, waitingPassengers: 3 },
    { id: '8', name: 'Medical Center', estimatedTime: '09:45', isCompleted: false, isCurrent: false, passengerCount: 0, waitingPassengers: 2 },
    { id: '9', name: 'Airport Terminal', estimatedTime: '10:00', isCompleted: false, isCurrent: false, passengerCount: 0, waitingPassengers: 12 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const MAPBOX_TOKEN = 'pk.eyJ1IjoiY29nbmktY29yZSIsImEiOiJjbWV4NzcyNzQwc2JtMmpxeDJiZ29kemtoIn0.XR7A3g4UN4OdDW0tLaljYQ';

  const handleCompleteStop = async (stopId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStops(prevStops => {
        const updatedStops = prevStops.map(stop => {
          if (stop.id === stopId) {
            return { ...stop, isCompleted: true, isCurrent: false };
          }
          return stop;
        });
        
        // Set next stop as current
        const currentStopIndex = updatedStops.findIndex(stop => stop.id === stopId);
        if (currentStopIndex < updatedStops.length - 1) {
          updatedStops[currentStopIndex + 1].isCurrent = true;
        }
        
        return updatedStops;
      });
    } catch (err) {
      setError('Failed to complete stop. Please try again.');
      console.error('Error completing stop:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (e) {
        setError('Unable to get current location');
      }
    })();
  }, []);

  // Subscribe to RTDB for live driver location and active trip
  useEffect(() => {
    if (!driverId) return;
    const unsubLoc = subscribeDriverLocation(driverId, (loc) => {
      setDriverLocation(loc);
      if (!region && loc?.currentLatitude && loc?.currentLongitude) {
        setRegion({
          latitude: loc.currentLatitude,
          longitude: loc.currentLongitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    });
    const unsubTrips = subscribeActiveTripsForDriver(driverId, (trips) => {
      setActiveTrip(trips && trips.length ? trips[0] : null);
    });
    return () => {
      if (unsubLoc) unsubLoc();
      if (unsubTrips) unsubTrips();
    };
  }, [driverId, region]);

  const currentStop = stops.find(stop => stop.isCurrent);

  // Build markers and route line from RTDB data
  const mapMarkers = [];
  if (driverLocation?.currentLatitude && driverLocation?.currentLongitude) {
    mapMarkers.push({
      id: 'driver',
      title: 'Driver',
      latitude: driverLocation.currentLatitude,
      longitude: driverLocation.currentLongitude,
    });
  }
  const pickup = activeTrip && activeTrip.pickupLatitude && activeTrip.pickupLongitude ? {
    latitude: activeTrip.pickupLatitude,
    longitude: activeTrip.pickupLongitude,
  } : null;
  const destination = activeTrip && activeTrip.destinationLatitude && activeTrip.destinationLongitude ? {
    latitude: activeTrip.destinationLatitude,
    longitude: activeTrip.destinationLongitude,
  } : null;
  if (pickup) mapMarkers.push({ id: 'pickup', title: 'Pickup', ...pickup });
  if (destination) mapMarkers.push({ id: 'destination', title: 'Destination', ...destination });
  const routeLine = pickup && destination ? [pickup, destination] : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={16} color={colors.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Route Navigation</Text>
            <Text style={styles.headerSubtitle}>Route 42 - City Center to Airport</Text>
          </View>
        </View>

        {/* Live Map (Mapbox) */}
        <Card>
          <CardContent style={{ padding: 0 }}>
            <View style={styles.mapContainer}>
              {region ? (
                <MapboxView
                  accessToken={MAPBOX_TOKEN}
                  center={{ latitude: region.latitude, longitude: region.longitude }}
                  markers={mapMarkers}
                  lineCoordinates={routeLine}
                  zoom={12}
                  style={styles.map}
                />
              ) : (
                <View style={styles.mapLoading}><Text style={styles.mapLoadingText}>Loading map...</Text></View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardContent style={styles.statusContent}>
            <View style={styles.statusInfo}>
              <View style={styles.statusLeft}>
                <Navigation size={20} color={colors.foreground} />
                <View>
                  <Text style={styles.statusTitle}>
                    Currently at {currentStop?.name || 'Unknown'}
                  </Text>
                  <Text style={styles.statusSubtitle}>
                    {currentStop?.waitingPassengers || 0} passengers waiting
                  </Text>
                </View>
              </View>
              <Badge style={styles.onTimeBadge}>
                <Text style={styles.onTimeBadgeText}>On Time</Text>
              </Badge>
            </View>
          </CardContent>
        </Card>

        {/* Route Stops */}
        <Card>
          <CardHeader>
            <CardTitle>Route Progress</CardTitle>
          </CardHeader>
          <CardContent style={styles.routeContent}>
            {stops.map((stop, index) => (
              <StopItem 
                key={stop.id} 
                stop={stop} 
                isLast={index === stops.length - 1} 
              />
            ))}
          </CardContent>
        </Card>

        {/* Navigation Actions */}
        <View style={styles.navigationActions}>
          <Button variant="outline" size="lg" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <MapPin size={16} color={colors.foreground} />
              <Text style={styles.actionButtonText}>GPS Navigation</Text>
            </View>
          </Button>
          <Button size="lg" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Clock size={16} color={colors.primaryForeground} />
              <Text style={styles.actionButtonTextPrimary}>Report Delay</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  container: { 
    padding: 16, 
    gap: 16 
  },
  mapContainer: {
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapLoading: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.muted,
  },
  mapLoadingText: {
    color: colors.mutedForeground,
  },
  header: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: fontWeights.bold,
    color: colors.foreground,
  },
  headerSubtitle: { 
    color: colors.mutedForeground, 
    fontSize: 14 
  },
  statusContent: {
    paddingTop: 24,
  },
  statusInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  onTimeBadge: {
    backgroundColor: colors.primary,
  },
  onTimeBadgeText: {
    fontSize: 12,
    color: colors.primaryForeground,
  },
  routeContent: {
    gap: 16,
  },
  stopRow: { 
    flexDirection: 'row', 
    gap: 12 
  },
  timeline: { 
    alignItems: 'center' 
  },
  currentDot: { 
    height: 20, 
    width: 20, 
    borderRadius: 10, 
    backgroundColor: colors.primary 
  },
  timelineLine: { 
    width: 2, 
    flex: 1, 
    backgroundColor: colors.muted, 
    marginTop: 4 
  },
  timelineLineCompleted: { 
    backgroundColor: colors.green500 
  },
  stopDetails: { 
    flex: 1, 
    paddingBottom: 16 
  },
  currentStopDetails: { 
    backgroundColor: colors.accent, 
    padding: 12, 
    borderRadius: 8, 
    marginLeft: -6 
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stopName: { 
    fontWeight: fontWeights.medium,
    fontSize: 16,
    color: colors.foreground,
  },
  currentStopName: { 
    color: colors.primary, 
    fontWeight: fontWeights.bold,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  stopTime: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  currentBadge: {
    backgroundColor: colors.primary,
  },
  currentBadgeText: {
    fontSize: 10,
    color: colors.primaryForeground,
  },
  passengerInfo: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  passengerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  passengerText: { 
    color: colors.mutedForeground, 
    fontSize: 12 
  },
  navigationActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    height: 56,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  actionButtonTextPrimary: {
    fontSize: 14,
    color: colors.primaryForeground,
    fontWeight: fontWeights.medium,
  },
});