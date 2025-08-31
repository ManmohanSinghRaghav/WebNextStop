import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, fontWeights, radius } from './ui/Theme';
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  Minus, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Clock
} from 'lucide-react-native';

// Enhanced Progress Bar Component
const Progress = ({ value, style }) => (
  <View style={[styles.progressBase, style]}>
    <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
  </View>
);

export function PassengerManagement({ onBack }) {
  const [passengerCount, setPassengerCount] = useState(28);
  const [isLoading, setIsLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState([
    { time: '09:00', stop: 'Mall Junction', boarded: 5, alighted: 2, type: 'boarding' },
    { time: '08:45', stop: 'Business Park', boarded: 3, alighted: 8, type: 'alighting' },
    { time: '08:30', stop: 'University Campus', boarded: 12, alighted: 1, type: 'boarding' },
    { time: '08:15', stop: 'Shopping District', boarded: 8, alighted: 3, type: 'boarding' }
  ]);

  const stats = {
    current: passengerCount,
    capacity: 50,
    boardedToday: 127,
    averageOccupancy: 68,
    peakTime: '08:30 AM'
  };

  const occupancyPercentage = (stats.current / stats.capacity) * 100;
  const isNearCapacity = occupancyPercentage > 85;

  const handlePassengerChange = async (change) => {
    const newCount = Math.max(0, Math.min(stats.capacity, passengerCount + change));
    if (newCount === passengerCount) return;
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setPassengerCount(newCount);
      
      // Add to recent activity
      const newActivity = {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        stop: 'Current Stop',
        boarded: change > 0 ? Math.abs(change) : 0,
        alighted: change < 0 ? Math.abs(change) : 0,
        type: change > 0 ? 'boarding' : 'alighting'
      };
      
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 3)]);
    } finally {
      setIsLoading(false);
    }
  };

  const getOccupancyColor = (percentage) => {
    if (percentage > 85) return colors.destructive;
    if (percentage > 70) return colors.yellow600;
    return colors.green600;
  };

  const getOccupancyTextColor = (percentage) => {
    if (percentage > 85) return colors.destructive;
    if (percentage > 70) return '#d97706'; // yellow-600
    return '#059669'; // green-600
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={16} color={colors.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Passenger Management</Text>
            <Text style={styles.headerSubtitle}>Real-time capacity tracking</Text>
          </View>
        </View>

        {/* Capacity Alert */}
        {isNearCapacity && (
          <Card style={styles.alertCard}>
            <CardContent style={styles.alertContent}>
              <AlertCircle size={16} color={colors.destructive} />
              <Text style={styles.alertText}>Near capacity - Consider notifying control center</Text>
            </CardContent>
          </Card>
        )}

        {/* Current Passenger Count */}
        <Card>
          <CardHeader>
            <View style={styles.cardTitleContainer}>
              <Users size={20} color={colors.foreground} />
              <CardTitle>Current Passengers</CardTitle>
            </View>
          </CardHeader>
          <CardContent style={styles.passengerCardContent}>
            <View style={styles.currentCountContainer}>
              <Text style={styles.passengerCount}>{stats.current}</Text>
              <Text style={[styles.occupancyText, { color: getOccupancyTextColor(occupancyPercentage) }]}>
                {occupancyPercentage.toFixed(0)}% of capacity
              </Text>
            </View>

            <Progress value={occupancyPercentage} style={styles.capacityProgress} />

            <View style={styles.capacityLabels}>
              <Text style={styles.capacityLabel}>0</Text>
              <Text style={styles.capacityLabel}>{stats.capacity} max</Text>
            </View>

            {/* Manual Count Adjustment */}
            <View style={styles.manualAdjustContainer}>
              <Button 
                variant="outline" 
                size="sm"
                onPress={() => handlePassengerChange(-1)}
                disabled={passengerCount <= 0}
              >
                <Minus size={16} color={colors.foreground} />
              </Button>
              <Text style={styles.adjustmentLabel}>Manual adjustment</Text>
              <Button 
                variant="outline" 
                size="sm"
                onPress={() => handlePassengerChange(1)}
                disabled={passengerCount >= stats.capacity}
              >
                <Plus size={16} color={colors.foreground} />
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Daily Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Statistics</CardTitle>
          </CardHeader>
          <CardContent style={styles.statsCardContent}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.boardedToday}</Text>
                <Text style={styles.statLabel}>Total boarded</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.averageOccupancy}%</Text>
                <Text style={styles.statLabel}>Avg occupancy</Text>
              </View>
            </View>
            
            <View style={styles.peakTimeContainer}>
              <View style={styles.peakTimeRow}>
                <Text style={styles.peakTimeLabel}>Peak time</Text>
                <Badge style={styles.peakTimeBadge}>
                  <Text style={styles.peakTimeText}>{stats.peakTime}</Text>
                </Badge>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent style={styles.activityCardContent}>
            {recentActivity.map((activity, index) => (
              <View key={index} style={[styles.activityItem, index === recentActivity.length - 1 && styles.lastActivityItem]}>
                <View style={styles.activityLeft}>
                  <View style={styles.activityTimeContainer}>
                    <Clock size={12} color={colors.mutedForeground} />
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <View style={styles.activityDetails}>
                    <Text style={styles.activityStop}>{activity.stop}</Text>
                    <View style={styles.activityStatsRow}>
                      {activity.boarded > 0 && (
                        <View style={styles.activityStat}>
                          <TrendingUp size={12} color='#059669' />
                          <Text style={styles.boardedText}>+{activity.boarded}</Text>
                        </View>
                      )}
                      {activity.alighted > 0 && (
                        <View style={styles.activityStat}>
                          <TrendingDown size={12} color='#2563eb' />
                          <Text style={styles.alightedText}>-{activity.alighted}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button variant="outline" size="lg" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <AlertCircle size={16} color={colors.foreground} />
              <Text style={styles.actionButtonText}>Report Issue</Text>
            </View>
          </Button>
          <Button size="lg" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Users size={16} color={colors.primaryForeground} />
              <Text style={styles.actionButtonTextPrimary}>Send Update</Text>
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
    color: colors.foreground 
  },
  headerSubtitle: { 
    fontSize: 14,
    color: colors.mutedForeground 
  },
  alertCard: { 
    backgroundColor: 'rgba(239, 68, 68, 0.05)', 
    borderColor: 'rgba(239, 68, 68, 0.5)' 
  },
  alertContent: { 
    paddingTop: 24, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  alertText: { 
    color: colors.destructive, 
    fontSize: 14 
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passengerCardContent: {
    gap: 16,
  },
  currentCountContainer: {
    alignItems: 'center',
  },
  passengerCount: { 
    fontSize: 48, 
    fontWeight: fontWeights.bold, 
    color: colors.foreground 
  },
  occupancyText: {
    fontSize: 14,
    marginTop: 8,
  },
  capacityProgress: {
    height: 12,
  },
  capacityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capacityLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  manualAdjustContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center', 
    paddingTop: 16, 
    borderTopWidth: 1, 
    borderTopColor: colors.border,
    gap: 16,
  },
  adjustmentLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  statsCardContent: {
    gap: 16,
  },
  statsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-around' 
  },
  statItem: { 
    alignItems: 'center' 
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: fontWeights.bold, 
    color: colors.foreground 
  },
  statLabel: { 
    color: colors.mutedForeground, 
    fontSize: 14, 
    marginTop: 4 
  },
  peakTimeContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  peakTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  peakTimeLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  peakTimeBadge: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  peakTimeText: {
    fontSize: 12,
    color: colors.secondaryForeground,
  },
  activityCardContent: {
    gap: 12,
  },
  activityItem: { 
    paddingVertical: 8, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border 
  },
  lastActivityItem: {
    borderBottomWidth: 0,
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityTimeContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  activityTime: { 
    fontSize: 10, 
    color: colors.mutedForeground 
  },
  activityDetails: {
    flex: 1,
  },
  activityStop: { 
    fontSize: 14, 
    fontWeight: fontWeights.medium, 
    color: colors.foreground 
  },
  activityStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  activityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  boardedText: { 
    color: '#059669', 
    fontSize: 10 
  },
  alightedText: { 
    color: '#2563eb', 
    fontSize: 10 
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
  progressBase: {
    height: 12,
    width: '100%',
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
});