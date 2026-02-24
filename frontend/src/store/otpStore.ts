import { create } from 'zustand';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult
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
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Enable invisible reCAPTCHA for better UX
auth.settings.appVerificationDisabledForTesting = false;

interface OTPState {
  isOtpSent: boolean;
  isOtpVerified: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumber: string;
  confirmationResult: ConfirmationResult | null;
  recaptchaVerifier: RecaptchaVerifier | null;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetOtp: () => void;
  setupRecaptcha: (containerId: string) => void;
}

// Set to false to use REAL Firebase OTP
const DEMO_MODE = false;
const DEMO_OTP = '123456';

export const useOTPStore = create<OTPState>((set, get) => ({
  isOtpSent: false,
  isOtpVerified: false,
  isLoading: false,
  error: null,
  phoneNumber: '',
  confirmationResult: null,
  recaptchaVerifier: null,

  setupRecaptcha: (containerId: string) => {
    if (Platform.OS !== 'web') return;
    
    try {
      // Clear existing recaptcha if any
      const existingVerifier = get().recaptchaVerifier;
      if (existingVerifier) {
        existingVerifier.clear();
      }

      const verifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          set({ error: 'reCAPTCHA expired. Please try again.' });
        }
      });
      
      set({ recaptchaVerifier: verifier });
    } catch (error) {
      console.error('Error setting up reCAPTCHA:', error);
    }
  },

  sendOtp: async (phoneNumber: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Demo mode for testing
      if (DEMO_MODE) {
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

      // Real Firebase OTP
      if (Platform.OS === 'web') {
        let { recaptchaVerifier } = get();
        
        // Setup recaptcha if not exists
        if (!recaptchaVerifier) {
          // Create invisible recaptcha
          recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              console.log('reCAPTCHA verified');
            }
          });
          set({ recaptchaVerifier });
        }

        // Format phone number (ensure it has country code)
        const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
        
        console.log('Sending OTP to:', formattedPhone);
        
        const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        
        set({ 
          confirmationResult, 
          isOtpSent: true, 
          phoneNumber: formattedPhone, 
          isLoading: false,
          error: null 
        });
        
        return true;
      } else {
        // For native platforms, use demo mode as fallback
        console.log('Native platform - using demo mode');
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({ 
          isOtpSent: true, 
          phoneNumber, 
          isLoading: false,
          error: null 
        });
        return true;
      }
    } catch (error: any) {
      console.error('OTP Error:', error);
      
      let errorMessage = 'Failed to send OTP';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'reCAPTCHA verification failed. Please refresh and try again';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      return false;
    }
  },

  verifyOtp: async (otp: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Demo mode
      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (otp === DEMO_OTP) {
          set({ isOtpVerified: true, isLoading: false, error: null });
          return true;
        } else {
          set({ isLoading: false, error: 'Invalid OTP. Use 123456 for demo.' });
          return false;
        }
      }

      // Real Firebase verification
      const { confirmationResult } = get();
      
      if (confirmationResult) {
        await confirmationResult.confirm(otp);
        set({ isOtpVerified: true, isLoading: false, error: null });
        return true;
      } else {
        // Fallback for native or if no confirmation result
        set({ isLoading: false, error: 'Please send OTP first' });
        return false;
      }
    } catch (error: any) {
      console.error('Verification Error:', error);
      
      let errorMessage = 'Invalid OTP';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code. Please check and try again';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP has expired. Please request a new one';
      }
      
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      return false;
    }
  },

  resetOtp: () => {
    const { recaptchaVerifier } = get();
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {
        // Ignore cleanup errors
      }
    }
    
    set({
      isOtpSent: false,
      isOtpVerified: false,
      isLoading: false,
      error: null,
      phoneNumber: '',
      confirmationResult: null,
      recaptchaVerifier: null,
    });
  },
}));
