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

// Initialize Firebase
let app: any;
let auth: any;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase init error:', error);
}

interface OTPState {
  isOtpSent: boolean;
  isOtpVerified: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumber: string;
  confirmationResult: ConfirmationResult | null;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetOtp: () => void;
}

// Global recaptcha verifier
let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaWidgetId: number | null = null;

// Cleanup function
const cleanupRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      // Ignore
    }
    recaptchaVerifier = null;
  }
  // Remove any existing recaptcha containers
  const existingContainer = document.getElementById('recaptcha-container');
  if (existingContainer) {
    existingContainer.innerHTML = '';
  }
};

export const useOTPStore = create<OTPState>((set, get) => ({
  isOtpSent: false,
  isOtpVerified: false,
  isLoading: false,
  error: null,
  phoneNumber: '',
  confirmationResult: null,

  sendOtp: async (phoneNumber: string) => {
    set({ isLoading: true, error: null });
    
    try {
      if (Platform.OS !== 'web' || !auth) {
        // Demo mode for non-web or if Firebase not initialized
        console.log('Using demo OTP mode');
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({ 
          isOtpSent: true, 
          phoneNumber, 
          isLoading: false,
          error: null 
        });
        return true;
      }

      // Format phone number
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : phoneNumber.startsWith('91') 
          ? `+${phoneNumber}`
          : `+91${phoneNumber}`;
      
      console.log('Sending OTP to:', formattedPhone);

      // Cleanup existing recaptcha
      cleanupRecaptcha();

      // Create or get recaptcha container
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.position = 'fixed';
        container.style.bottom = '0';
        container.style.left = '0';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
      }

      // Create new invisible recaptcha
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          console.log('reCAPTCHA solved:', response);
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          set({ error: 'Verification expired. Please try again.' });
        }
      });

      // Render the recaptcha
      await recaptchaVerifier.render();
      console.log('reCAPTCHA rendered');

      // Send OTP
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      console.log('OTP sent successfully');
      
      set({ 
        confirmationResult, 
        isOtpSent: true, 
        phoneNumber: formattedPhone, 
        isLoading: false,
        error: null 
      });
      
      return true;
    } catch (error: any) {
      console.error('Send OTP Error:', error);
      
      // Cleanup on error
      cleanupRecaptcha();
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number. Please enter a valid number.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many OTP requests. Please add this number as a test number in Firebase Console, or wait 1 hour and try again.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'Security check failed. Please refresh the page.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
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
      const { confirmationResult } = get();
      
      if (!confirmationResult) {
        // Demo mode verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (otp === '123456') {
          set({ isOtpVerified: true, isLoading: false, error: null });
          return true;
        } else {
          set({ isLoading: false, error: 'Invalid OTP. For demo, use: 123456' });
          return false;
        }
      }

      // Real Firebase verification
      console.log('Verifying OTP:', otp);
      await confirmationResult.confirm(otp);
      console.log('OTP verified successfully');
      
      // Cleanup recaptcha after successful verification
      cleanupRecaptcha();
      
      set({ isOtpVerified: true, isLoading: false, error: null });
      return true;
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      
      let errorMessage = 'Invalid OTP. Please try again.';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Wrong OTP. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP expired. Please request a new one.';
      } else if (error.code === 'auth/session-expired') {
        errorMessage = 'Session expired. Please request a new OTP.';
      }
      
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
      return false;
    }
  },

  resetOtp: () => {
    cleanupRecaptcha();
    set({
      isOtpSent: false,
      isOtpVerified: false,
      isLoading: false,
      error: null,
      phoneNumber: '',
      confirmationResult: null,
    });
  },
}));
