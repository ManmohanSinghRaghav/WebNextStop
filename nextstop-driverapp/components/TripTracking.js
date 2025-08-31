import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapboxView from './MapboxView';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, fontWeights, radius } from './ui/Theme';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  User,
  Phone,
  MessageCircle,
  MoreVertical,
  CheckCircle,
  ArrowRight,
  Car
} from 'lucide-react-native';

// NOTE: You must have an image at this path in your project's assets folder
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY29nbmktY29yZSIsImEiOiJjbWV4NzcyNzQwc2JtMmpxeDJiZ29kemtoIn0.XR7A3g4UN4OdDW0tLaljYQ';

// Enhanced Progress Bar Component
const Progress = ({ value, style }) => (
  <View style={[styles.progressBase, style]}>
    <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
  </View>
);

export function TripTracking({ driverName }) {
  const [currentTrip, setCurrentTrip] = useState({
    id: 'NS-2025-08291034',
    status: 'picking_up',
    passengerName: 'Mohammad Rahman',
    passengerPhone: '+8801712345678',
    pickupLocation: 'Nagua - Atimkhana - Zilla Swaroni Road',
    dropLocation: 'Kishoreganj - Mymensingh Road',
    distance: '2.50 Km',
    estimatedTime: '8 mins',
    fare: '$1.87',
    pickupTime: '10:35 AM'
  });

  const [tripProgress, setTripProgress] = useState(25);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleStartTrip = async () => {
    if (!currentTrip) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentTrip({
        ...currentTrip,
        status: 'in_progress'
      });
      setTripProgress(50);
    } catch (err) {
      setError('Failed to start trip. Please try again.');
      console.error('Error starting trip:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    if (!currentTrip) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentTrip({
        ...currentTrip,
        status: 'completed'
      });
      setTripProgress(100);
      
      // Auto reset after showing completion
      setTimeout(() => {
        setCurrentTrip(null);
        setTripProgress(0);
      }, 3000);
    } catch (err) {
      setError('Failed to complete trip. Please try again.');
      console.error('Error completing trip:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'assigned': return 'Trip Assigned';
      case 'picking_up': return 'Picking up Passenger';
      case 'in_progress': return 'Trip in Progress';
      case 'completed': return 'Trip Completed';
      default: return 'Available';
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'assigned': return { backgroundColor: colors.blue500 };
      case 'picking_up': return { backgroundColor: colors.orange500 };
      case 'in_progress': return { backgroundColor: colors.green500 };
      case 'completed': return { backgroundColor: colors.gray500 };
      default: return { backgroundColor: colors.muted };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>NextStop Live</Text>
            <Text style={styles.headerSubtitle}>Welcome back, {driverName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.timeText}>{currentTime.toLocaleTimeString()}</Text>
            <Badge style={currentTrip ? styles.activeBadge : styles.availableBadge}>
              <Text style={styles.badgeText}>
                {currentTrip ? 'Active' : 'Available'}
              </Text>
            </Badge>
          </View>
        </View>

        {/* Map View (Mapbox) */}
        <Card style={styles.mapCard}>
          <View style={{ height: 320 }}>
            {region ? (
              <MapboxView
                accessToken={MAPBOX_TOKEN}
                center={region}
                markers={[{ id: 'me', title: 'You', latitude: region.latitude, longitude: region.longitude }]}
                zoom={14}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.mapOverlayText}>Loading map...</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Current Trip Status */}
        {currentTrip ? (
          <Card>
            <CardHeader style={styles.tripCardHeader}>
              <View style={styles.tripHeaderTop}>
                <View style={styles.tripTitleContainer}>
                  <User size={20} color={colors.foreground} />
                  <CardTitle>{getStatusText(currentTrip.status)}</CardTitle>
                </View>
                <Badge style={[styles.tripIdBadge, getStatusBadgeStyle(currentTrip.status)]}>
                  <Text style={styles.tripIdText}>Trip #{currentTrip.id.slice(-6)}</Text>
                </Badge>
              </View>
            </CardHeader>
            <CardContent style={styles.tripCardContent}>
              {/* Passenger Info */}
              <View style={styles.passengerInfo}>
                <View style={styles.passengerDetails}>
                  <Text style={styles.passengerName}>{currentTrip.passengerName}</Text>
                  <Text style={styles.passengerPhone}>{currentTrip.passengerPhone}</Text>
                </View>
                <View style={styles.communicationButtons}>
                  <Button size="sm" variant="outline" style={styles.commButton}>
                    <Phone size={12} color={colors.foreground} />
                  </Button>
                  <Button size="sm" variant="outline" style={styles.commButton}>
                    <MessageCircle size={12} color={colors.foreground} />
                  </Button>
                </View>
              </View>

              {/* Route Details */}
              <View style={styles.routeSection}>
                <View style={styles.routeIndicator}>
                  <View style={styles.routeTimeline}>
                    <View style={styles.pickupDot} />
                    <View style={styles.routeLineConnector} />
                    <MapPin size={12} color={colors.red500} />
                  </View>
                  <View style={styles.routeLocations}>
                    <View style={styles.locationItem}>
                      <Text style={styles.locationLabel}>From</Text>
                      <Text style={styles.locationText}>{currentTrip.pickupLocation}</Text>
                    </View>
                    <View style={styles.locationItem}>
                      <Text style={styles.locationLabel}>To</Text>
                      <Text style={styles.locationText}>{currentTrip.dropLocation}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Trip Details */}
              <View style={styles.tripDetailsGrid}>
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Distance</Text>
                  <Text style={styles.tripDetailValue}>{currentTrip.distance}</Text>
                </View>
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Time</Text>
                  <Text style={styles.tripDetailValue}>{currentTrip.estimatedTime}</Text>
                </View>
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Fare</Text>
                  <Text style={styles.tripDetailValue}>{currentTrip.fare}</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Trip Progress</Text>
                  <Text style={styles.progressValue}>{tripProgress}%</Text>
                </View>
                <Progress value={tripProgress} style={styles.tripProgress} />
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                {currentTrip.status === 'picking_up' && (
                  <Button onPress={handleStartTrip} size="lg" style={styles.startTripButton}>
                    <View style={styles.buttonContent}>
                      <Car size={16} color="#fff" />
                      <Text style={styles.buttonTextWhite}>START TRIP</Text>
                    </View>
                  </Button>
                )}
                
                {currentTrip.status === 'in_progress' && (
                  <Button onPress={handleCompleteTrip} size="lg" style={styles.completeTripButton}>
                    <View style={styles.buttonContent}>
                      <CheckCircle size={16} color="#fff" />
                      <Text style={styles.buttonTextWhite}>COMPLETE TRIP</Text>
                    </View>
                  </Button>
                )}

                {currentTrip.status === 'completed' && (
                  <View style={styles.completionContainer}>
                    <CheckCircle size={32} color={colors.green500} style={styles.completionIcon} />
                    <Text style={styles.completionTitle}>Trip completed successfully!</Text>
                    <Text style={styles.completionEarnings}>Earnings: {currentTrip.fare}</Text>
                  </View>
                )}
              </View>
            </CardContent>
          </Card>
        ) : (
          /* No Active Trip */
          <Card>
            <CardContent style={styles.noTripContent}>
              <View style={styles.noTripIconContainer}>
                <Car size={32} color={colors.mutedForeground} />
              </View>
              <View style={styles.noTripTextContainer}>
                <Text style={styles.noTripTitle}>No Active Trip</Text>
                <Text style={styles.noTripSubtitle}>
                  You're available for new trip requests
                </Text>
              </View>
              <Button variant="outline" style={styles.goOnlineButton}>
                <View style={styles.buttonContent}>
                  <Navigation size={16} color={colors.foreground} />
                  <Text style={styles.goOnlineText}>Go Online</Text>
                </View>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <View style={styles.quickStatsGrid}>
          <Card>
            <CardContent style={styles.statCardContent}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Today's Trips</Text>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={styles.statCardContent}>
              <Text style={styles.statValue}>$45.60</Text>
              <Text style={styles.statLabel}>Today's Earnings</Text>
            </CardContent>
          </Card>
          <Card>
            <CardContent style={styles.statCardContent}>
              <Text style={styles.statValue}>4.8★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </CardContent>
          </Card>
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
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: fontWeights.bold, 
    color: colors.primary 
  },
  headerSubtitle: { 
    color: colors.mutedForeground, 
    fontSize: 14 
  },
  timeText: {
    fontSize: 14,
    color: colors.foreground,
    marginBottom: 4,
  },
  activeBadge: {
    backgroundColor: colors.primary,
  },
  availableBadge: {
    backgroundColor: colors.secondary,
  },
  badgeText: {
    fontSize: 12,
    color: colors.primaryForeground,
  },
  mapCard: {
    overflow: 'hidden',
  },
  mapImage: { 
    height: 320, 
    width: '100%' 
  },
  mapOverlayLeft: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
  },
  mapOverlayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: colors.green500,
    // Add animation if possible
  },
  statusDotInactive: {
    backgroundColor: colors.gray400,
  },
  mapOverlayText: {
    fontSize: 14,
    color: colors.foreground,
  },
  mapOverlayRight: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
  },
  routeInfoContainer: {
    gap: 4,
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeInfoText: {
    fontSize: 12,
    color: colors.foreground,
  },
  tripCardHeader: {
    paddingBottom: 12,
  },
  tripHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripIdBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tripIdText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  tripCardContent: {
    gap: 16,
  },
  passengerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.muted,
    padding: 12,
    borderRadius: 8,
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
  },
  passengerPhone: {
    fontSize: 10,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  communicationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  commButton: {
    minWidth: 32,
    height: 32,
  },
  routeSection: {
    gap: 12,
  },
  routeIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeTimeline: {
    alignItems: 'center',
    marginTop: 4,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green500,
  },
  routeLineConnector: {
    width: 2,
    height: 32,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  routeLocations: {
    flex: 1,
    gap: 16,
  },
  locationItem: {
    gap: 4,
  },
  locationLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  locationText: {
    fontSize: 14,
    color: colors.foreground,
  },
  tripDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tripDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  tripDetailLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  tripDetailValue: {
    fontSize: 14,
    color: colors.foreground,
    marginTop: 2,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 14,
    color: colors.foreground,
  },
  progressValue: {
    fontSize: 14,
    color: colors.foreground,
  },
  tripProgress: {
    height: 8,
  },
  actionButtonsContainer: {
    gap: 12,
  },
  startTripButton: {
    backgroundColor: colors.primary,
    height: 48,
  },
  completeTripButton: {
    backgroundColor: colors.green600,
    height: 48,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonTextWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completionContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.green50,
    borderWidth: 1,
    borderColor: colors.green200,
    borderRadius: 8,
    gap: 8,
  },
  completionIcon: {
    marginBottom: 8,
  },
  completionTitle: {
    fontSize: 16,
    color: colors.green700,
    fontWeight: '500',
  },
  completionEarnings: {
    fontSize: 14,
    color: colors.green600,
  },
  noTripContent: {
    paddingTop: 24,
    alignItems: 'center',
    gap: 16,
  },
  noTripIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: colors.muted,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noTripTextContainer: {
    alignItems: 'center',
    gap: 4,
  },
  noTripTitle: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    color: colors.foreground,
  },
  noTripSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
  },
  goOnlineButton: {
    width: '100%',
    height: 48,
  },
  goOnlineText: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: '500',
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCardContent: {
    paddingTop: 24,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.foreground,
  },
  statLabel: {
    fontSize: 10,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  progressBase: {
    height: 8,
    width: '100%',
    backgroundColor: colors.muted,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
  },
});