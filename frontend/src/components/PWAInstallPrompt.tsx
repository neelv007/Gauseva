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

const APP_LOGO = 'https://customer-assets.emergentagent.com/job_citizen-ref-hub/artifacts/h91vxs4b_466389831_567307805952219_3183561701720241008_n.jpg';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Check if already installed (standalone mode)
    const checkStandalone = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(standalone);
      return standalone;
    };

    if (checkStandalone()) return;

    // Check if user dismissed the prompt before
    const checkDismissed = async () => {
      const dismissed = await AsyncStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show again after 3 days
      return dismissedTime > 0 && daysSinceDismissed < 3;
    };

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      checkDismissed().then(wasDismissed => {
        if (!wasDismissed) {
          setTimeout(() => setShowPrompt(true), 2000);
        }
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // For iOS Safari - show manual instructions
    if (isIOS && isSafari) {
      checkDismissed().then(wasDismissed => {
        if (!wasDismissed) {
          setTimeout(() => setShowIOSInstructions(true), 2000);
        }
      });
    }

    // For browsers that don't support beforeinstallprompt, show after delay
    const timer = setTimeout(async () => {
      const wasDismissed = await checkDismissed();
      if (!wasDismissed && !deferredPrompt && !isIOS) {
        setShowPrompt(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show manual instructions for browsers without beforeinstallprompt
      setShowIOSInstructions(true);
      setShowPrompt(false);
    }
  };

  const handleDismiss = async () => {
    await AsyncStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
    setShowIOSInstructions(false);
  };

  if (Platform.OS !== 'web' || isStandalone) return null;

  return (
    <>
      {/* Install Prompt Banner */}
      <Modal visible={showPrompt} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.promptContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.promptContent}>
              <Image source={{ uri: APP_LOGO }} style={styles.appIcon} />
              <Text style={styles.promptTitle}>Install Gau Seva</Text>
              <Text style={styles.promptText}>
                Add this app to your home screen for a better experience - works offline and opens like a real app!
              </Text>
              
              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <Ionicons name="flash" size={20} color={COLORS.green} />
                  <Text style={styles.featureText}>Faster Access</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="cloud-offline" size={20} color={COLORS.green} />
                  <Text style={styles.featureText}>Works Offline</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="phone-portrait" size={20} color={COLORS.green} />
                  <Text style={styles.featureText}>Full Screen</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.installBtn} onPress={handleInstall}>
                <Ionicons name="download" size={20} color={COLORS.white} />
                <Text style={styles.installBtnText}>Install App</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleDismiss}>
                <Text style={styles.laterText}>Maybe Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* iOS Instructions Modal */}
      <Modal visible={showIOSInstructions} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.promptContainer}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleDismiss}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
            
            <View style={styles.promptContent}>
              <Image source={{ uri: APP_LOGO }} style={styles.appIcon} />
              <Text style={styles.promptTitle}>Install Gau Seva</Text>
              <Text style={styles.promptText}>
                To install this app on your device, follow these steps:
              </Text>
              
              <View style={styles.instructions}>
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <Text style={styles.instructionText}>
                    Tap the <Ionicons name="share-outline" size={18} color={COLORS.saffron} /> Share button in your browser
                  </Text>
                </View>
                
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <Text style={styles.instructionText}>
                    Scroll down and tap "Add to Home Screen"
                  </Text>
                </View>
                
                <View style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <Text style={styles.instructionText}>
                    Tap "Add" to install the app
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.gotItBtn} onPress={handleDismiss}>
                <Text style={styles.gotItBtnText}>Got It!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Install Button (always visible when not installed) */}
      {!showPrompt && !showIOSInstructions && (
        <TouchableOpacity 
          style={styles.floatingBtn}
          onPress={() => {
            if (deferredPrompt) {
              setShowPrompt(true);
            } else {
              setShowIOSInstructions(true);
            }
          }}
        >
          <Ionicons name="download" size={20} color={COLORS.white} />
          <Text style={styles.floatingBtnText}>Install App</Text>
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
    borderRadius: 16,
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
    fontSize: 12,
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
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.saffron,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
    gap: 8,
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
    fontSize: 14,
  },
});
