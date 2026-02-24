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

// TEST PHONE NUMBERS - These bypass Firebase completely
// Add your test numbers here with their OTP codes
const TEST_PHONE_NUMBERS: { [key: string]: string } = {
  '9930503512': '123456',
  '+919930503512': '123456',
  '919930503512': '123456',
  '6386273599': '123456',
  '+916386273599': '123456',
  '916386273599': '123456',
};

// Check if a phone number is a test number
const isTestPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return Object.keys(TEST_PHONE_NUMBERS).some(testNum => 
    cleanPhone.includes(testNum.replace('+', ''))
  );
};

// Get the test OTP for a phone number
const getTestOTP = (phone: string): string | null => {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  for (const [testNum, otp] of Object.entries(TEST_PHONE_NUMBERS)) {
    if (cleanPhone.includes(testNum.replace('+', ''))) {
      return otp;
    }
  }
  return null;
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
  isTestMode: boolean;
  testOTP: string | null;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetOtp: () => void;
}

// Global recaptcha verifier
let recaptchaVerifier: RecaptchaVerifier | null = null;

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
  if (typeof document !== 'undefined') {
    const existingContainer = document.getElementById('recaptcha-container');
    if (existingContainer) {
      existingContainer.innerHTML = '';
    }
  }
};

export const useOTPStore = create<OTPState>((set, get) => ({
  isOtpSent: false,
  isOtpVerified: false,
  isLoading: false,
  error: null,
  phoneNumber: '',
  confirmationResult: null,
  isTestMode: false,
  testOTP: null,

  sendOtp: async (phoneNumber: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Format phone number
      const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
      const formattedPhone = cleanPhone.startsWith('+') 
        ? cleanPhone 
        : cleanPhone.startsWith('91') 
          ? `+${cleanPhone}`
          : `+91${cleanPhone}`;
      
      console.log('Processing phone:', formattedPhone);

      // CHECK IF TEST PHONE NUMBER - BYPASS FIREBASE COMPLETELY
      if (isTestPhoneNumber(formattedPhone)) {
        const testOTP = getTestOTP(formattedPhone);
        console.log('🧪 TEST MODE: Using test phone number. OTP:', testOTP);
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({ 
          isOtpSent: true, 
          phoneNumber: formattedPhone, 
          isLoading: false,
          error: null,
          isTestMode: true,
          testOTP: testOTP
        });
        
        return true;
      }

      // REAL FIREBASE OTP FOR NON-TEST NUMBERS
      if (Platform.OS !== 'web' || !auth) {
        // Fallback demo mode
        console.log('Demo mode: No web platform or auth');
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({ 
          isOtpSent: true, 
          phoneNumber: formattedPhone, 
          isLoading: false,
          error: null,
          isTestMode: true,
          testOTP: '123456'
        });
        return true;
      }

      console.log('Sending real OTP to:', formattedPhone);

      // Cleanup existing recaptcha
      cleanupRecaptcha();

      // Create recaptcha container
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

      // Create invisible recaptcha
      recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA solved'),
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          set({ error: 'Verification expired. Please try again.' });
        }
      });

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
        error: null,
        isTestMode: false,
        testOTP: null
      });
      
      return true;
    } catch (error: any) {
      console.error('Send OTP Error:', error);
      
      cleanupRecaptcha();
      
      // If Firebase fails, check if it's a test number and allow anyway
      const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
      if (isTestPhoneNumber(cleanPhone)) {
        console.log('🧪 Firebase failed but test number detected. Enabling test mode.');
        const testOTP = getTestOTP(cleanPhone);
        set({ 
          isOtpSent: true, 
          phoneNumber: cleanPhone, 
          isLoading: false,
          error: null,
          isTestMode: true,
          testOTP: testOTP
        });
        return true;
      }
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes and try again.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'Security check failed. Please refresh and try again.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },

  verifyOtp: async (otp: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { confirmationResult, isTestMode, testOTP } = get();
      
      // TEST MODE VERIFICATION
      if (isTestMode) {
        console.log('🧪 TEST MODE: Verifying OTP', otp, 'Expected:', testOTP);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (otp === testOTP || otp === '123456') {
          console.log('🧪 TEST MODE: OTP Verified!');
          set({ isOtpVerified: true, isLoading: false, error: null });
          return true;
        } else {
          set({ isLoading: false, error: `Wrong OTP. Hint: Use ${testOTP || '123456'}` });
          return false;
        }
      }
      
      // REAL FIREBASE VERIFICATION
      if (!confirmationResult) {
        set({ isLoading: false, error: 'Session expired. Please send OTP again.' });
        return false;
      }

      console.log('Verifying real OTP:', otp);
      await confirmationResult.confirm(otp);
      console.log('OTP verified successfully');
      
      cleanupRecaptcha();
      
      set({ isOtpVerified: true, isLoading: false, error: null });
      return true;
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      
      let errorMessage = 'Invalid OTP. Please try again.';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Wrong OTP code. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP expired. Please request a new one.';
      }
      
      set({ isLoading: false, error: errorMessage });
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
      isTestMode: false,
      testOTP: null,
    });
  },
}));
