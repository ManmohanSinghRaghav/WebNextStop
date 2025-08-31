import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, radius, fontWeights } from './ui/Theme';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Phone, 
  Shield, 
  Heart,
  Car,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react-native';

export function EmergencyAlert({ onBack }) {
  const [selectedType, setSelectedType] = useState('medical');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const emergencyTypes = [
    { id: 'medical', label: 'Medical Emergency', icon: <Heart size={16} color={colors.foreground} />, priority: 'high' },
    { id: 'security', label: 'Security Issue', icon: <Shield size={16} color={colors.foreground} />, priority: 'high' },
    { id: 'mechanical', label: 'Vehicle Breakdown', icon: <Car size={16} color={colors.foreground} />, priority: 'medium' },
    { id: 'passenger', label: 'Passenger Issue', icon: <Users size={16} color={colors.foreground} />, priority: 'medium' },
    { id: 'traffic', label: 'Traffic Incident', icon: <AlertTriangle size={16} color={colors.foreground} />, priority: 'low' },
    { id: 'other', label: 'Other Emergency', icon: <AlertTriangle size={16} color={colors.foreground} />, priority: 'medium' }
  ];

  const getCurrentLocation = () => {
    return "Mall Junction, Route 42";
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high': return { backgroundColor: colors.destructive };
      case 'medium': return { backgroundColor: colors.primary };
      case 'low': return { backgroundColor: colors.secondary };
      default: return { backgroundColor: colors.primary };
    }
  };

  if (isSubmitted) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={16} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Alert</Text>
        </View>

        {/* Success Card */}
        <Card style={styles.successCard}>
          <CardContent style={styles.successContent}>
            <CheckCircle size={48} color={colors.green500} />
            <View style={styles.successTextContainer}>
              <Text style={styles.successTitle}>Alert Sent Successfully</Text>
              <Text style={styles.successSubtitle}>
                Emergency services and control center have been notified.
              </Text>
            </View>
            <View style={styles.successInfo}>
              <Text style={styles.successInfoText}>Reference ID: EM-2025-001234</Text>
              <Text style={styles.successInfoText}>Estimated response time: 5-10 minutes</Text>
            </View>
          </CardContent>
        </Card>

        {/* Next Steps Card */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent style={styles.nextStepsContent}>
            <View style={styles.nextStepItem}>
              <Phone size={16} color={colors.primary} />
              <View style={styles.nextStepText}>
                <Text style={styles.nextStepTitle}>Emergency coordinator will call you</Text>
                <Text style={styles.nextStepSubtitle}>Within 2 minutes</Text>
              </View>
            </View>
            <View style={styles.nextStepItem}>
              <Shield size={16} color={colors.primary} />
              <View style={styles.nextStepText}>
                <Text style={styles.nextStepTitle}>Stay at current location if safe</Text>
                <Text style={styles.nextStepSubtitle}>Wait for instructions</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Button onPress={onBack} style={styles.returnButton}>
          <Text style={styles.returnButtonText}>Return to Dashboard</Text>
        </Button>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={16} color={colors.foreground} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.destructive }]}>Emergency Alert</Text>
          <Text style={styles.headerSubtitle}>Report urgent situations</Text>
        </View>
      </View>

      {/* Current Location */}
      <Card style={styles.locationCard}>
        <CardContent style={styles.locationContent}>
          <View style={styles.locationInfo}>
            <AlertTriangle size={16} color={colors.destructive} />
            <View>
              <Text style={styles.locationLabel}>Current Location</Text>
              <Text style={styles.locationText}>{getCurrentLocation()}</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Emergency Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Type</CardTitle>
        </CardHeader>
        <CardContent>
          {emergencyTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={styles.radioOption}
              onPress={() => setSelectedType(type.id)}
            >
              <View style={styles.radioOptionContent}>
                <View style={styles.radioCircle}>
                  {selectedType === type.id && <View style={styles.radioDot} />}
                </View>
                <View style={styles.radioLabelContainer}>
                  <View style={styles.radioLabel}>
                    {type.icon}
                    <Text style={styles.radioLabelText}>{type.label}</Text>
                  </View>
                  <Badge style={[styles.priorityBadge, getPriorityStyle(type.priority)]}>
                    <Text style={styles.priorityBadgeText}>{type.priority}</Text>
                  </Badge>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </CardContent>
      </Card>
      
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <TextInput
            placeholder="Describe the emergency situation in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textarea}
            placeholderTextColor={colors.mutedForeground}
          />
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent style={styles.contactsContent}>
          <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Phone size={16} color={colors.foreground} />
              <Text style={styles.contactLabel}>Control Center</Text>
            </View>
            <Button variant="outline" size="sm">
              <View style={styles.contactButtonContent}>
                <Phone size={12} color={colors.foreground} />
                <Text style={styles.contactButtonText}>Call</Text>
              </View>
            </Button>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.contactInfo}>
              <Shield size={16} color={colors.foreground} />
              <Text style={styles.contactLabel}>Emergency Services</Text>
            </View>
            <Button variant="outline" size="sm">
              <View style={styles.contactButtonContent}>
                <Phone size={12} color={colors.foreground} />
                <Text style={styles.contactButtonText}>911</Text>
              </View>
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        onPress={handleSubmit} 
        disabled={isSubmitting} 
        variant="destructive" 
        style={styles.submitButton}
      >
        <View style={styles.submitButtonContent}>
          {isSubmitting ? (
            <>
              <ActivityIndicator color={colors.destructiveForeground} />
              <Text style={styles.submitButtonText}>Sending Alert...</Text>
            </>
          ) : (
            <>
              <AlertTriangle size={16} color={colors.destructiveForeground} />
              <Text style={styles.submitButtonText}>Send Emergency Alert</Text>
            </>
          )}
        </View>
      </Button>

      <Text style={styles.disclaimerText}>
        This will immediately notify emergency services and your control center
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  contentContainer: { 
    padding: 16, 
    gap: 16 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  backButton: { 
    padding: 8 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: fontWeights.bold,
    color: colors.foreground,
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: colors.mutedForeground 
  },
  locationLabel: {
    fontSize: 14,
    color: colors.destructive,
    fontWeight: fontWeights.medium,
  },
  locationText: {
    fontSize: 16,
    fontWeight: fontWeights.medium,
    color: colors.destructive,
  },
  radioOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  radioOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.background,
  },
  radioCircle: { 
    height: 20, 
    width: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: colors.primary, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  radioDot: { 
    height: 10, 
    width: 10, 
    borderRadius: 5, 
    backgroundColor: colors.primary 
  },
  radioLabelContainer: { 
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginLeft: 12 
  },
  radioLabel: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  radioLabelText: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 0,
  },
  priorityBadgeText: {
    fontSize: 10,
    color: colors.primaryForeground,
    fontWeight: fontWeights.medium,
  },
  textarea: {
    height: 100,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    textAlignVertical: 'top',
    backgroundColor: colors.muted,
    fontSize: 14,
    color: colors.foreground,
  },
  contactsContent: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactLabel: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  contactButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactButtonText: {
    fontSize: 12,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  submitButton: {
    height: 56,
    marginTop: 8,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: colors.destructiveForeground,
    fontSize: 16,
    fontWeight: fontWeights.semibold,
  },
  disclaimerText: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.mutedForeground,
    lineHeight: 16,
  },
  successCard: {
    borderColor: colors.green200,
    backgroundColor: colors.green50,
  },
  successContent: {
    paddingTop: 24,
    alignItems: 'center',
    gap: 16,
  },
  successTextContainer: {
    alignItems: 'center',
    gap: 8,
  },
  successTitle: {
    color: colors.green700,
    fontWeight: fontWeights.bold,
    fontSize: 18,
  },
  successSubtitle: {
    color: colors.green600,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  successInfo: {
    gap: 8,
    alignItems: 'center',
  },
  successInfoText: {
    fontSize: 14,
    color: colors.green600,
    fontWeight: fontWeights.medium,
  },
  nextStepsContent: {
    gap: 12,
  },
  nextStepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: radius.lg,
  },
  nextStepText: {
    flex: 1,
  },
  nextStepTitle: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  nextStepSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
    lineHeight: 16,
  },
  returnButton: {
    height: 56,
    marginTop: 8,
  },
  returnButtonText: {
    color: colors.primaryForeground,
    fontSize: 16,
    fontWeight: fontWeights.semibold,
  },
});