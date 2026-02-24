import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../src/components/Header';
import { DrawerMenu } from '../src/components/DrawerMenu';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import { COLORS, SPACING } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';
import { USER_PROFILE, ACTIVITY_DATA } from '../src/constants/data';

export default function DashboardPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const { isLoggedIn, isLoading, logout } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, isLoading]);

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Profile Dashboard"
        onMenuPress={() => setIsDrawerOpen(true)}
      />
      <DrawerMenu visible={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: USER_PROFILE.photoUrl }}
                style={styles.profileImage}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.green} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{USER_PROFILE.name}</Text>
              <View style={styles.profileDetail}>
                <Ionicons name="call-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.profileDetailText}>{USER_PROFILE.phone}</Text>
              </View>
              <View style={styles.profileDetail}>
                <Ionicons name="card-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.profileDetailText}>Ward: {USER_PROFILE.wardNumber}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="person-outline" size={20} color={COLORS.navy} />
              <Text style={styles.actionBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.logoutBtn]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={[styles.actionBtnText, { color: COLORS.error }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity List Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBar} />
            <Text style={styles.sectionTitle}>Activity List</Text>
          </View>

          {/* Activity Table */}
          <View style={styles.tableContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { width: 40 }]}>S.N.</Text>
                  <Text style={[styles.tableHeaderCell, { width: 140 }]}>Location</Text>
                  <Text style={[styles.tableHeaderCell, { width: 70 }]}>Status</Text>
                  <Text style={[styles.tableHeaderCell, { width: 60 }]}>Pics</Text>
                  <Text style={[styles.tableHeaderCell, { width: 70 }]}>Verified</Text>
                  <Text style={[styles.tableHeaderCell, { width: 120 }]}>Handler</Text>
                </View>

                {/* Table Rows */}
                {ACTIVITY_DATA.slice(0, 15).map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 && styles.tableRowEven,
                    ]}
                  >
                    <Text style={[styles.tableCell, { width: 40 }]}>{index + 1}</Text>
                    <Text style={[styles.tableCell, { width: 140 }]} numberOfLines={1}>
                      {item.location}
                    </Text>
                    <View style={[styles.tableCell, { width: 70 }]}>
                      <View
                        style={[
                          styles.statusBadge,
                          item.operation === 'Open'
                            ? styles.statusOpen
                            : styles.statusClosed,
                        ]}
                      >
                        <Text style={styles.statusText}>{item.operation}</Text>
                      </View>
                    </View>
                    <Text style={[styles.tableCell, { width: 60, textAlign: 'center' }]}>
                      {item.pictureSubmitted}
                    </Text>
                    <View style={[styles.tableCell, { width: 70, alignItems: 'center' }]}>
                      <Ionicons
                        name={item.verified ? 'checkmark-circle' : 'close-circle'}
                        size={18}
                        color={item.verified ? COLORS.green : COLORS.error}
                      />
                    </View>
                    <Text style={[styles.tableCell, { width: 120 }]} numberOfLines={1}>
                      {item.handler}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Show More */}
          <TouchableOpacity style={styles.showMoreBtn}>
            <Text style={styles.showMoreText}>View All Activities ({ACTIVITY_DATA.length})</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.navy} />
          </TouchableOpacity>
        </View>

        {/* Reference Enabled Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.referenceButton}
            onPress={() => router.push('/reference-form')}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.white} />
            <Text style={styles.referenceButtonText}>Reference Enabled</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.referenceHint}>
            Click here to submit a new reference application
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="document-text" size={28} color={COLORS.saffron} />
            <Text style={styles.statNumber}>{ACTIVITY_DATA.length}</Text>
            <Text style={styles.statLabel}>Total Activities</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={28} color={COLORS.green} />
            <Text style={styles.statNumber}>
              {ACTIVITY_DATA.filter((a) => a.operation === 'Open').length}
            </Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="close-circle" size={28} color={COLORS.error} />
            <Text style={styles.statNumber}>
              {ACTIVITY_DATA.filter((a) => a.operation === 'Closed').length}
            </Text>
            <Text style={styles.statLabel}>Closed</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
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
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: 12,
    padding: SPACING.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.border,
    borderWidth: 3,
    borderColor: COLORS.saffron,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  profileDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  profileDetailText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    gap: 6,
  },
  logoutBtn: {
    backgroundColor: '#FFEBEE',
  },
  actionBtnText: {
    color: COLORS.navy,
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 12,
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitleBar: {
    width: 4,
    height: 20,
    backgroundColor: COLORS.green,
    marginRight: SPACING.sm,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  tableContainer: {
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
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  tableRowEven: {
    backgroundColor: COLORS.background,
  },
  tableCell: {
    fontSize: 11,
    color: COLORS.textPrimary,
    paddingHorizontal: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusOpen: {
    backgroundColor: '#E8F5E9',
  },
  statusClosed: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginTop: SPACING.sm,
    gap: 4,
  },
  showMoreText: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '600',
  },
  referenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    gap: 8,
  },
  referenceButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  referenceHint: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: SPACING.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  footer: {
    backgroundColor: COLORS.saffron,
    padding: SPACING.lg,
    margin: SPACING.md,
    marginTop: 0,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.white,
    fontSize: 13,
    textAlign: 'center',
  },
});
