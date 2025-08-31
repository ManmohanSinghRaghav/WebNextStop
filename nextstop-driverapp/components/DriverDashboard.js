import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, fontWeights, radius } from './ui/Theme';
import { 
  Navigation, 
  Users, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Play, 
  Pause,
  Phone
} from 'lucide-react-native';

// Enhanced Progress Bar Component
const Progress = ({ value, style }) => (
  <View style={[styles.progressBase, style]}>
    <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
  </View>
);

export function DriverDashboard({ onNavigateToRoute, onViewPassengers, onEmergencyAlert, driverName = "Driver" }) {
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [routeProgress, setRouteProgress] = useState(65);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate loading states and error handling
  const handleActionWithLoading = async (action, actionName) => {
    try {
      setIsLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      action();
    } catch (err) {
      setError(`Failed to ${actionName}. Please try again.`);
      console.error(`Error in ${actionName}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDutyStatus = () => {
    handleActionWithLoading(() => {
      setIsOnDuty(!isOnDuty);
    }, 'toggle duty status');
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const mockData = {
    routeNumber: "Route 42",
    routeName: "City Center - Airport",
    currentStop: "Mall Junction",
    nextStop: "Tech Park",
    passengerCount: 28,
    capacity: 50,
    estimatedArrival: "3 min",
    totalStops: 15,
    completedStops: 10
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Error Display */}
      {error && (
        <Card style={styles.errorCard}>
          <CardContent style={styles.errorContent}>
            <AlertTriangle size={16} color={colors.destructive} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Text style={styles.dismissText}>Dismiss</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>NextStop</Text>
          <Text style={styles.headerSubtitle}>Welcome back, {driverName}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.timeText}>{currentTime.toLocaleTimeString()}</Text>
          <Badge variant={isOnDuty ? 'default' : 'secondary'}>
            <Text style={[styles.badgeText, !isOnDuty && styles.badgeTextSecondary]}>
              {isOnDuty ? "On Duty" : "Off Duty"}
            </Text>
          </Badge>
        </View>
      </View>

      {/* Duty Toggle */}
      <Card>
        <CardContent style={styles.dutyCardContent}>
          <View style={styles.dutyToggle}>
            <View style={styles.dutyToggleLeft}>
              {isOnDuty ? (
                <Play size={16} color={colors.foreground} />
              ) : (
                <Pause size={16} color={colors.foreground} />
              )}
              <Text style={styles.dutyText}>
                {isOnDuty ? "End Shift" : "Start Shift"}
              </Text>
            </View>
            <Button 
              onPress={toggleDutyStatus}
              variant={isOnDuty ? "destructive" : "default"}
              size="sm"
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, isOnDuty && styles.buttonTextDestructive]}>
                {isLoading ? "..." : (isOnDuty ? "End" : "Start")}
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      {isOnDuty && (
        <>
          {/* Current Route Status */}
          <Card>
            <CardHeader>
              <View style={styles.cardTitleContainer}>
                <Navigation size={20} color={colors.foreground} />
                <CardTitle>{mockData.routeNumber}</CardTitle>
              </View>
            </CardHeader>
            <CardContent style={styles.routeCardContent}>
              <View style={styles.routeInfo}>
                <Text style={styles.label}>Route</Text>
                <Text style={styles.value}>{mockData.routeName}</Text>
              </View>
              
              <View style={styles.stopsContainer}>
                <View style={styles.stopInfo}>
                  <Text style={styles.label}>Current Stop</Text>
                  <View style={styles.stopWithIcon}>
                    <MapPin size={16} color={colors.foreground} />
                    <Text style={styles.stopText}>{mockData.currentStop}</Text>
                  </View>
                </View>
                <View style={styles.stopInfoRight}>
                  <Text style={styles.label}>Next Stop</Text>
                  <Text style={styles.value}>{mockData.nextStop}</Text>
                </View>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.label}>Route Progress</Text>
                  <Text style={styles.label}>
                    {mockData.completedStops}/{mockData.totalStops} stops
                  </Text>
                </View>
                <Progress value={routeProgress} style={styles.routeProgress} />
              </View>

              <Button onPress={onNavigateToRoute} size="lg" style={styles.navigateButton}>
                <View style={styles.buttonContent}>
                  <Navigation size={16} color="#fff" />
                  <Text style={styles.buttonTextWhite}>Navigate Route</Text>
                </View>
              </Button>
            </CardContent>
          </Card>

          {/* Passenger Information */}
          <Card>
            <CardHeader>
              <View style={styles.cardTitleContainer}>
                <Users size={20} color={colors.foreground} />
                <CardTitle>Passenger Status</CardTitle>
              </View>
            </CardHeader>
            <CardContent style={styles.passengerCardContent}>
              <View style={styles.passengerStats}>
                <View>
                  <Text style={styles.passengerCount}>{mockData.passengerCount}</Text>
                  <Text style={styles.label}>Current passengers</Text>
                </View>
                <View style={styles.capacityInfo}>
                  <Text style={styles.label}>Capacity</Text>
                  <Text style={styles.value}>
                    {Math.round((mockData.passengerCount / mockData.capacity) * 100)}%
                  </Text>
                </View>
              </View>
              
              <Progress 
                value={(mockData.passengerCount / mockData.capacity) * 100}
                style={styles.passengerProgress}
              />
              
              <Button onPress={onViewPassengers} variant="outline" style={styles.viewPassengersButton}>
                <Text style={styles.buttonTextOutline}>View Passenger Details</Text>
              </Button>
            </CardContent>
          </Card>

          {/* Next Stop Info */}
          <Card>
            <CardContent style={styles.nextStopContent}>
              <View style={styles.nextStopInfo}>
                <View>
                  <Text style={styles.label}>Arriving at {mockData.nextStop}</Text>
                  <View style={styles.arrivalTime}>
                    <Clock size={16} color={colors.foreground} />
                    <Text style={styles.arrivalText}>{mockData.estimatedArrival}</Text>
                  </View>
                </View>
                <Badge variant="outline">
                  <Text style={styles.badgeTextOutline}>On Time</Text>
                </Badge>
              </View>
            </CardContent>
          </Card>

          {/* Emergency Actions */}
          <View style={styles.emergencyActions}>
            <Button 
              onPress={onEmergencyAlert}
              variant="destructive" 
              size="lg"
              style={styles.emergencyButton}
            >
              <View style={styles.buttonContent}>
                <AlertTriangle size={20} color="#fff" />
                <Text style={styles.buttonTextWhite}>Emergency</Text>
              </View>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              style={styles.supportButton}
              onPress={() => {}}
            >
              <View style={styles.buttonContent}>
                <Phone size={20} color={colors.foreground} />
                <Text style={styles.buttonTextOutline}>Support</Text>
              </View>
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
}

// --- Enhanced Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  timeText: {
    fontSize: 14,
    color: colors.foreground,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  badgeTextSecondary: {
    color: colors.mutedForeground,
  },
  badgeTextOutline: {
    fontSize: 12,
    color: colors.foreground,
  },
  dutyCardContent: {
    paddingTop: 24,
  },
  dutyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dutyToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dutyText: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonTextDestructive: {
    color: '#fff',
  },
  buttonTextWhite: {
    color: '#fff',
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  buttonTextOutline: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeCardContent: {
    gap: 16,
  },
  routeInfo: {
    gap: 4,
  },
  stopsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stopInfo: {
    flex: 1,
  },
  stopInfoRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  stopWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stopText: {
    fontSize: 16,
    color: colors.foreground,
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  routeProgress: {
    height: 8,
  },
  navigateButton: {
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passengerCardContent: {
    gap: 16,
  },
  passengerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerCount: {
    fontSize: 32,
    fontWeight: fontWeights.bold,
    color: colors.foreground,
  },
  capacityInfo: {
    alignItems: 'flex-end',
  },
  passengerProgress: {
    height: 8,
  },
  viewPassengersButton: {
    marginTop: 8,
  },
  nextStopContent: {
    paddingTop: 24,
  },
  nextStopInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrivalTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  arrivalText: {
    fontSize: 16,
    color: colors.foreground,
  },
  emergencyActions: {
    flexDirection: 'row',
    gap: 16,
  },
  emergencyButton: {
    flex: 1,
    height: 64,
  },
  supportButton: {
    flex: 1,
    height: 64,
  },
  label: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
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
  errorCard: {
    marginBottom: 16,
    borderColor: colors.destructive,
    borderWidth: 1,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  errorText: {
    flex: 1,
    color: colors.destructive,
    fontSize: 14,
  },
  dismissText: {
    color: colors.destructive,
    fontSize: 12,
    fontWeight: fontWeights.medium,
  },
});