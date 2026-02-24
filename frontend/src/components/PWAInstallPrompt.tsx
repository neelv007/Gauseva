import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../constants/colors';

const APP_LOGO = require('../../assets/images/gau-seva-logo.jpg');

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;

    // Check if already installed (standalone mode)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
      return isStandaloneMode;
    };

    if (checkStandalone()) return;

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check if user dismissed the prompt before
    const checkDismissed = async () => {
      try {
        const dismissed = await AsyncStorage.getItem('pwa-install-dismissed');
        const dismissedTime = dismissed ? parseInt(dismissed) : 0;
        const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
        return dismissedTime > 0 && daysSinceDismissed < 3;
      } catch {
        return false;
      }
    };

    // Listen for beforeinstallprompt (Chrome on Android)
    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e);
      
      checkDismissed().then(wasDismissed => {
        if (!wasDismissed) {
          setTimeout(() => setShowPrompt(true), 2000);
        }
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall as any);

    // Don't auto-show manual instructions - let the floating button handle it
    // This prevents the modal from blocking the UI on every page load

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as any);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      console.log('Triggering install prompt...');
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('User choice:', outcome);
        if (outcome === 'accepted') {
          setShowPrompt(false);
          setDeferredPrompt(null);
        }
      } catch (error) {
        console.error('Install error:', error);
      }
    } else {
      // Show manual instructions
      setShowManualInstructions(true);
      setShowPrompt(false);
    }
  };

  const handleDismiss = async () => {
    try {
      await AsyncStorage.setItem('pwa-install-dismissed', Date.now().toString());
    } catch {}
    setShowPrompt(false);
    setShowManualInstructions(false);
  };

  if (Platform.OS !== 'web' || isStandalone) return null;

  // Manual Instructions Content (for iOS or fallback)
  const ManualInstructionsContent = () => (
    <View style={styles.promptContent}>
      <Image source={APP_LOGO} style={styles.appIcon} />
      <Text style={styles.promptTitle}>Install Gau Seva</Text>
      <Text style={styles.promptText}>
        Add this app to your home screen for quick access:
      </Text>
      
      <View style={styles.instructions}>
        {isIOS ? (
          // iOS Safari Instructions
          <>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionText}>
                  Tap the Share button
                </Text>
                <Ionicons name="share-outline" size={24} color={COLORS.saffron} />
              </View>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Scroll and tap "Add to Home Screen"
              </Text>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Tap "Add" in the top right
              </Text>
            </View>
          </>
        ) : (
          // Android Chrome Instructions
          <>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionText}>
                  Tap the menu button
                </Text>
                <Ionicons name="ellipsis-vertical" size={24} color={COLORS.saffron} />
              </View>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionText}>
                  Tap "Install app" or "Add to Home screen"
                </Text>
                <Ionicons name="download-outline" size={24} color={COLORS.saffron} />
              </View>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.instructionText}>
                Tap "Install" to confirm
              </Text>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.gotItBtn} onPress={handleDismiss}>
        <Text style={styles.gotItBtnText}>Got It!</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {/* Native Install Prompt (when beforeinstallprompt is available) */}
      <Modal visible={showPrompt && deferredPrompt !== null} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.promptContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.promptContent}>
              <Image source={APP_LOGO} style={styles.appIcon} />
              <Text style={styles.promptTitle}>Install Gau Seva</Text>
              <Text style={styles.promptText}>
                Install this app on your device for the best experience - faster access, works offline, and no browser bar!
              </Text>
              
              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <Ionicons name="flash" size={20} color={COLORS.green} />
                  <Text style={styles.featureText}>Faster</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="cloud-offline" size={20} color={COLORS.green} />
                  <Text style={styles.featureText}>Offline</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="phone-portrait" size={20} color={COLORS.green} />
                  <Text style={styles.featureText}>Full Screen</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="notifications" size={20} color={COLORS.green} />
                  <Text style={styles.featureText}>Alerts</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.installBtn} onPress={handleInstall}>
                <Ionicons name="download" size={20} color={COLORS.white} />
                <Text style={styles.installBtnText}>Install Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleDismiss}>
                <Text style={styles.laterText}>Not Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Manual Instructions Modal (for iOS or browsers without beforeinstallprompt) */}
      <Modal visible={showManualInstructions || (showPrompt && deferredPrompt === null)} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.promptContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
            <ManualInstructionsContent />
          </View>
        </View>
      </Modal>

      {/* Floating Install Button */}
      {!showPrompt && !showManualInstructions && (
        <TouchableOpacity 
          style={styles.floatingBtn}
          onPress={() => {
            if (deferredPrompt) {
              setShowPrompt(true);
            } else {
              setShowManualInstructions(true);
            }
          }}
        >
          <Ionicons name="download" size={18} color={COLORS.white} />
          <Text style={styles.floatingBtnText}>Install</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  promptContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl + 20,
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 1,
    padding: 8,
  },
  promptContent: {
    alignItems: 'center',
    paddingTop: SPACING.md,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.saffron,
  },
  promptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  promptText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    lineHeight: 22,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  installBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    width: '100%',
    gap: 8,
    marginBottom: SPACING.md,
  },
  installBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  laterText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: SPACING.sm,
  },
  instructions: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  instructionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.saffron,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  gotItBtn: {
    backgroundColor: COLORS.saffron,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    width: '100%',
  },
  gotItBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 25,
    gap: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  floatingBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
