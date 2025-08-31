import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // npx expo install expo-linear-gradient
import * as Location from 'expo-location';
import MapboxView from './MapboxView';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, radius, fontWeights } from './ui/Theme';
import { 
  MapPin, 
  Navigation, 
  Car,
  Clock,
  User
} from 'lucide-react-native';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY29nbmktY29yZSIsImEiOiJjbWV4NzcyNzQwc2JtMmpxeDJiZ29kemtoIn0.XR7A3g4UN4OdDW0tLaljYQ';

export function SidebarMap({ onStartTrip, isCompact = false }) {
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch (_) {}
    })();
  }, []);
  const tripData = {
    status: 'picking_up',
    from: 'Nagua - Atimkhana - Zilla Swaroni Road',
    to: 'Kishoreganj - Mymensingh Road',
    distance: '2.50 Km',
    fare: '$1.87',
    passengerName: 'Mohammad Rahman'
  };

  if (isCompact) {
    return (
      <View style={styles.compactWrapper}>
        <View style={styles.compactContainer}>
          {region ? (
            <MapboxView
              accessToken={MAPBOX_TOKEN}
              center={region}
              markers={[{ id: 'me', title: 'You', latitude: region.latitude, longitude: region.longitude }]}
              zoom={13}
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
            />
          ) : null}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.gradient}
          >
            <View style={styles.compactOverlay}>
              <Text style={styles.compactText}>Picking up passenger</Text>
              <Text style={[styles.compactText, { color: colors.green300 }]}>
                {tripData.distance} • {tripData.fare}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        {region ? (
          <MapboxView
            accessToken={MAPBOX_TOKEN}
            center={region}
            markers={[{ id: 'me', title: 'You', latitude: region.latitude, longitude: region.longitude }]}
            zoom={13}
            style={styles.mapImage}
          />
        ) : null}
        {/* Status indicator */}
        <View style={styles.statusIndicator}>
          <Badge style={styles.activeTripBadge}>
            <View style={styles.badgeContent}>
              <Car size={12} color="#fff" />
              <Text style={styles.activeTripText}>Active Trip</Text>
            </View>
          </Badge>
        </View>

        {/* Trip info overlay */}
        <View style={styles.tripInfoOverlay}>
          <View style={styles.tripInfoContent}>
            <Navigation size={12} color={colors.foreground} />
            <Text style={styles.tripInfoText}>{tripData.distance}</Text>
          </View>
        </View>
      </View>

      {/* Trip Details Card */}
      <Card style={styles.tripDetailsCard}>
        <CardContent style={styles.tripDetailsContent}>
          {/* Header */}
          <View style={styles.tripHeader}>
            <View style={styles.tripHeaderLeft}>
              <User size={16} color={colors.green600} />
              <Text style={styles.tripHeaderText}>Picking up Passenger</Text>
            </View>
            <Badge style={styles.fareBadge}>
              <Text style={styles.fareText}>{tripData.fare}</Text>
            </Badge>
          </View>

          {/* Route */}
          <View style={styles.routeSection}>
            <View style={styles.routeIndicator}>
              <View style={styles.routeLine}>
                <View style={styles.fromDot} />
                <View style={styles.routeConnector} />
                <MapPin size={12} color={colors.red500} />
              </View>
              <View style={styles.routeDetails}>
                <View style={styles.routePoint}>
                  <Text style={styles.routeLabel}>From:</Text>
                  <Text style={styles.routeLocation}>{tripData.from}</Text>
                </View>
                <View style={styles.routePoint}>
                  <Text style={styles.routeLabel}>To:</Text>
                  <Text style={styles.routeLocation}>{tripData.to}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Trip stats */}
          <View style={styles.tripStats}>
            <View style={styles.tripStatLeft}>
              <Clock size={12} color={colors.green700} />
              <Text style={styles.tripStatText}>Distance: {tripData.distance}</Text>
            </View>
            <Text style={styles.passengerText}>Passenger: {tripData.passengerName}</Text>
          </View>

          {/* Action button */}
          <Button onPress={onStartTrip} style={styles.startTripButton}>
            <Text style={styles.startTripButtonText}>START TRIP</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  mapImage: { height: '100%', width: '100%' },
  compactContainer: { 
    height: 128, 
    justifyContent: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative'
  },
  gradient: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    height: '70%', 
    borderRadius: 8 
  },
  compactOverlay: { 
    position: 'absolute', 
    bottom: 8, 
    left: 8, 
    right: 8 
  },
  compactText: { 
    color: '#fff', 
    fontSize: 10 
  },
  fullContainer: {
    gap: 8,
  },
  mapContainer: {
    height: 192,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
    statusIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  activeTripBadge: {
    backgroundColor: colors.green500,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeTripText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  tripInfoOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 6,
    padding: 8,
  },
  tripInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripInfoText: {
    fontSize: 10,
    color: colors.foreground,
  },
  tripDetailsCard: {
    borderColor: colors.green200,
    backgroundColor: colors.green50,
  },
  tripDetailsContent: {
    padding: 12,
    gap: 12,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripHeaderText: {
    fontSize: 14,
    color: colors.green800,
    fontWeight: fontWeights.medium,
  },
  fareBadge: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fareText: {
    fontSize: 10,
    color: colors.foreground,
  },
  routeSection: {
    gap: 8,
  },
  routeIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  routeLine: {
    alignItems: 'center',
    marginTop: 4,
  },
  fromDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.green500,
  },
  routeConnector: {
    width: 2,
    height: 16,
    backgroundColor: colors.green300,
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
    gap: 8,
  },
  routePoint: {
    gap: 2,
  },
  routeLabel: {
    fontSize: 10,
    color: colors.green600,
    fontWeight: fontWeights.medium,
  },
  routeLocation: {
    fontSize: 12,
    color: colors.green800,
    lineHeight: 16,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.green200,
  },
  tripStatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripStatText: {
    fontSize: 10,
    color: colors.green700,
  },
  passengerText: {
    fontSize: 10,
    color: colors.green700,
  },
  startTripButton: {
    backgroundColor: colors.green600,
    height: 36,
  },
  startTripButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: fontWeights.bold,
  },
  compactWrapper: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
});