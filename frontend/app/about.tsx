import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../src/components/Header';
import { DrawerMenu } from '../src/components/DrawerMenu';
import { COLORS, SPACING } from '../src/constants/colors';

export default function AboutPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header
        title="About Us"
        showBack={true}
        showMenu={false}
        onBackPress={() => router.back()}
      />
      <DrawerMenu visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Page Title Banner */}
      <View style={styles.titleBanner}>
        <Text style={styles.pageTitle}>About Us</Text>
        <Text style={styles.breadcrumb}>Home {'>'} About Us</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Content Section */}
        <View style={styles.section}>
          <Text style={styles.quoteHindi}>
            "गावो भक्तो गाव इंद्रो मे अच्छानगाव: सोमस्य प्रथमस्य भक्ष:"
          </Text>
          <Text style={styles.quoteEnglish}>
            "Cows are auspicious, cows are as powerful as Indra, and they are the first to partake of Soma."
          </Text>

          <Text style={styles.paragraph}>
            Livestock rearing is common and an integral component of state agriculture 
            supporting livelihood of more than two-thirds of the rural population. Animals 
            provide nutrient-rich food products, draught power, dung as organic manure and 
            domestic fuel, hides & skin, and are a regular source of cash income for rural 
            households.
          </Text>

          <Text style={styles.paragraph}>
            The Animal Husbandry Department plays a pivotal role in the economic development 
            of the state by providing various services for livestock health, breeding improvement, 
            and overall animal welfare. The department is committed to enhancing livestock 
            productivity through modern scientific practices and technologies.
          </Text>

          {/* Image Banner */}
          <View style={styles.imageBanner}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800' }}
              style={styles.bannerImage}
            />
          </View>

          <Text style={styles.paragraph}>
            The department focuses on:
          </Text>

          <View style={styles.bulletPoints}>
            {[
              'Cattle breeding and genetic improvement',
              'Veterinary healthcare services',
              'Livestock insurance schemes',
              'Fodder development programs',
              'Dairy development initiatives',
              'Poultry and small animal farming',
              'Protection of indigenous breeds',
              'Go-Ashray Sthal management',
            ].map((point, index) => (
              <View key={index} style={styles.bulletItem}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.green} />
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* G.O. Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBar} />
            <Text style={styles.sectionTitle}>G.O.</Text>
          </View>
          <View style={styles.goCard}>
            <Text style={styles.goNumber}>1</Text>
            <View style={styles.goContent}>
              <Text style={styles.goTitle}>
                Behavioural Psychology Techniques For Government Scheme Compliance
              </Text>
              <Text style={styles.goSubtitle}>
                12 March 2024 - Directive 7883
              </Text>
              <Text style={styles.goDescription}>Department Scheme Guidance</Text>
            </View>
            <Ionicons name="document-text" size={24} color={COLORS.saffron} />
          </View>
        </View>

        {/* Circulars Table */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBar} />
            <Text style={styles.sectionTitle}>Circulars</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: 40 }]}>S.N.</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Subject</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Description</Text>
              <Text style={[styles.tableHeaderCell, { width: 80 }]}>View</Text>
            </View>
            {[
              { subject: 'BANKGAUSATHI', description: 'GAUSATHI BANK DETAILS 10 AUG' },
              { subject: 'ARYANDEEPKA', description: 'REGARDING ARYA DEEPKA' },
              { subject: 'GOVFTR-TIR', description: 'REGARDING CATTLE TRANSPORTATION' },
              { subject: 'ANIMAL-Q', description: 'QUESTION ABOUT ANIMAL HEALTH' },
              { subject: 'BAAGWAANI2', description: 'REGARDING HORTICULTURE' },
              { subject: 'GOVGAUSHALLA', description: 'REGARDING GAUSHALA' },
              { subject: 'MONTHLYREPORT', description: 'MONTHLY PROGRESS REPORT' },
              { subject: 'PRWSH', description: 'REGARDING WATER SUPPLY' },
            ].map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: 40 }]}>{index + 1}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{row.subject}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{row.description}</Text>
                <View style={[styles.tableCell, { width: 80 }]}>
                  <Ionicons name="eye" size={18} color={COLORS.navy} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer Info */}
        <View style={styles.footerSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={40} color={COLORS.saffron} />
          </View>
          <Text style={styles.footerTitle}>Animal Husbandry Department</Text>
          <Text style={styles.footerSubtitle}>Government of Uttar Pradesh</Text>
          <Text style={styles.footerDescription}>
            Livestock rearing is common and an integral component of state agriculture 
            supporting livelihood of more than two-thirds of the rural population.
          </Text>
        </View>

        {/* Useful Links Footer */}
        <View style={styles.linksFooter}>
          <Text style={styles.linksTitle}>Useful Links</Text>
          <View style={styles.linksGrid}>
            {['Home', 'About Us', 'FAQs', 'Privacy Policy', 'Terms and Conditions'].map((link, index) => (
              <View key={index} style={styles.linkItem}>
                <Ionicons name="star" size={12} color={COLORS.saffron} />
                <Text style={styles.linkText}>{link}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Footer */}
        <View style={styles.bottomFooter}>
          <Text style={styles.tollFree}>
            पशुधन समस्या निवारण केंद्र टोल फ्री नंबर : 1800-180-5141
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
  quoteHindi: {
    fontStyle: 'italic',
    color: COLORS.saffron,
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  quoteEnglish: {
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: SPACING.md,
  },
  paragraph: {
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  imageBanner: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: SPACING.md,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bulletPoints: {
    marginTop: SPACING.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: 10,
  },
  bulletText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitleBar: {
    width: 4,
    height: 24,
    backgroundColor: COLORS.green,
    marginRight: SPACING.sm,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  goCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.saffron,
  },
  goNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginRight: SPACING.md,
  },
  goContent: {
    flex: 1,
  },
  goTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  goSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  goDescription: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.navy,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  tableHeaderCell: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 11,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  footerSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  footerSubtitle: {
    fontSize: 14,
    color: COLORS.saffron,
    marginTop: 2,
  },
  footerDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 20,
  },
  linksFooter: {
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
  bottomFooter: {
    backgroundColor: '#E74C3C',
    padding: SPACING.lg,
    alignItems: 'center',
  },
  tollFree: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
