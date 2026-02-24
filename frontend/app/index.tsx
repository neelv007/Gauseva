import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../src/components/Header';
import { DrawerMenu } from '../src/components/DrawerMenu';
import { COLORS, SPACING } from '../src/constants/colors';

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Header onMenuPress={() => setIsDrawerOpen(true)} />
      <DrawerMenu visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: 'https://customer-assets.emergentagent.com/job_citizen-ref-hub/artifacts/5uya9kaw_gau3.webp' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTextHindi}>
              गावो भक्तो गाव इंद्रो...
            </Text>
            <Text style={styles.heroTextEnglish}>
              Livestock is the backbone of rural economy
            </Text>
          </View>
        </View>

        {/* About Us Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBar} />
            <Text style={styles.sectionTitle}>About Us</Text>
          </View>
          <Text style={styles.quoteHindi}>
            "गावो भक्तो गाव इंद्रो मे अच्छानगाव: सोमस्य प्रथमस्य भक्ष:"
          </Text>
          <Text style={styles.aboutText}>
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

        {/* Leadership Section */}
        <View style={styles.section}>
          <View style={styles.leadershipContainer}>
            <View style={styles.leaderCard}>
              <View style={styles.leaderImageContainer}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Yogi_Adityanath_official_portrait.jpg/220px-Yogi_Adityanath_official_portrait.jpg' }}
                  style={styles.leaderImage}
                />
                <View style={styles.tricolorBorder}>
                  <View style={[styles.colorBar, { backgroundColor: COLORS.saffron }]} />
                  <View style={[styles.colorBar, { backgroundColor: COLORS.white }]} />
                  <View style={[styles.colorBar, { backgroundColor: COLORS.green }]} />
                </View>
              </View>
              <Text style={styles.leaderName}>Yogi Adityanath</Text>
              <Text style={styles.leaderTitle}>Hon'ble Chief Minister</Text>
              <Text style={styles.leaderSubtitle}>Uttar Pradesh</Text>
            </View>

            <View style={styles.leaderCard}>
              <View style={styles.leaderImageContainer}>
                <Image
                  source={{ uri: 'https://pbs.twimg.com/profile_images/1597607316193480706/NvQJBCVh_400x400.jpg' }}
                  style={styles.leaderImage}
                />
                <View style={styles.tricolorBorder}>
                  <View style={[styles.colorBar, { backgroundColor: COLORS.saffron }]} />
                  <View style={[styles.colorBar, { backgroundColor: COLORS.white }]} />
                  <View style={[styles.colorBar, { backgroundColor: COLORS.green }]} />
                </View>
              </View>
              <Text style={styles.leaderName}>Shri Dharmpal Singh</Text>
              <Text style={styles.leaderTitle}>Hon'ble Minister</Text>
              <Text style={styles.leaderSubtitle}>Animal Husbandry</Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={[styles.section, styles.featuresSection]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionTitleBar, { backgroundColor: COLORS.white }]} />
            <Text style={[styles.sectionTitle, { color: COLORS.white }]}>Features at a Glance</Text>
          </View>
          <View style={styles.featuresGrid}>
            {[
              { icon: 'business', label: 'Infrastructure Management' },
              { icon: 'paw', label: 'Govansh Management' },
              { icon: 'wallet', label: 'Fund Management' },
              { icon: 'search', label: 'Inspection' },
              { icon: 'cube', label: 'Inventory Management' },
              { icon: 'server', label: 'Master Data' },
              { icon: 'document-text', label: 'Reports' },
              { icon: 'medkit', label: 'Govansh Health Check Up' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name={feature.icon as any} size={24} color={COLORS.white} />
                <Text style={styles.featureLabel}>{feature.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements Section */}
        <View style={[styles.section, styles.achievementsSection]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionTitleBar, { backgroundColor: COLORS.white }]} />
            <Text style={[styles.sectionTitle, { color: COLORS.white }]}>Achievements</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="paw" size={32} color={COLORS.saffron} />
              <Text style={styles.statNumber}>1239.02K</Text>
              <Text style={styles.statLabel}>Total Govansh</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="home" size={32} color={COLORS.saffron} />
              <Text style={styles.statNumber}>7.45K</Text>
              <Text style={styles.statLabel}>Go-Ashray Sthal</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="leaf" size={32} color={COLORS.green} />
              <Text style={styles.statNumber}>4.91K</Text>
              <Text style={styles.statLabel}>Gochar Land (Hect.)</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people" size={32} color={COLORS.green} />
              <Text style={styles.statNumber}>114.06K</Text>
              <Text style={styles.statLabel}>No. of Sahbhagi</Text>
            </View>
          </View>
        </View>

        {/* Important Links */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBar} />
            <Text style={styles.sectionTitle}>Important Links</Text>
          </View>
          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="leaf" size={32} color={COLORS.green} />
            <Text style={styles.linkText}>Department of Agriculture & Farmers Welfare</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        </View>

        {/* Useful Links */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBar} />
            <Text style={styles.sectionTitle}>Useful Links</Text>
          </View>
          <View style={styles.usefulLinksGrid}>
            {['Home', 'About Us', 'FAQs', 'Privacy Policy', 'Terms and Conditions', 
              'Feedback', 'Disclaimer', 'Contact Us', 'Gallery', 'Sitemap'].map((link, index) => (
              <TouchableOpacity key={index} style={styles.usefulLinkItem}>
                <Ionicons name="star" size={14} color={COLORS.saffron} />
                <Text style={styles.usefulLinkText}>{link}</Text>
              </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  heroBanner: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  heroTextHindi: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroTextEnglish: {
    color: COLORS.white,
    fontSize: 14,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
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
  quoteHindi: {
    fontStyle: 'italic',
    color: COLORS.saffron,
    marginBottom: SPACING.sm,
    fontSize: 14,
  },
  aboutText: {
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
  leadershipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  leaderCard: {
    alignItems: 'center',
    width: '45%',
  },
  leaderImageContainer: {
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  leaderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.border,
  },
  tricolorBorder: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    marginLeft: -30,
    flexDirection: 'row',
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  colorBar: {
    flex: 1,
  },
  leaderName: {
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    fontSize: 14,
    textAlign: 'center',
  },
  leaderTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  leaderSubtitle: {
    color: COLORS.textLight,
    fontSize: 11,
    textAlign: 'center',
  },
  featuresSection: {
    backgroundColor: COLORS.saffron,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: 8,
  },
  featureLabel: {
    color: COLORS.white,
    fontSize: 12,
    flex: 1,
  },
  achievementsSection: {
    backgroundColor: COLORS.navy,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
  },
  statNumber: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
  },
  statLabel: {
    color: COLORS.white,
    fontSize: 11,
    opacity: 0.9,
    textAlign: 'center',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    gap: 12,
  },
  linkText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  usefulLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  usefulLinkItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    gap: 6,
  },
  usefulLinkText: {
    color: COLORS.textSecondary,
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
