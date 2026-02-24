import { create } from 'zustand';

// Firebase config placeholder - Will be updated with actual config
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

interface OTPState {
  isOtpSent: boolean;
  isOtpVerified: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumber: string;
  confirmationResult: any;
  sendOtp: (phoneNumber: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  resetOtp: () => void;
}

// For demo purposes, we'll use a mock OTP system
// When Firebase is configured, this can be replaced with actual Firebase Auth
const MOCK_OTP = '123456';

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
      // Check if Firebase is configured
      if (!firebaseConfig.apiKey) {
        // Mock OTP for demo
        console.log('Firebase not configured. Using mock OTP: 123456');
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({ 
          isOtpSent: true, 
          phoneNumber, 
          isLoading: false,
          error: null 
        });
        return true;
      }
      
      // TODO: Implement actual Firebase OTP when config is provided
      // const auth = getAuth();
      // const appVerifier = new RecaptchaVerifier(...);
      // const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      // set({ confirmationResult: result, isOtpSent: true, phoneNumber, isLoading: false });
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
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
      // Check if Firebase is configured
      if (!firebaseConfig.apiKey) {
        // Mock verification for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (otp === MOCK_OTP) {
          set({ isOtpVerified: true, isLoading: false, error: null });
          return true;
        } else {
          set({ isLoading: false, error: 'Invalid OTP. Use 123456 for demo.' });
          return false;
        }
      }
      
      // TODO: Implement actual Firebase verification when config is provided
      // const { confirmationResult } = get();
      // await confirmationResult.confirm(otp);
      // set({ isOtpVerified: true, isLoading: false });
      
      set({ isLoading: false });
      return true;
    } catch (error: any) {
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
    });
  },
}));
