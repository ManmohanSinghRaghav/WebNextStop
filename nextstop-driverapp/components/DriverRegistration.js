import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { colors, radius, fontWeights } from './ui/Theme';
import { 
  Phone, 
  User, 
  MapPin, 
  Car, 
  Shield, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react-native';
import { saveDriverProfile } from '../utils/firebase';

// A simple Picker to replace the web's <Select>
const CustomPicker = ({ label, items, selectedValue, onValueChange }) => {
    // In a real app, this would open a Modal or ActionSheet
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
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
                        ]}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

export function DriverRegistration({ onRegistrationComplete }) {
  const [currentStep, setCurrentStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [driverDetails, setDriverDetails] = useState({
    fullName: '',
    licenseNumber: '',
    vehicleType: '',
    experience: '',
    emergencyContact: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length !== 10) return;
    
    setIsLoading(true);
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setCurrentStep('otp');
  };

  const handleOtpVerification = async () => {
    if (otp.length !== 6) return;
    
    setIsLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentStep('details');
  };

  const handleDetailsSubmit = async () => {
    setIsLoading(true);
    try {
      // Save to Firestore via Firebase helper
      await saveDriverProfile({
        phone: `+91${phoneNumber}`,
        ...driverDetails,
        registrationDate: new Date().toISOString(),
        status: 'pending_approval',
      });

      setCurrentStep('verification');

      // Auto complete after showing success
      setTimeout(() => {
        onRegistrationComplete({
          phone: `+91${phoneNumber}`,
          ...driverDetails,
          registrationDate: new Date().toISOString(),
          status: 'pending_approval',
        });
      }, 3000);
    } catch (e) {
      console.warn('Registration save failed:', e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDriverDetails = (field, value) => {
    setDriverDetails(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return driverDetails.fullName && 
           driverDetails.licenseNumber && 
           driverDetails.vehicleType && 
           driverDetails.emergencyContact;
  };

  if (currentStep === 'verification') {
    return (
      <View style={styles.centeredContainer}>
        <Card style={styles.successCard}>
          <CardContent style={styles.successContent}>
            <CheckCircle size={64} color={colors.green500} />
            <View style={styles.successTextContainer}>
              <Text style={styles.successTitle}>Registration Successful!</Text>
              <Text style={styles.successSubtitle}>
                Your application has been submitted for verification.
              </Text>
            </View>
            <View style={styles.applicationInfo}>
              <Text style={styles.applicationId}>Application ID: NS-DR-{Date.now().toString().slice(-6)}</Text>
              <Text style={styles.verificationTime}>Verification typically takes 24-48 hours</Text>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.nextStepsCard}>
          <CardHeader>
            <View style={styles.cardTitleContainer}>
              <Clock size={20} color={colors.foreground} />
              <CardTitle>What's Next?</CardTitle>
            </View>
          </CardHeader>
          <CardContent style={styles.nextStepsContent}>
            <View style={styles.stepItem}>
              <Shield size={16} color={colors.primary} />
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>Document verification in progress</Text>
                <Text style={styles.stepSubtitle}>Our team will review your license</Text>
              </View>
            </View>
            <View style={styles.stepItem}>
              <Phone size={16} color={colors.primary} />
              <View style={styles.stepTextContainer}>
                <Text style={styles.stepTitle}>You'll receive an SMS notification</Text>
                <Text style={styles.stepSubtitle}>Once approved, you can start driving</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        <Text style={styles.redirectingText}>Redirecting to dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.regHeader}>
        <Text style={styles.headerTitle}>NextStop</Text>
        <Text style={styles.headerSubtitle}>Driver Registration</Text>
        <View style={styles.progressSteps}>
          {['phone', 'otp', 'details'].map((step, index) => (
            <View
              key={step}
              style={[
                styles.progressStep,
                ['phone', 'otp', 'details'].indexOf(currentStep) >= index && styles.progressStepActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Phone Number Step */}
      {currentStep === 'phone' && (
        <Card>
          <CardHeader>
            <View style={styles.cardTitleContainer}>
              <Phone size={20} color={colors.foreground} />
              <CardTitle>Phone Verification</CardTitle>
            </View>
          </CardHeader>
          <CardContent style={styles.phoneContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, '').slice(0, 10))}
                  keyboardType="phone-pad"
                  style={styles.phoneInput}
                  maxLength={10}
                />
              </View>
            </View>
            
            <View style={styles.infoPoints}>
              <Text style={styles.infoPoint}>• We'll send you a verification code</Text>
              <Text style={styles.infoPoint}>• This number will be used for all communications</Text>
              <Text style={styles.infoPoint}>• Make sure you have access to this number</Text>
            </View>

            <Button
              onPress={handlePhoneSubmit}
              disabled={phoneNumber.length !== 10 || isLoading}
              style={styles.primaryButton}
            >
              <View style={styles.buttonContent}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonTextWhite}>
                      {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                    </Text>
                    <ArrowRight size={16} color="#fff" />
                  </>
                )}
              </View>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* OTP Verification Step */}
      {currentStep === 'otp' && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Verification Code</CardTitle>
          </CardHeader>
          <CardContent style={styles.otpContent}>
            <Text style={styles.otpSubtitle}>
              We've sent a 6-digit code to +91 {phoneNumber}
            </Text>
            <TextInput
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, 6))}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={6}
            />

            <View style={styles.otpActions}>
              <Button variant="ghost" size="sm" onPress={() => setCurrentStep('phone')}>
                <Text style={styles.buttonTextGhost}>Change Number</Text>
              </Button>
              <Button variant="ghost" size="sm">
                <Text style={styles.buttonTextGhost}>Resend Code</Text>
              </Button>
            </View>

            <Button
              onPress={handleOtpVerification}
              disabled={otp.length !== 6 || isLoading}
              style={styles.primaryButton}
            >
              <Text style={styles.buttonTextWhite}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Driver Details Step */}
      {currentStep === 'details' && (
        <View style={styles.detailsContainer}>
          <Card>
            <CardHeader>
              <View style={styles.cardTitleContainer}>
                <User size={20} color={colors.foreground} />
                <CardTitle>Personal Information</CardTitle>
              </View>
            </CardHeader>
            <CardContent style={styles.detailsContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  placeholder="Enter your full name"
                  value={driverDetails.fullName}
                  onChangeText={(value) => updateDriverDetails('fullName', value)}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  placeholder="Enter your address"
                  value={driverDetails.address}
                  onChangeText={(value) => updateDriverDetails('address', value)}
                  style={styles.input}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Emergency Contact *</Text>
                <TextInput
                  placeholder="Emergency contact number"
                  value={driverDetails.emergencyContact}
                  onChangeText={(value) => updateDriverDetails('emergencyContact', value)}
                  style={styles.input}
                  keyboardType="phone-pad"
                />
              </View>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <View style={styles.cardTitleContainer}>
                <Car size={20} color={colors.foreground} />
                <CardTitle>Driving Information</CardTitle>
              </View>
            </CardHeader>
            <CardContent style={styles.detailsContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Driving License Number *</Text>
                <TextInput
                  placeholder="Enter license number"
                  value={driverDetails.licenseNumber}
                  onChangeText={(value) => updateDriverDetails('licenseNumber', value.toUpperCase())}
                  style={styles.input}
                />
              </View>

              <CustomPicker
                label="Vehicle Type *"
                selectedValue={driverDetails.vehicleType}
                onValueChange={(value) => updateDriverDetails('vehicleType', value)}
                items={[
                  { label: 'Bus', value: 'bus' },
                  { label: 'Mini Bus', value: 'minibus' },
                  { label: 'Van', value: 'van' },
                  { label: 'Auto Rickshaw', value: 'auto' },
                ]}
              />

              <CustomPicker
                label="Driving Experience"
                selectedValue={driverDetails.experience}
                onValueChange={(value) => updateDriverDetails('experience', value)}
                items={[
                  { label: '1-2 years', value: '1-2' },
                  { label: '3-5 years', value: '3-5' },
                  { label: '6-10 years', value: '6-10' },
                  { label: '10+ years', value: '10+' },
                ]}
              />
            </CardContent>
          </Card>

          <Button
            onPress={handleDetailsSubmit}
            disabled={!isFormValid() || isLoading}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonTextWhite}>
              {isLoading ? 'Submitting Registration...' : 'Complete Registration'}
            </Text>
          </Button>

          <Text style={styles.termsText}>
            By registering, you agree to NextStop's terms and conditions
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentContainer: { padding: 16, gap: 24 },
  centeredContainer: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: colors.background },
  regHeader: { alignItems: 'center', paddingTop: 32, gap: 8 },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: fontWeights.bold,
    color: colors.foreground,
  },
  headerSubtitle: { color: colors.mutedForeground },
  label: { 
    marginBottom: 8, 
    fontWeight: fontWeights.medium, 
    color: colors.foreground 
  },
  input: { height: 48, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 12, backgroundColor: colors.muted, flex: 1 },
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  countryCode: { padding: 12, backgroundColor: colors.muted, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  pickerItem: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.muted, borderRadius: 6, borderWidth: 1, borderColor: colors.border },
  pickerItemSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  pickerItemText: { color: colors.foreground },
  pickerItemSelectedText: { color: colors.primaryForeground },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  progressStep: {
    height: 8,
    width: 32,
    borderRadius: 4,
    backgroundColor: colors.muted,
  },
  progressStepActive: {
    backgroundColor: colors.primary,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    fontSize: 16,
    color: colors.foreground,
  },
  countryCodeText: {
    fontSize: 14,
    color: colors.foreground,
  },
  infoPoints: {
    gap: 4,
  },
  infoPoint: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  primaryButton: {
    height: 48,
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonTextWhite: {
    color: '#fff',
    fontSize: 14,
    fontWeight: fontWeights.medium,
  },
  buttonTextGhost: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: fontWeights.normal,
  },
  otpContent: {
    gap: 16,
  },
  otpSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 12,
  },
  otpInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 8,
    color: colors.foreground,
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsContainer: {
    gap: 16,
  },
  detailsContent: {
    gap: 16,
  },
  termsText: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.mutedForeground,
    marginTop: 8,
  },
  successCard: {
    borderColor: 'rgba(34, 197, 94, 0.5)',
    backgroundColor: '#f0fdf4',
    marginBottom: 16,
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
    color: '#16a34a',
    textAlign: 'center',
    fontSize: 14,
  },
  applicationInfo: {
    gap: 8,
    alignItems: 'center',
  },
  applicationId: {
    fontSize: 14,
    color: '#16a34a',
  },
  verificationTime: {
    fontSize: 14,
    color: '#16a34a',
  },
  nextStepsCard: {
    marginBottom: 16,
  },
  nextStepsContent: {
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: colors.muted,
    borderRadius: 8,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    color: colors.foreground,
    fontWeight: fontWeights.medium,
  },
  stepSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  redirectingText: {
    fontSize: 10,
    textAlign: 'center',
    color: colors.mutedForeground,
  },
});