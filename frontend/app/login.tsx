import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../src/components/Header';
import { FormInput } from '../src/components/FormInput';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import { COLORS, SPACING } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';

const APP_LOGO = 'https://customer-assets.emergentagent.com/job_citizen-ref-hub/artifacts/h91vxs4b_466389831_567307805952219_3183561701720241008_n.jpg';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const success = await login(username.trim(), password);
      if (success) {
        router.replace('/dashboard');
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid username or password. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Login"
        showBack={true}
        showMenu={false}
        onBackPress={() => router.back()}
      />

      {isLoading && <LoadingSpinner fullScreen message="Logging in..." />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Login Card */}
          <View style={styles.loginCard}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Image source={{ uri: APP_LOGO }} style={styles.logoImage} />
              </View>
              <Text style={styles.logoTitle}>Gau Seva</Text>
              <Text style={styles.logoSubtitle}>Government of Uttar Pradesh</Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Login to Your Account</Text>
              <Text style={styles.formSubtitle}>
                Enter your credentials to access the dashboard
              </Text>

              <FormInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                icon="person-outline"
                autoCapitalize="none"
                required
                error={errors.username}
              />

              <FormInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                icon="lock-closed-outline"
                secureTextEntry
                required
                error={errors.password}
              />

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Ionicons name="log-in-outline" size={20} color={COLORS.white} />
                <Text style={styles.loginButtonText}>LOGIN</Text>
              </TouchableOpacity>

              {/* Powered by Gau Seva */}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Toll Free: 1800-180-5141</Text>
            <Text style={styles.footerCopyright}>
              © 2024 Animal Husbandry Department
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  loginCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.saffron,
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.navy,
    textAlign: 'center',
  },
  logoSubtitle: {
    fontSize: 14,
    color: COLORS.saffron,
    marginTop: 2,
  },
  formContainer: {
    marginTop: SPACING.md,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  formSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.green,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
    gap: 8,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  demoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.lg,
    gap: 8,
  },
  demoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  demoCredentials: {
    fontWeight: 'bold',
    color: COLORS.navy,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  footerCopyright: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 4,
  },
});
