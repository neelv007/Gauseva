import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title?: string;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  showBack?: boolean;
  showMenu?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onMenuPress,
  onBackPress,
  showBack = false,
  showMenu = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Government Banner */}
      <View style={styles.topBanner}>
        <Text style={styles.bannerTextHindi}>उत्तर प्रदेश सरकार</Text>
        <Text style={styles.bannerTextEnglish}>GOVERNMENT OF UTTAR PRADESH</Text>
      </View>

      {/* Main Header */}
      <View style={styles.mainHeader}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        ) : showMenu ? (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
            <Ionicons name="menu" size={28} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconButton} />
        )}

        <View style={styles.titleContainer}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.white} />
          <Text style={styles.title}>{title || 'Animal Husbandry Dept.'}</Text>
        </View>

        <View style={styles.iconButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.saffron,
  },
  topBanner: {
    backgroundColor: COLORS.saffronDark,
    paddingVertical: 4,
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTextHindi: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  bannerTextEnglish: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '500',
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
