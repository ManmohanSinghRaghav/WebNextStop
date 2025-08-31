import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, fontWeights, radius } from './ui/Theme';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Star,
  TrendingUp,
  Award,
  CheckCircle
} from 'lucide-react-native';

export function CompletedTrips({ driverName }) {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const completedTripsData = {
    today: {
      trips: [
        {
          id: 'NS-2025-001',
          route: 'Route 42',
          routeName: 'City Center - Airport',
          startTime: '06:00',
          endTime: '14:00',
          duration: '8h 0m',
          passengers: 127,
          earnings: 156.75,
          rating: 4.9,
          distance: '45.2 km'
        },
        {
          id: 'NS-2025-002',
          route: 'Route 42',
          routeName: 'Airport - City Center',
          startTime: '14:30',
          endTime: '22:30',
          duration: '8h 0m',
          passengers: 89,
          earnings: 112.50,
          rating: 4.8,
          distance: '45.2 km'
        }
      ],
      summary: {
        totalTrips: 2,
        totalEarnings: 269.25,
        totalPassengers: 216,
        averageRating: 4.85,
        totalDistance: 90.4
      }
    },
    week: {
      summary: {
        totalTrips: 14,
        totalEarnings: 1847.50,
        totalPassengers: 1503,
        averageRating: 4.8,
        totalDistance: 632.8
      }
    },
    month: {
      summary: {
        totalTrips: 62,
        totalEarnings: 8125.75,
        totalPassengers: 6847,
        averageRating: 4.8,
        totalDistance: 2801.6
      }
    }
  };

  const periods = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  const currentData = completedTripsData[selectedPeriod];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Completed Trips</Text>
            <Text style={styles.headerSubtitle}>Track your performance, {driverName}</Text>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              onPress={() => setSelectedPeriod(period.id)}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive
              ]}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <CardContent style={styles.summaryContent}>
              <View style={styles.summaryIconContainer}>
                <CheckCircle size={24} color={colors.green600} />
              </View>
              <Text style={styles.summaryValue}>{currentData.summary.totalTrips}</Text>
              <Text style={styles.summaryLabel}>Trips</Text>
            </CardContent>
          </Card>

          <Card style={styles.summaryCard}>
            <CardContent style={styles.summaryContent}>
              <View style={styles.summaryIconContainer}>
                <DollarSign size={24} color={colors.green600} />
              </View>
              <Text style={styles.summaryValue}>₹{currentData.summary.totalEarnings}</Text>
              <Text style={styles.summaryLabel}>Earnings</Text>
            </CardContent>
          </Card>

          <Card style={styles.summaryCard}>
            <CardContent style={styles.summaryContent}>
              <View style={styles.summaryIconContainer}>
                <Users size={24} color={colors.blue600} />
              </View>
              <Text style={styles.summaryValue}>{currentData.summary.totalPassengers}</Text>
              <Text style={styles.summaryLabel}>Passengers</Text>
            </CardContent>
          </Card>

          <Card style={styles.summaryCard}>
            <CardContent style={styles.summaryContent}>
              <View style={styles.summaryIconContainer}>
                <Star size={24} color={colors.yellow600} />
              </View>
              <Text style={styles.summaryValue}>{currentData.summary.averageRating}</Text>
              <Text style={styles.summaryLabel}>Rating</Text>
            </CardContent>
          </Card>
        </View>

        {/* Trip Details (only for today) */}
        {selectedPeriod === 'today' && currentData.trips && (
          <Card>
            <CardHeader>
              <View style={styles.cardTitleContainer}>
                <Calendar size={20} color={colors.foreground} />
                <CardTitle>Trip Details</CardTitle>
              </View>
            </CardHeader>
            <CardContent style={styles.tripsContent}>
              {currentData.trips.map((trip, index) => (
                <View key={trip.id} style={[styles.tripCard, index === currentData.trips.length - 1 && styles.lastTripCard]}>
                  <View style={styles.tripHeader}>
                    <View style={styles.tripInfo}>
                      <Text style={styles.tripRoute}>{trip.route}</Text>
                      <Text style={styles.tripRouteName}>{trip.routeName}</Text>
                    </View>
                    <Badge variant="secondary">
                      <Text style={styles.badgeText}>Completed</Text>
                    </Badge>
                  </View>

                  <View style={styles.tripStats}>
                    <View style={styles.tripStatsGrid}>
                      <View style={styles.tripStat}>
                        <Clock size={14} color={colors.mutedForeground} />
                        <Text style={styles.tripStatText}>{trip.duration}</Text>
                      </View>
                      <View style={styles.tripStat}>
                        <MapPin size={14} color={colors.mutedForeground} />
                        <Text style={styles.tripStatText}>{trip.distance}</Text>
                      </View>
                      <View style={styles.tripStat}>
                        <Users size={14} color={colors.mutedForeground} />
                        <Text style={styles.tripStatText}>{trip.passengers}</Text>
                      </View>
                    </View>

                    <View style={styles.tripEarnings}>
                      <View style={styles.ratingContainer}>
                        <Star size={14} color={colors.yellow500} />
                        <Text style={styles.ratingText}>{trip.rating}</Text>
                      </View>
                      <Text style={styles.earningsText}>₹{trip.earnings}</Text>
                    </View>
                  </View>

                  <View style={styles.tripTime}>
                    <Text style={styles.tripTimeText}>{trip.startTime} - {trip.endTime}</Text>
                  </View>
                </View>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <View style={styles.cardTitleContainer}>
              <TrendingUp size={20} color={colors.foreground} />
              <CardTitle>Performance Insights</CardTitle>
            </View>
          </CardHeader>
          <CardContent style={styles.insightsContent}>
            <View style={styles.insightItem}>
              <Award size={16} color={colors.green600} />
              <View style={styles.insightText}>
                <Text style={styles.insightTitle}>Excellent Rating!</Text>
                <Text style={styles.insightDesc}>Your {selectedPeriod} average is {currentData.summary.averageRating}/5.0</Text>
              </View>
            </View>

            <View style={styles.insightItem}>
              <TrendingUp size={16} color={colors.blue600} />
              <View style={styles.insightText}>
                <Text style={styles.insightTitle}>Distance Covered</Text>
                <Text style={styles.insightDesc}>{currentData.summary.totalDistance} km total distance</Text>
              </View>
            </View>

            <View style={styles.insightItem}>
              <Users size={16} color={colors.primary} />
              <View style={styles.insightText}>
                <Text style={styles.insightTitle}>Passenger Service</Text>
                <Text style={styles.insightDesc}>Served {currentData.summary.totalPassengers} passengers</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button variant="outline" size="lg" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Calendar size={16} color={colors.foreground} />
              <Text style={styles.actionButtonText}>Download Report</Text>
            </View>
          </Button>
          <Button size="lg" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <TrendingUp size={16} color={colors.primaryForeground} />
              <Text style={styles.actionButtonTextPrimary}>View Analytics</Text>
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
  header: { 
    marginBottom: 8 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: fontWeights.bold,
    color: colors.foreground,
  },
  headerSubtitle: { 
    fontSize: 14,
    color: colors.mutedForeground 
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.background,
  },
  periodButtonText: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontWeight: fontWeights.medium,
  },
  periodButtonTextActive: {
    color: colors.foreground,
    fontWeight: fontWeights.semibold,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
  },
  summaryContent: {
    paddingTop: 24,
    alignItems: 'center',
    gap: 8,
  },
  summaryIconContainer: {
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: fontWeights.bold,
    color: colors.foreground,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripsContent: {
    gap: 0,
  },
  tripCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastTripCard: {
    borderBottomWidth: 0,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: colors.foreground,
  },
  tripRouteName: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 12,
    color: colors.secondaryForeground,
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  tripStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripStatText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  tripEarnings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  earningsText: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.green700,
  },
  tripTime: {
    marginTop: 4,
  },
  tripTimeText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  insightsContent: {
    gap: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
  },
  insightDesc: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  quickActions: {
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