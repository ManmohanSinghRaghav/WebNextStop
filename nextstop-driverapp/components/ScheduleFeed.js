import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/Collapsible';
import { colors, fontWeights, radius } from './ui/Theme';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Route,
  Bell,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Navigation
} from 'lucide-react-native';

export function ScheduleFeed({ onBack, driverName }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const scheduleData = {
    today: [
      {
        id: 'NS-R42-001',
        routeNumber: 'Route 42',
        routeName: 'City Center - Airport',
        startTime: '06:00',
        endTime: '14:00',
        status: 'completed',
        totalStops: 15,
        estimatedDuration: '8 hours',
        vehicle: 'Bus KA-01-AB-1234',
        passengers: 127,
        earnings: 156.75
      },
      {
        id: 'NS-R42-002',
        routeNumber: 'Route 42',
        routeName: 'Airport - City Center',
        startTime: '14:30',
        endTime: '22:30',
        status: 'active',
        totalStops: 15,
        estimatedDuration: '8 hours',
        vehicle: 'Bus KA-01-AB-1234',
        passengers: 89,
        currentStop: 'Tech Park',
        nextStop: 'Medical Center'
      }
    ],
    notifications: [
      {
        id: 'not1',
        type: 'route_change',
        title: 'Route 42 Schedule Update',
        message: 'Evening shift start time changed to 14:30',
        time: '2 hours ago',
        priority: 'medium',
        isRead: false
      },
      {
        id: 'not2',
        type: 'maintenance',
        title: 'Vehicle Inspection Due',
        message: 'Bus KA-01-AB-1234 inspection scheduled for tomorrow',
        time: '1 day ago',
        priority: 'high',
        isRead: true
      },
      {
        id: 'not3',
        type: 'earnings',
        title: 'Weekly Earnings Summary',
        message: 'You earned ₹4,250 this week',
        time: '2 days ago',
        priority: 'low',
        isRead: true
      }
    ],
    upcoming: [
      {
        date: '2025-01-19',
        shifts: [
          {
            id: 'NS-R42-003',
            routeNumber: 'Route 42',
            routeName: 'City Center - Airport',
            startTime: '06:00',
            endTime: '14:00',
            status: 'scheduled',
            vehicle: 'Bus KA-01-AB-1234'
          }
        ]
      }
    ]
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed': return 'secondary';
      case 'active': return 'default';
      case 'scheduled': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'active': return 'In Progress';
      case 'scheduled': return 'Scheduled';
      default: return status;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle size={16} color={colors.destructive} />;
      case 'medium': return <Bell size={16} color={colors.yellow600} />;
      case 'low': return <CheckCircle size={16} color={colors.green600} />;
      default: return <Bell size={16} color={colors.mutedForeground} />;
    }
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
            <Text style={styles.headerTitle}>Schedule & Notifications</Text>
            <Text style={styles.headerSubtitle}>Welcome back, {driverName}</Text>
          </View>
        </View>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <View style={styles.cardTitleContainer}>
              <Calendar size={20} color={colors.foreground} />
              <CardTitle>Today's Schedule</CardTitle>
            </View>
          </CardHeader>
          <CardContent style={styles.scheduleContent}>
            {scheduleData.today.map((shift, index) => (
              <Collapsible key={shift.id}>
                <CollapsibleTrigger asChild>
                  <TouchableOpacity style={styles.shiftCard}>
                    <View style={styles.shiftHeader}>
                      <View style={styles.shiftInfo}>
                        <Text style={styles.routeNumber}>{shift.routeNumber}</Text>
                        <Text style={styles.routeName}>{shift.routeName}</Text>
                        <View style={styles.timeContainer}>
                          <Clock size={14} color={colors.mutedForeground} />
                          <Text style={styles.timeText}>{shift.startTime} - {shift.endTime}</Text>
                        </View>
                      </View>
                      <View style={styles.shiftStatus}>
                        <Badge variant={getStatusBadgeVariant(shift.status)}>
                          <Text style={styles.badgeText}>{getStatusText(shift.status)}</Text>
                        </Badge>
                        <ChevronDown size={16} color={colors.mutedForeground} />
                      </View>
                    </View>
                  </TouchableOpacity>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <View style={styles.shiftDetails}>
                    <View style={styles.detailRow}>
                      <MapPin size={16} color={colors.mutedForeground} />
                      <Text style={styles.detailText}>{shift.totalStops} stops</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Route size={16} color={colors.mutedForeground} />
                      <Text style={styles.detailText}>{shift.vehicle}</Text>
                    </View>
                    {shift.status === 'active' && (
                      <>
                        <View style={styles.detailRow}>
                          <Navigation size={16} color={colors.primary} />
                          <Text style={styles.detailTextActive}>
                            Current: {shift.currentStop} → Next: {shift.nextStop}
                          </Text>
                        </View>
                        <Button size="sm" style={styles.trackButton}>
                          <Text style={styles.trackButtonText}>Track Live</Text>
                        </Button>
                      </>
                    )}
                    {shift.status === 'completed' && (
                      <View style={styles.completedStats}>
                        <View style={styles.statItem}>
                          <Users size={16} color={colors.green600} />
                          <Text style={styles.statText}>{shift.passengers} passengers</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.earningsText}>₹{shift.earnings}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <View style={styles.cardTitleContainer}>
              <Bell size={20} color={colors.foreground} />
              <CardTitle>Recent Notifications</CardTitle>
              <Badge style={styles.notificationsBadge}>
                <Text style={styles.badgeText}>
                  {scheduleData.notifications.filter(n => !n.isRead).length}
                </Text>
              </Badge>
            </View>
          </CardHeader>
          <CardContent style={styles.notificationsContent}>
            {scheduleData.notifications.map((notification) => (
              <View 
                key={notification.id} 
                style={[
                  styles.notificationItem,
                  !notification.isRead && styles.notificationUnread
                ]}
              >
                <View style={styles.notificationHeader}>
                  <View style={styles.notificationLeft}>
                    {getPriorityIcon(notification.priority)}
                    <View style={styles.notificationInfo}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                    </View>
                  </View>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                </View>
                {!notification.isRead && <View style={styles.unreadDot} />}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <View style={styles.cardTitleContainer}>
              <Calendar size={20} color={colors.foreground} />
              <CardTitle>Upcoming Schedule</CardTitle>
            </View>
          </CardHeader>
          <CardContent style={styles.upcomingContent}>
            {scheduleData.upcoming.map((day) => (
              <View key={day.date} style={styles.upcomingDay}>
                <Text style={styles.upcomingDate}>
                  {new Date(day.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
                {day.shifts.map((shift) => (
                  <View key={shift.id} style={styles.upcomingShift}>
                    <View style={styles.upcomingShiftInfo}>
                      <Text style={styles.upcomingRoute}>{shift.routeNumber}</Text>
                      <Text style={styles.upcomingTime}>{shift.startTime} - {shift.endTime}</Text>
                    </View>
                    <Badge variant="outline">
                      <Text style={styles.badgeText}>{getStatusText(shift.status)}</Text>
                    </Badge>
                  </View>
                ))}
              </View>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button variant="outline" size="lg" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Calendar size={16} color={colors.foreground} />
              <Text style={styles.actionButtonText}>View Full Schedule</Text>
            </View>
          </Button>
          <Button size="lg" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Bell size={16} color={colors.primaryForeground} />
              <Text style={styles.actionButtonTextPrimary}>Notification Settings</Text>
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
    color: colors.foreground,
  },
  headerSubtitle: { 
    fontSize: 14,
    color: colors.mutedForeground 
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleContent: {
    gap: 12,
  },
  shiftCard: {
    padding: 16,
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
    marginBottom: 8,
  },
  shiftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shiftInfo: {
    flex: 1,
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: colors.foreground,
  },
  routeName: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  shiftStatus: {
    alignItems: 'flex-end',
    gap: 8,
  },
  badgeText: {
    fontSize: 12,
    color: colors.foreground,
  },
  shiftDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  detailTextActive: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
  trackButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  trackButtonText: {
    fontSize: 12,
    color: colors.primaryForeground,
  },
  completedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: colors.green600,
  },
  earningsText: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: colors.green700,
  },
  notificationsBadge: {
    backgroundColor: colors.destructive,
    marginLeft: 'auto',
  },
  notificationsContent: {
    gap: 12,
  },
  notificationItem: {
    position: 'relative',
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
  },
  notificationUnread: {
    backgroundColor: colors.accent,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
  },
  notificationMessage: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
    lineHeight: 16,
  },
  notificationTime: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  upcomingContent: {
    gap: 16,
  },
  upcomingDay: {
    gap: 8,
  },
  upcomingDate: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: colors.foreground,
  },
  upcomingShift: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
  },
  upcomingShiftInfo: {
    gap: 2,
  },
  upcomingRoute: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.foreground,
  },
  upcomingTime: {
    fontSize: 12,
    color: colors.mutedForeground,
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