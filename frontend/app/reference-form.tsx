import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '../src/components/Header';
import { FormInput } from '../src/components/FormInput';
import { FormDropdown } from '../src/components/FormDropdown';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import { COLORS, SPACING } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';
import { useOTPStore } from '../src/store/otpStore';
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  INDIAN_STATES,
  REFERENCE_NAMES,
} from '../src/constants/data';

interface FormData {
  fullName: string;
  handlerName: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  mobileNumber: string;
  emailAddress: string;
  aadhaarNumber: string;
  panNumber: string;
  voterIdNumber: string;
  passportNumber: string;
  currentAddress: string;
  permanentAddress: string;
  city: string;
  state: string;
  pinCode: string;
  otherReference: string;
}

export default function ReferenceFormPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuthStore();
  const {
    isOtpSent,
    isOtpVerified,
    isLoading: otpLoading,
    error: otpError,
    sendOtp,
    verifyOtp,
    resetOtp,
  } = useOTPStore();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    handlerName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    mobileNumber: '',
    emailAddress: '',
    aadhaarNumber: '',
    panNumber: '',
    voterIdNumber: '',
    passportNumber: '',
    currentAddress: '',
    permanentAddress: '',
    city: '',
    state: '',
    pinCode: '',
    otherReference: '',
  });

  const [otp, setOtp] = useState('');
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [aadhaarFront, setAadhaarFront] = useState<string | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<string | null>(null);
  const [panCard, setPanCard] = useState<string | null>(null);
  const [livePhoto, setLivePhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace('/login');
    }
    return () => {
      resetOtp();
    };
  }, [isLoggedIn, authLoading]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }
    const phoneNumber = `+91${formData.mobileNumber}`;
    await sendOtp(phoneNumber);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }
    await verifyOtp(otp);
  };

  const pickImage = async (
    setImage: (uri: string) => void,
    useCamera: boolean = false
  ) => {
    try {
      let result;
      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Permission Required', 'Camera permission is required to take photos');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0].base64) {
        setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const validateForm = () => {
    const required = ['fullName', 'handlerName', 'mobileNumber', 'aadhaarNumber'];
    for (const field of required) {
      if (!formData[field as keyof FormData]) {
        Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!isOtpVerified) {
      Alert.alert('Verification Required', 'Please verify your mobile number with OTP');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.replace('/submission-success');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Hidden reCAPTCHA container for Firebase Phone Auth */}
      <View nativeID="recaptcha-container" style={styles.recaptchaContainer} />
      
      <Header
        title="Reference Form"
        showBack={true}
        showMenu={false}
        onBackPress={() => router.back()}
      />

      {(isSubmitting || otpLoading) && (
        <LoadingSpinner
          fullScreen
          message={isSubmitting ? 'Submitting form...' : 'Processing...'}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Personal Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person" size={20} color={COLORS.saffron} />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            <FormInput
              label="Full Name (as per Aadhaar)"
              value={formData.fullName}
              onChangeText={(v) => updateFormData('fullName', v)}
              placeholder="Enter your full name"
              icon="person-outline"
              required
            />

            <FormInput
              label="Handler Name"
              value={formData.handlerName}
              onChangeText={(v) => updateFormData('handlerName', v)}
              placeholder="Enter handler name"
              icon="people-outline"
              required
            />

            <FormInput
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChangeText={(v) => updateFormData('dateOfBirth', v)}
              placeholder="DD/MM/YYYY"
              icon="calendar-outline"
            />

            <FormDropdown
              label="Gender"
              value={formData.gender}
              options={GENDER_OPTIONS}
              onSelect={(v) => updateFormData('gender', v)}
              placeholder="Select gender"
            />

            <FormDropdown
              label="Marital Status"
              value={formData.maritalStatus}
              options={MARITAL_STATUS_OPTIONS}
              onSelect={(v) => updateFormData('maritalStatus', v)}
              placeholder="Select marital status"
            />

            <FormInput
              label="Occupation"
              value={formData.occupation}
              onChangeText={(v) => updateFormData('occupation', v)}
              placeholder="Enter your occupation"
              icon="briefcase-outline"
            />
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call" size={20} color={COLORS.saffron} />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            <FormInput
              label="Mobile Number"
              value={formData.mobileNumber}
              onChangeText={(v) => updateFormData('mobileNumber', v)}
              placeholder="10-digit mobile number"
              icon="call-outline"
              keyboardType="phone-pad"
              maxLength={10}
              required
              rightElement={
                !isOtpVerified && (
                  <TouchableOpacity
                    style={[styles.otpBtn, isOtpSent && styles.otpBtnSent]}
                    onPress={handleSendOtp}
                    disabled={otpLoading || isOtpSent}
                  >
                    <Text style={styles.otpBtnText}>
                      {isOtpSent ? 'Sent' : 'Send OTP'}
                    </Text>
                  </TouchableOpacity>
                )
              }
            />

            {isOtpSent && !isOtpVerified && (
              <View style={styles.otpSection}>
                <FormInput
                  label="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="6-digit OTP (Use 123456 for demo)"
                  icon="key-outline"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {otpError && <Text style={styles.otpError}>{otpError}</Text>}
                <TouchableOpacity
                  style={styles.verifyBtn}
                  onPress={handleVerifyOtp}
                  disabled={otpLoading}
                >
                  <Text style={styles.verifyBtnText}>Verify OTP</Text>
                </TouchableOpacity>
              </View>
            )}

            {isOtpVerified && (
              <View style={styles.verifiedBanner}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
                <Text style={styles.verifiedText}>Mobile Number Verified</Text>
              </View>
            )}

            <FormInput
              label="Email Address"
              value={formData.emailAddress}
              onChangeText={(v) => updateFormData('emailAddress', v)}
              placeholder="your@email.com"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Passport Photo */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="camera" size={20} color={COLORS.saffron} />
              <Text style={styles.sectionTitle}>Passport Size Photo</Text>
            </View>

            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => pickImage(setPassportPhoto)}
            >
              {passportPhoto ? (
                <Image source={{ uri: passportPhoto }} style={styles.uploadedImage} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={40} color={COLORS.textLight} />
                  <Text style={styles.uploadText}>Tap to upload photo</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Identity Proof */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="card" size={20} color={COLORS.saffron} />
              <Text style={styles.sectionTitle}>Identity Proof</Text>
            </View>

            <FormInput
              label="Aadhaar Card Number"
              value={formData.aadhaarNumber}
              onChangeText={(v) => updateFormData('aadhaarNumber', v)}
              placeholder="12-digit Aadhaar number"
              icon="card-outline"
              keyboardType="number-pad"
              maxLength={12}
              required
            />

            <Text style={styles.uploadLabel}>Upload Aadhaar Card (Front)</Text>
            <TouchableOpacity
              style={styles.uploadBoxSmall}
              onPress={() => pickImage(setAadhaarFront)}
            >
              {aadhaarFront ? (
                <Image source={{ uri: aadhaarFront }} style={styles.uploadedImageSmall} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={24} color={COLORS.textLight} />
                  <Text style={styles.uploadTextSmall}>Upload Front</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.uploadLabel}>Upload Aadhaar Card (Back)</Text>
            <TouchableOpacity
              style={styles.uploadBoxSmall}
              onPress={() => pickImage(setAadhaarBack)}
            >
              {aadhaarBack ? (
                <Image source={{ uri: aadhaarBack }} style={styles.uploadedImageSmall} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={24} color={COLORS.textLight} />
                  <Text style={styles.uploadTextSmall}>Upload Back</Text>
                </>
              )}
            </TouchableOpacity>

            <FormInput
              label="PAN Card Number"
              value={formData.panNumber}
              onChangeText={(v) => updateFormData('panNumber', v.toUpperCase())}
              placeholder="ABCDE1234F"
              icon="card-outline"
              maxLength={10}
              autoCapitalize="characters"
            />

            <Text style={styles.uploadLabel}>Upload PAN Card</Text>
            <TouchableOpacity
              style={styles.uploadBoxSmall}
              onPress={() => pickImage(setPanCard)}
            >
              {panCard ? (
                <Image source={{ uri: panCard }} style={styles.uploadedImageSmall} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={24} color={COLORS.textLight} />
                  <Text style={styles.uploadTextSmall}>Upload PAN</Text>
                </>
              )}
            </TouchableOpacity>

            <FormInput
              label="Voter ID Number (Optional)"
              value={formData.voterIdNumber}
              onChangeText={(v) => updateFormData('voterIdNumber', v)}
              placeholder="Voter ID number"
              icon="document-outline"
            />

            <FormInput
              label="Passport Number (Optional)"
              value={formData.passportNumber}
              onChangeText={(v) => updateFormData('passportNumber', v.toUpperCase())}
              placeholder="Passport number"
              icon="airplane-outline"
              autoCapitalize="characters"
            />
          </View>

          {/* Address Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color={COLORS.saffron} />
              <Text style={styles.sectionTitle}>Address Details</Text>
            </View>

            <FormInput
              label="Current Residential Address"
              value={formData.currentAddress}
              onChangeText={(v) => updateFormData('currentAddress', v)}
              placeholder="Enter current address"
              icon="home-outline"
              multiline
              numberOfLines={3}
            />

            <FormInput
              label="Permanent Address"
              value={formData.permanentAddress}
              onChangeText={(v) => updateFormData('permanentAddress', v)}
              placeholder="Enter permanent address"
              icon="location-outline"
              multiline
              numberOfLines={3}
            />

            <FormInput
              label="City"
              value={formData.city}
              onChangeText={(v) => updateFormData('city', v)}
              placeholder="Enter city"
              icon="business-outline"
            />

            <FormDropdown
              label="State"
              value={formData.state}
              options={INDIAN_STATES}
              onSelect={(v) => updateFormData('state', v)}
              placeholder="Select state"
            />

            <FormInput
              label="PIN Code"
              value={formData.pinCode}
              onChangeText={(v) => updateFormData('pinCode', v)}
              placeholder="6-digit PIN code"
              icon="navigate-outline"
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          {/* Other Reference */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color={COLORS.saffron} />
              <Text style={styles.sectionTitle}>Other Reference</Text>
            </View>

            <FormDropdown
              label="Select Reference"
              value={formData.otherReference}
              options={REFERENCE_NAMES}
              onSelect={(v) => updateFormData('otherReference', v)}
              placeholder="Select a reference"
              searchable
            />
          </View>

          {/* Live Photo Capture */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="camera" size={20} color={COLORS.saffron} />
              <Text style={styles.sectionTitle}>Capture Live Photo</Text>
            </View>

            <TouchableOpacity
              style={styles.cameraBox}
              onPress={() => pickImage(setLivePhoto, true)}
            >
              {livePhoto ? (
                <Image source={{ uri: livePhoto }} style={styles.capturedPhoto} />
              ) : (
                <>
                  <Ionicons name="camera" size={50} color={COLORS.saffron} />
                  <Text style={styles.cameraText}>Tap to capture live photo</Text>
                  <Text style={styles.cameraHint}>Camera will open for live capture</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <View style={styles.submitSection}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                !isOtpVerified && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isOtpVerified || isSubmitting}
            >
              <Ionicons name="paper-plane" size={20} color={COLORS.white} />
              <Text style={styles.submitButtonText}>Submit Application</Text>
            </TouchableOpacity>
            {!isOtpVerified && (
              <Text style={styles.submitHint}>
                Please verify your mobile number to submit
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  recaptchaContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    marginBottom: 0,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  otpBtn: {
    backgroundColor: COLORS.saffron,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: 4,
  },
  otpBtnSent: {
    backgroundColor: COLORS.green,
  },
  otpBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  otpSection: {
    marginTop: -SPACING.sm,
  },
  otpError: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.sm,
  },
  verifyBtn: {
    backgroundColor: COLORS.green,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  verifyBtnText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: SPACING.sm,
    borderRadius: 6,
    marginBottom: SPACING.md,
    gap: 8,
  },
  verifiedText: {
    color: COLORS.green,
    fontWeight: '600',
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  uploadBox: {
    height: 150,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  uploadBoxSmall: {
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    marginBottom: SPACING.md,
  },
  uploadText: {
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  uploadTextSmall: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadedImageSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  cameraBox: {
    height: 200,
    borderWidth: 2,
    borderColor: COLORS.saffron,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
  },
  cameraText: {
    color: COLORS.saffron,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  cameraHint: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 4,
  },
  capturedPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  submitSection: {
    padding: SPACING.lg,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitHint: {
    textAlign: 'center',
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.sm,
  },
});
