import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

const APP_LOGO = require('../../assets/images/gau-seva-logo.jpg');

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: 'home-outline', route: '/' },
  { id: 'about', label: 'About Us', icon: 'information-circle-outline', route: '/about' },
  { id: 'go', label: 'G.O.', icon: 'document-text-outline', route: '/government-order' },
  { id: 'contact', label: 'Contact Us', icon: 'call-outline', route: '/contact' },
];

export const DrawerMenu: React.FC<DrawerMenuProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuthStore();

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleLogin = () => {
    onClose();
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    router.replace('/');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.drawer, { paddingTop: insets.top }]}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.logoContainer}>
              <Image source={APP_LOGO} style={styles.drawerLogo} />
            </View>
            <Text style={styles.drawerTitle}>Gau Seva</Text>
            <Text style={styles.drawerSubtitle}>Government of Uttar Pradesh</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleNavigation(item.route)}
              >
                <Ionicons name={item.icon as any} size={24} color={COLORS.navy} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            ))}

            {/* Login/Dashboard Button */}
            <TouchableOpacity style={styles.menuItem} onPress={handleLogin}>
              <Ionicons
                name={isLoggedIn ? 'person-outline' : 'log-in-outline'}
                size={24}
                color={COLORS.green}
              />
              <Text style={[styles.menuLabel, { color: COLORS.green }]}>
                {isLoggedIn ? 'Dashboard' : 'Login'}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            {/* Logout Button - Only show if logged in */}
            {isLoggedIn && (
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
                <Text style={[styles.menuLabel, { color: COLORS.error }]}>Logout</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Toll Free: 1800-180-5141</Text>
            <Text style={styles.footerText}>© 2024 Animal Husbandry Dept.</Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    flexDirection: 'row',
  },
  drawer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: COLORS.white,
    height: '100%',
  },
  drawerHeader: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  drawerLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navy,
    marginTop: SPACING.xs,
  },
  drawerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    padding: SPACING.xs,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
