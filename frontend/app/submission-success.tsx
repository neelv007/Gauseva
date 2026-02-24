import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../src/components/Header';
import { COLORS, SPACING } from '../src/constants/colors';

export default function SubmissionSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(90); // 1 minute 30 seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Header
        title="Submission Successful"
        showBack={false}
        showMenu={false}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIconCircle}>
            <Ionicons name="checkmark" size={60} color={COLORS.white} />
          </View>
        </View>

        {/* Success Message */}
        <View style={styles.messageCard}>
          <Text style={styles.congratsText}>Congratulations!</Text>
          <Text style={styles.successTitle}>Form Submitted Successfully</Text>

          {/* Reference Number */}
          <View style={styles.referenceBox}>
            <Text style={styles.referenceLabel}>Reference Number</Text>
            <Text style={styles.referenceNumber}>#5443009</Text>
          </View>

          {/* Confirmation Message */}
          <View style={styles.confirmationBox}>
            <Ionicons name="information-circle" size={24} color={COLORS.saffron} />
            <Text style={styles.confirmationText}>
              Your form with reference number{' '}
              <Text style={styles.highlight}>#5443009</Text> has been submitted and
              result may get listed in any of this upcoming lists:
            </Text>
          </View>

          {/* Upcoming Dates */}
          <View style={styles.datesContainer}>
            <View style={styles.dateItem}>
              <Ionicons name="calendar" size={20} color={COLORS.navy} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateText}>18th of March 2026</Text>
                <Text style={styles.locationText}>Lucknow D/O Office</Text>
              </View>
            </View>

            <View style={styles.dateItem}>
              <Ionicons name="calendar" size={20} color={COLORS.navy} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateText}>26th of March 2026</Text>
                <Text style={styles.locationText}>Gorakhpur D/O Office</Text>
              </View>
            </View>

            <View style={styles.dateItem}>
              <Ionicons name="calendar" size={20} color={COLORS.navy} />
              <View style={styles.dateInfo}>
                <Text style={styles.dateText}>7th of April 2026</Text>
                <Text style={styles.locationText}>Lucknow D/O Office</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Countdown Timer */}
        <View style={styles.countdownCard}>
          <Ionicons name="time" size={24} color={COLORS.saffron} />
          <Text style={styles.countdownLabel}>Auto redirecting to Dashboard in</Text>
          <View style={styles.timerBox}>
            <Text style={styles.timerText}>{formatTime(countdown)}</Text>
          </View>
          <Text style={styles.countdownHint}>
            You will be automatically redirected to your dashboard
          </Text>
        </View>

        {/* Additional Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.green} />
            <Text style={styles.infoText}>Your application has been recorded</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.green} />
            <Text style={styles.infoText}>You will be notified of any updates</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.green} />
            <Text style={styles.infoText}>Your data is securely stored</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Toll Free: 1800-180-5141</Text>
          <Text style={styles.footerCopyright}>
            © 2024 Animal Husbandry Department
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  messageCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  congratsText: {
    fontSize: 14,
    color: COLORS.green,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  referenceBox: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  referenceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  referenceNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.saffron,
  },
  confirmationBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.lg,
    gap: 10,
  },
  confirmationText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 'bold',
    color: COLORS.saffron,
  },
  datesContainer: {
    gap: SPACING.sm,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.saffron,
    gap: 12,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  countdownCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  countdownLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  timerBox: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    fontVariant: ['tabular-nums'],
  },
  countdownHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  footerCopyright: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 4,
  },
});
