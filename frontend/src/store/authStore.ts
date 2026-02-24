import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_CREDENTIALS } from '../constants/data';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: {
    username: string;
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isLoading: true,
  user: null,

  login: async (username: string, password: string) => {
    if (
      username === LOGIN_CREDENTIALS.username &&
      password === LOGIN_CREDENTIALS.password
    ) {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('username', username);
      set({ isLoggedIn: true, user: { username } });
      return true;
    }
    return false;
  },

  logout: async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('username');
    set({ isLoggedIn: false, user: null });
  },

  checkAuth: async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const username = await AsyncStorage.getItem('username');
      if (isLoggedIn === 'true' && username) {
        set({ isLoggedIn: true, user: { username }, isLoading: false });
      } else {
        set({ isLoggedIn: false, user: null, isLoading: false });
      }
    } catch (error) {
      set({ isLoggedIn: false, user: null, isLoading: false });
    }
  },
}));
