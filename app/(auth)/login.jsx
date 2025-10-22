import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../hooks/AuthProvider';

function LoginScreen() {
  const { signin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must include at least one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must include at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must include at least one special character");
    }
    
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0];
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await signin({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      })
      router.replace("/(tabs)/home")
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert("Login Failed", error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignup = () => {
    router.push('/(auth)/signup');
  };

  const navigateToOtpPage = () => {
    router.push('/(auth)/otp');
  };

  return (
    <View style={loginStyles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#323232ff" />
      
      <View style={loginStyles.header}>
        <Text style={loginStyles.headerTitle}>Login</Text>
      </View>

      <ScrollView 
        style={loginStyles.scrollView}
        contentContainerStyle={loginStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={loginStyles.mainContent}>
          <View style={loginStyles.formContainer}>
            <View style={loginStyles.inputContainer}>
              <View style={loginStyles.inputWrapper}>
                <TextInput
                  style={[
                    loginStyles.input,
                    errors.email ? loginStyles.inputError : loginStyles.inputNormal
                  ]}
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={100}
                />
              </View>
              {errors.email && (
                <Text style={loginStyles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={loginStyles.inputContainer}>
              <View style={loginStyles.inputWrapper}>
                <TextInput
                  style={[
                    loginStyles.input,
                    loginStyles.passwordInput,
                    errors.password ? loginStyles.inputError : loginStyles.inputNormal
                  ]}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  maxLength={50}
                />
                <TouchableOpacity
                  style={loginStyles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={25} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={loginStyles.errorText}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity style={loginStyles.forgotPasswordContainer} onPress={navigateToOtpPage}>
              <Text style={loginStyles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                loginStyles.loginButton,
                isLoading ? loginStyles.loginButtonDisabled : loginStyles.loginButtonEnabled
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={loginStyles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={loginStyles.signupContainer}>
              <Text style={loginStyles.signupText}>
                Don&apos;t have an account?{' '}
                <TouchableOpacity onPress={navigateToSignup}>
                  <Text style={loginStyles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </View>

        <View style={loginStyles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

export default LoginScreen;

const loginStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#323232ff',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#eeececff',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  formContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    fontSize: 16,
    color: '#eeececff',
  },
  passwordInput: {
    paddingRight: 48,
  },
  inputNormal: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#1173d4',
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonEnabled: {
    backgroundColor: '#1173d4',
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#eeececff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    fontSize: 14,
    color: '#6B7280',
  },
  signupLink: {
    fontWeight: '600',
    color: '#1173d4',
    top: 6,
  },
  footerSpacer: {
    padding: 24,
  },
});