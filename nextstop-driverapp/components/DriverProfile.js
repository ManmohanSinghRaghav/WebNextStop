import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Switch, Alert, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors } from './ui/Theme';
import { 
  ArrowLeft,
  User, 
  Phone, 
  MapPin, 
  Car, 
  Settings, 
  Bell,
  Shield,
  Edit,
  Save,
  Star,
  Award,
  Clock,
  TrendingUp,
  LogOut
} from 'lucide-react-native';

// Custom Picker Component for Vehicle Type and Experience
const CustomPicker = ({ label, items, selectedValue, onValueChange, isEditing }) => {
  if (!isEditing) {
    const selectedItem = items.find(item => item.value === selectedValue);
    return (
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>{selectedItem?.label || selectedValue}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        {items.map(item => (
          <TouchableOpacity
            key={item.value}
            onPress={() => onValueChange(item.value)}
            style={[
              styles.pickerItem,
              selectedValue === item.value && styles.pickerItemSelected
            ]}
          >
            <Text style={[
              styles.pickerItemText,
              selectedValue === item.value && styles.pickerItemSelectedText
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export function DriverProfile({ onBack, onLogout, driverData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: driverData?.fullName || 'Rajesh Kumar',
    phone: driverData?.phone || '9876543210',
    emergencyContact: driverData?.emergencyContact || '9876543211',
    address: driverData?.address || 'Koramangala, Bangalore',
    licenseNumber: driverData?.licenseNumber || 'KA1234567890',
    vehicleType: driverData?.vehicleType || 'bus',
    experience: driverData?.experience || '5-10'
  });

  const [notifications, setNotifications] = useState({
    scheduleUpdates: true,
    routeChanges: true,
    emergencyAlerts: true,
    promotions: false,
    appUpdates: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const driverStats = {
    totalTrips: 1247,
    rating: 4.8,
    hoursWorked: 2840,
    safetyScore: 95,
    onTimePercentage: 92,
    joinDate: 'March 2023'
  };

  const vehicleTypeOptions = [
    { label: 'Bus', value: 'bus' },
    { label: 'Mini Bus', value: 'minibus' },
    { label: 'Van', value: 'van' },
    { label: 'Auto Rickshaw', value: 'auto' }
  ];

  const experienceOptions = [
    { label: '1-2 years', value: '1-2' },
    { label: '3-5 years', value: '3-5' },
    { label: '6-10 years', value: '6-10' },
    { label: '10+ years', value: '10+' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleLogoutConfirm = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: onLogout, style: "destructive" },
      ]
    );
  };

  const updateProfileData = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateNotification = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Driver Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
          style={styles.editButton}
        >
          <View style={styles.buttonContent}>
            {isSaving ? (
              <Clock size={16} color={isEditing ? colors.primaryForeground : colors.foreground} />
            ) : isEditing ? (
              <>
                <Save size={16} color={colors.primaryForeground} />
                <Text style={styles.buttonTextPrimary}>Save</Text>
              </>
            ) : (
              <>
                <Edit size={16} color={colors.foreground} />
                <Text style={styles.buttonTextOutline}>Edit</Text>
              </>
            )}
          </View>
        </Button>
      </View>

      {/* Driver Stats */}
      <Card>
        <CardHeader>
          <View style={styles.cardTitleContainer}>
            <Award size={20} color={colors.foreground} />
            <CardTitle>Performance Overview</CardTitle>
          </View>
        </CardHeader>
        <CardContent style={styles.statsContent}>
          <View style={styles.mainStatsGrid}>
            <View style={styles.statItem}>
              <View style={styles.ratingContainer}>
                <Text style={styles.statValueLarge}>{driverStats.rating}</Text>
                <Star size={16} color={colors.yellow500} />
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValueLarge}>{driverStats.totalTrips}</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </View>
          </View>

          <View style={styles.secondaryStatsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValueGreen}>{driverStats.onTimePercentage}%</Text>
              <Text style={styles.statLabel}>On Time</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValueBlue}>{driverStats.safetyScore}%</Text>
              <Text style={styles.statLabel}>Safety Score</Text>
            </View>
          </View>

          <View style={styles.memberSince}>
            <Text style={styles.memberSinceLabel}>Member since</Text>
            <Badge style={styles.memberSinceBadge}>
              <Text style={styles.badgeText}>{driverStats.joinDate}</Text>
            </Badge>
          </View>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <View style={styles.cardTitleContainer}>
            <User size={20} color={colors.foreground} />
            <CardTitle>Personal Information</CardTitle>
          </View>
        </CardHeader>
        <CardContent style={styles.personalInfoContent}>
          <View style={styles.infoField}>
            <Text style={styles.label}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.fullName}
                onChangeText={(value) => updateProfileData('fullName', value)}
              />
            ) : (
              <Text style={styles.valueText}>{profileData.fullName}</Text>
            )}
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneContainer}>
              <Phone size={16} color={colors.foreground} />
              <Text style={styles.phoneText}>+91 {profileData.phone}</Text>
              <Badge style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>Verified</Text>
              </Badge>
            </View>
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Address</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.address}
                onChangeText={(value) => updateProfileData('address', value)}
                multiline
              />
            ) : (
              <View style={styles.addressContainer}>
                <MapPin size={16} color={colors.foreground} />
                <Text style={styles.addressText}>{profileData.address}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoField}>
            <Text style={styles.label}>Emergency Contact</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={profileData.emergencyContact}
                onChangeText={(value) => updateProfileData('emergencyContact', value)}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.valueText}>+91 {profileData.emergencyContact}</Text>
            )}
          </View>
        </CardContent>
      </Card>

      {/* Driving Information */}
      <Card>
        <CardHeader>
          <View style={styles.cardTitleContainer}>
            <Car size={20} color={colors.foreground} />
            <CardTitle>Driving Information</CardTitle>
          </View>
        </CardHeader>
        <CardContent style={styles.drivingInfoContent}>
          <View style={styles.infoField}>
            <Text style={styles.label}>Driving License</Text>
            <View style={styles.licenseContainer}>
              <Text style={styles.licenseNumber}>{profileData.licenseNumber}</Text>
              <Badge style={styles.validBadge}>
                <Text style={styles.validText}>Valid</Text>
              </Badge>
            </View>
          </View>

          <CustomPicker
            label="Vehicle Type"
            items={vehicleTypeOptions}
            selectedValue={profileData.vehicleType}
            onValueChange={(value) => updateProfileData('vehicleType', value)}
            isEditing={isEditing}
          />

          <CustomPicker
            label="Experience"
            items={experienceOptions}
            selectedValue={profileData.experience}
            onValueChange={(value) => updateProfileData('experience', value)}
            isEditing={isEditing}
          />
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <View style={styles.cardTitleContainer}>
            <Bell size={20} color={colors.foreground} />
            <CardTitle>Notification Preferences</CardTitle>
          </View>
        </CardHeader>
        <CardContent style={styles.notificationsContent}>
          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Schedule Updates</Text>
              <Text style={styles.notificationDesc}>Get notified about schedule changes</Text>
            </View>
            <Switch
              value={notifications.scheduleUpdates}
              onValueChange={(value) => updateNotification('scheduleUpdates', value)}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Route Changes</Text>
              <Text style={styles.notificationDesc}>Receive alerts about route modifications</Text>
            </View>
            <Switch
              value={notifications.routeChanges}
              onValueChange={(value) => updateNotification('routeChanges', value)}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Emergency Alerts</Text>
              <Text style={styles.notificationDesc}>Critical safety notifications</Text>
            </View>
            <Switch
              value={notifications.emergencyAlerts}
              onValueChange={(value) => updateNotification('emergencyAlerts', value)}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>App Updates</Text>
              <Text style={styles.notificationDesc}>New features and improvements</Text>
            </View>
            <Switch
              value={notifications.appUpdates}
              onValueChange={(value) => updateNotification('appUpdates', value)}
            />
          </View>

          <View style={styles.notificationItem}>
            <View style={styles.notificationInfo}>
              <Text style={styles.notificationTitle}>Promotions</Text>
              <Text style={styles.notificationDesc}>Special offers and bonuses</Text>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={(value) => updateNotification('promotions', value)}
            />
          </View>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <View style={styles.cardTitleContainer}>
            <Settings size={20} color={colors.foreground} />
            <CardTitle>Account Actions</CardTitle>
          </View>
        </CardHeader>
        <CardContent style={styles.actionsContent}>
          <Button variant="outline" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <Shield size={16} color={colors.foreground} />
              <Text style={styles.actionButtonText}>Privacy Settings</Text>
            </View>
          </Button>
          
          <Button variant="outline" style={styles.actionButton}>
            <View style={styles.actionButtonContent}>
              <TrendingUp size={16} color={colors.foreground} />
              <Text style={styles.actionButtonText}>Performance History</Text>
            </View>
          </Button>

          <View style={styles.separator} />

          <Button 
            variant="destructive" 
            style={styles.logoutButton}
            onPress={handleLogoutConfirm}
          >
            <View style={styles.actionButtonContent}>
              <LogOut size={16} color={colors.destructiveForeground} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </View>
          </Button>
        </CardContent>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.versionText}>NextStop Driver App v2.1.0</Text>
      </View>
    </ScrollView>
  );
}

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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  editButton: {
    minWidth: 80,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonTextPrimary: {
    color: colors.primaryForeground,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonTextOutline: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '500',
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsContent: {
    gap: 16,
  },
  mainStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValueLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  statValueGreen: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.green600,
  },
  statValueBlue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.blue600,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  secondaryStatsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  memberSince: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  memberSinceLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  memberSinceBadge: {
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 12,
    color: colors.secondaryForeground,
  },
  personalInfoContent: {
    gap: 16,
  },
  infoField: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    fontSize: 14,
    color: colors.foreground,
  },
  valueText: {
    fontSize: 14,
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: 8,
    color: colors.foreground,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: 8,
  },
  phoneText: {
    flex: 1,
    fontSize: 14,
    color: colors.foreground,
  },
  verifiedBadge: {
    backgroundColor: colors.secondary,
  },
  verifiedText: {
    fontSize: 10,
    color: colors.secondaryForeground,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: colors.foreground,
  },
  drivingInfoContent: {
    gap: 16,
  },
  licenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: 8,
  },
  licenseNumber: {
    fontSize: 14,
    color: colors.foreground,
  },
  validBadge: {
    backgroundColor: colors.secondary,
  },
  validText: {
    fontSize: 10,
    color: colors.secondaryForeground,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  pickerItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.muted,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerItemText: {
    fontSize: 14,
    color: colors.foreground,
  },
  pickerItemSelectedText: {
    color: colors.primaryForeground,
  },
  notificationsContent: {
    gap: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
    paddingRight: 16,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
  },
  notificationDesc: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  actionsContent: {
    gap: 12,
  },
  actionButton: {
    height: 56,
    justifyContent: 'flex-start',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: colors.foreground,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  logoutButton: {
    height: 56,
    justifyContent: 'flex-start',
  },
  logoutButtonText: {
    fontSize: 14,
    color: colors.destructiveForeground,
    fontWeight: '500',
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 10,
    color: colors.mutedForeground,
  },
});