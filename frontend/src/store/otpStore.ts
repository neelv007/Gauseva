import { create } from 'zustand';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA187Afuc9o8ArJo1K7Vp63uTtJ5GbW6E8",
  authDomain: "gauseva-54908.firebaseapp.com",
  projectId: "gauseva-54908",
  storageBucket: "gauseva-54908.firebasestorage.app",
  messagingSenderId: "231543168525",
  appId: "1:231543168525:web:a2a156bdf9635c45f7bf44"
};

// Initialize Firebase only if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);

interface OTPState {
  isOtpSent: boolean;
  isOtpVerified: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumber: string;
  confirmationResult: ConfirmationResult | null;
  verificationId: string | null;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetOtp: () => void;
}

// For demo/testing purposes when Firebase phone auth doesn't work on web
const DEMO_MODE = true; // Set to false when using on actual mobile device with proper Firebase setup
const DEMO_OTP = '123456';

export const useOTPStore = create<OTPState>((set, get) => ({
  isOtpSent: false,
  isOtpVerified: false,
  isLoading: false,
  error: null,
  phoneNumber: '',
  confirmationResult: null,
  verificationId: null,

  sendOtp: async (phoneNumber: string) => {
    set({ isLoading: true, error: null });
    try {
      // For demo mode or web platform, use mock OTP
      if (DEMO_MODE || Platform.OS === 'web') {
        console.log('Demo mode: OTP sent to', phoneNumber);
        console.log('Use OTP: 123456 to verify');
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({ 
          isOtpSent: true, 
          phoneNumber, 
          isLoading: false,
          error: null 
        });
        return true;
      }
      
      // For mobile platforms with proper Firebase setup
      // Note: RecaptchaVerifier requires DOM and doesn't work well in React Native
      // For production mobile apps, use react-native-firebase instead
      
      set({ isLoading: false, error: 'Please use mobile device for OTP verification' });
      return false;
    } catch (error: any) {
      console.error('OTP Error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to send OTP' 
      });
      return false;
    }
  },

  verifyOtp: async (otp: string) => {
    set({ isLoading: true, error: null });
    try {
      // For demo mode or web platform
      if (DEMO_MODE || Platform.OS === 'web') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (otp === DEMO_OTP) {
          set({ isOtpVerified: true, isLoading: false, error: null });
          return true;
        } else {
          set({ isLoading: false, error: 'Invalid OTP. Use 123456 for demo.' });
          return false;
        }
      }
      
      // For mobile platforms with confirmationResult
      const { confirmationResult } = get();
      if (confirmationResult) {
        await confirmationResult.confirm(otp);
        set({ isOtpVerified: true, isLoading: false });
        return true;
      }
      
      set({ isLoading: false, error: 'Verification failed' });
      return false;
    } catch (error: any) {
      console.error('Verification Error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Invalid OTP' 
      });
      return false;
    }
  },

  resetOtp: () => {
    set({
      isOtpSent: false,
      isOtpVerified: false,
      isLoading: false,
      error: null,
      phoneNumber: '',
      confirmationResult: null,
      verificationId: null,
    });
  },
}));
