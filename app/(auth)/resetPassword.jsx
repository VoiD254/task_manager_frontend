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
import { useResetToken } from '../hooks/ResetTokenContext';
import { resetPassword as resetPasswordApi } from "../services/authApi";

function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {resetToken} = useResetToken();
  if (!resetToken) {
    Alert.alert("Error", "Reset token missing. Restart OTP flow.");
    router.replace("/(auth)/forgotPassword");
    return null;
  }

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
    
    if (!newPassword.trim()) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors[0];
      }
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === 'password') {
      setNewPassword(value);
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await resetPasswordApi({
        resetToken,
        newPassword,
        confirmPassword
      });

      Alert.alert("Success", "Password reset successfully!", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") }
      ]);
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert("Error", error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={resetStyles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#323232ff" />
      
      <View style={resetStyles.header}>
        <TouchableOpacity 
          style={resetStyles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={28} color="#eeececff" />
        </TouchableOpacity>
        <Text style={resetStyles.headerTitle}>New Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={resetStyles.scrollView}
        contentContainerStyle={resetStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={resetStyles.mainContent}>
          <View style={resetStyles.formContainer}>
            <Text style={resetStyles.stepDescription}>
              Create a new password for your account.
            </Text>

            <View style={resetStyles.inputContainer}>
              <View style={resetStyles.inputWrapper}>
                <TextInput
                  style={[
                    resetStyles.input,
                    resetStyles.passwordInput,
                    errors.password ? resetStyles.inputError : resetStyles.inputNormal
                  ]}
                  placeholder="New Password"
                  placeholderTextColor="#9CA3AF"
                  value={newPassword}
                  onChangeText={(text) => handleInputChange('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  maxLength={50}
                />
                <TouchableOpacity
                  style={resetStyles.eyeIcon}
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
                <Text style={resetStyles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View style={resetStyles.inputContainer}>
              <View style={resetStyles.inputWrapper}>
                <TextInput
                  style={[
                    resetStyles.input,
                    resetStyles.passwordInput,
                    errors.confirmPassword ? resetStyles.inputError : resetStyles.inputNormal
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  maxLength={50}
                />
                <TouchableOpacity
                  style={resetStyles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={25} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={resetStyles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                resetStyles.button,
                isLoading ? resetStyles.buttonDisabled : resetStyles.buttonEnabled
              ]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={resetStyles.buttonText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            <View style={resetStyles.requirementsContainer}>
              <Text style={resetStyles.requirementsTitle}>Password must contain:</Text>
              <Text style={resetStyles.requirementText}>• At least 6 characters</Text>
              <Text style={resetStyles.requirementText}>• One uppercase letter (A-Z)</Text>
              <Text style={resetStyles.requirementText}>• One number (0-9)</Text>
              <Text style={resetStyles.requirementText}>• One special character (!@#$%^&*)</Text>
            </View>
          </View>
        </View>

        <View style={resetStyles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

export default ResetPasswordScreen;

const resetStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#323232ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#eeececff',
    flex: 1,
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
  stepDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
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
  button: {
    width: '100%',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonEnabled: {
    backgroundColor: '#1173d4',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#eeececff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  requirementsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#eeececff',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerSpacer: {
    padding: 24,
  },
});