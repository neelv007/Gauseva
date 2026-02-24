import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../src/components/Header';
import { DrawerMenu } from '../src/components/DrawerMenu';
import { COLORS, SPACING } from '../src/constants/colors';

export default function GovernmentOrderPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header
        title="Government Order"
        showBack={true}
        showMenu={false}
        onBackPress={() => router.back()}
      />
      <DrawerMenu visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Page Title Banner */}
      <View style={styles.titleBanner}>
        <Text style={styles.pageTitle}>Government Order</Text>
        <Text style={styles.breadcrumb}>Home {'>'} Government Order</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Department Info Card */}
        <View style={styles.section}>
          <View style={styles.deptCard}>
            <View style={styles.deptHeader}>
              <Ionicons name="shield-checkmark" size={40} color={COLORS.saffron} />
              <View style={styles.deptInfo}>
                <Text style={styles.deptTitle}>Animal Husbandry Department</Text>
                <Text style={styles.deptSubtitle}>Government of Uttar Pradesh</Text>
              </View>
            </View>
            <Text style={styles.deptDescription}>
              Livestock rearing is common and an integral component of state agriculture 
              supporting livelihood of more than two-thirds of the rural population. Animals 
              provide nutrient-rich food products, draught power, dung as organic manure and 
              domestic fuel, hides & skin, and are a regular source of cash income for rural 
              households.
            </Text>
            <TouchableOpacity style={styles.readMoreBtn}>
              <Text style={styles.readMoreText}>READ MORE</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Useful Links */}
        <View style={styles.section}>
          <Text style={styles.linksTitle}>Useful Links</Text>
          <View style={styles.linksGrid}>
            <View style={styles.linksColumn}>
              {['Home', 'About Us', 'FAQs', 'Privacy Policy', 'Terms and Conditions'].map((link, index) => (
                <View key={index} style={styles.linkItem}>
                  <Ionicons name="star" size={14} color={COLORS.saffron} />
                  <Text style={styles.linkText}>{link}</Text>
                </View>
              ))}
            </View>
            <View style={styles.linksColumn}>
              {['Feedback', 'Disclaimer', 'Contact Us', 'Gallery', 'Publish Notice', 'Sitemap'].map((link, index) => (
                <View key={index} style={styles.linkItem}>
                  <Ionicons name="star" size={14} color={COLORS.saffron} />
                  <Text style={styles.linkText}>{link}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Register Complaint */}
        <View style={styles.complaintSection}>
          <Ionicons name="create" size={32} color={COLORS.white} />
          <Text style={styles.complaintTitle}>Register Your Complaint</Text>
          <Text style={styles.complaintText}>Here you can report an issues and make requests.</Text>
          <TouchableOpacity style={styles.reportBtn}>
            <Text style={styles.reportBtnText}>REPORT NOW</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Scan This QR Code to Download Mobile App</Text>
          <View style={styles.qrPlaceholder}>
            <Ionicons name="qr-code" size={120} color={COLORS.textPrimary} />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            पशुधन समस्या निवारण केंद्र टोल फ्री नंबर : 1800-180-5141
          </Text>
          <Text style={styles.copyright}>
            © 2024 Animal Husbandry Department, Government of Uttar Pradesh
          </Text>
          <Text style={styles.visitorCount}>Visitors: 1,078,063</Text>
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
  titleBanner: {
    backgroundColor: COLORS.saffron,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  pageTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  breadcrumb: {
    color: COLORS.white,
    opacity: 0.9,
    fontSize: 12,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  deptCard: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  deptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  deptInfo: {
    marginLeft: SPACING.md,
  },
  deptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  deptSubtitle: {
    fontSize: 14,
    color: COLORS.saffron,
  },
  deptDescription: {
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontSize: 14,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: SPACING.md,
    gap: 8,
  },
  readMoreText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  linksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  linksGrid: {
    flexDirection: 'row',
  },
  linksColumn: {
    flex: 1,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: 8,
  },
  linkText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  complaintSection: {
    backgroundColor: '#E74C3C',
    padding: SPACING.xl,
    alignItems: 'center',
  },
  complaintTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SPACING.sm,
  },
  complaintText: {
    color: COLORS.white,
    opacity: 0.9,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  reportBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: 4,
    marginTop: SPACING.md,
  },
  reportBtnText: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  qrSection: {
    backgroundColor: '#E74C3C',
    padding: SPACING.lg,
    alignItems: 'center',
  },
  qrTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  qrPlaceholder: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 8,
  },
  footer: {
    backgroundColor: '#2C3E50',
    padding: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: 'center',
  },
  copyright: {
    color: COLORS.white,
    opacity: 0.7,
    fontSize: 11,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  visitorCount: {
    color: COLORS.white,
    opacity: 0.7,
    fontSize: 11,
    marginTop: SPACING.xs,
  },
});
