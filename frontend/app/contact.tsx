import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../src/components/Header';
import { DrawerMenu } from '../src/components/DrawerMenu';
import { COLORS, SPACING } from '../src/constants/colors';

export default function ContactPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header
        title="Contact Us"
        showBack={true}
        showMenu={false}
        onBackPress={() => router.back()}
      />
      <DrawerMenu visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Page Title Banner */}
      <View style={styles.titleBanner}>
        <Text style={styles.pageTitle}>Contact Us</Text>
        <Text style={styles.breadcrumb}>Home {'>'} Contact Us</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Request Contact Form */}
        <View style={styles.section}>
          <Text style={styles.formTitle}>Request Contact</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={18} color={COLORS.saffron} />
              <TextInput
                style={styles.input}
                placeholder="ENTER YOUR FULL NAME"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your E-Mail Id</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={18} color={COLORS.saffron} />
              <TextInput
                style={styles.input}
                placeholder="EMAILID@EXAMPLE.COM"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Your District</Text>
            <TouchableOpacity style={styles.selectContainer}>
              <Text style={styles.selectPlaceholder}>-- SELECT --</Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Contact Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={18} color={COLORS.saffron} />
              <TextInput
                style={styles.input}
                placeholder="ENTER YOUR CONTACT NUMBER"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Your Query</Text>
            <TouchableOpacity style={styles.selectContainer}>
              <Text style={styles.selectPlaceholder}>ANTUKH ZILE ME KITNE GOAASHRAYA STHAL HAI</Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitBtn}>
            <Ionicons name="paper-plane" size={18} color={COLORS.white} />
            <Text style={styles.submitBtnText}>Submit Your Query</Text>
          </TouchableOpacity>
        </View>

        {/* Get In Touch Section */}
        <View style={styles.section}>
          <Text style={styles.touchTitle}>Get In Touch !</Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="location" size={20} color={COLORS.saffron} />
            <Text style={styles.contactText}>
              Animal Husbandry Department, Badshah bagh, Lucknow, U.P.
            </Text>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={COLORS.saffron} />
            <Text style={styles.contactText}>
              dir-ah.up@nic.in, cgmuitcell@gmail.com
            </Text>
          </View>

          <TouchableOpacity style={styles.accordionItem}>
            <Text style={styles.accordionTitle}>ADDITIONAL DIRECTORS (GR. II)</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accordionItem}>
            <Text style={styles.accordionTitle}>CHIEF VETERINARY OFFICERS</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapSection}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={60} color={COLORS.textLight} />
            <Text style={styles.mapText}>Animal Husbandry Directorate</Text>
            <Text style={styles.mapSubtext}>Badshah Bagh, Lucknow</Text>
          </View>
        </View>

        {/* Department Info */}
        <View style={styles.section}>
          <View style={styles.deptCard}>
            <Ionicons name="shield-checkmark" size={40} color={COLORS.saffron} />
            <View style={styles.deptInfo}>
              <Text style={styles.deptTitle}>Animal Husbandry Department</Text>
              <Text style={styles.deptSubtitle}>Government of Uttar Pradesh</Text>
            </View>
          </View>
          <Text style={styles.deptDescription}>
            Livestock rearing is common and an integral component of state agriculture 
            supporting livelihood of more than two-thirds of the rural population. Animals 
            provide nutrient-rich food products, draught power, dung as organic manure.
          </Text>
          <TouchableOpacity style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>READ MORE</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Useful Links */}
        <View style={styles.linksSection}>
          <Text style={styles.linksTitle}>Useful Links</Text>
          <View style={styles.linksGrid}>
            {['Home', 'About Us', 'FAQs', 'Privacy Policy', 'Terms and Conditions', 
              'Feedback', 'Disclaimer', 'Contact Us', 'Gallery', 'Sitemap'].map((link, index) => (
              <View key={index} style={styles.linkItem}>
                <Ionicons name="star" size={12} color={COLORS.saffron} />
                <Text style={styles.linkText}>{link}</Text>
              </View>
            ))}
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

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            पशुधन समस्या निवारण केंद्र टोल फ्री नंबर : 1800-180-5141
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
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: 14,
    color: '#E74C3C',
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.sm,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  selectPlaceholder: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
    paddingVertical: SPACING.md,
    borderRadius: 4,
    marginTop: SPACING.md,
    gap: 8,
  },
  submitBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  touchTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    gap: 10,
  },
  contactText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  accordionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    padding: SPACING.md,
    borderRadius: 4,
    marginTop: SPACING.sm,
  },
  accordionTitle: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  mapSection: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  mapSubtext: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  deptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  deptInfo: {
    marginLeft: SPACING.md,
  },
  deptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  deptSubtitle: {
    fontSize: 13,
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
  linksSection: {
    backgroundColor: '#2C3E50',
    padding: SPACING.lg,
  },
  linksTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: SPACING.sm,
    gap: 6,
  },
  linkText: {
    color: COLORS.white,
    fontSize: 13,
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
  footer: {
    backgroundColor: '#E74C3C',
    padding: SPACING.lg,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  visitorCount: {
    color: COLORS.white,
    opacity: 0.9,
    fontSize: 12,
    marginTop: SPACING.xs,
  },
});
