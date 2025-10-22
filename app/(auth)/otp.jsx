import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useResetToken } from "../hooks/ResetTokenContext";
import { forgotPassword, resendOtp, verifyOtp } from "../services/authApi";

function ForgotPasswordScreen() {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const {setResetToken} = useResetToken();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmailStep = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOtpStep = () => {
    const newErrors = {};
    
    if (!otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'otp') {
      setOtp(value.replace(/[^0-9]/g, '').slice(0, 6));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleRequestOtp = async () => {
    if (!validateEmailStep()) return;

    setIsLoading(true);
    
    try {
      await forgotPassword({ email: email.toLowerCase().trim() });
      setStep("otp");
      setTimer(60);
      setErrors({});
      Alert.alert("Success", "OTP sent to your email");
    } catch (error) {
      console.error('OTP request error:', error);
      Alert.alert("Error", error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtpStep()) return;

    setIsLoading(true);
    
    try {
      const { data } = await verifyOtp({ email: email.toLowerCase().trim(), otp });
      setResetToken(data.resetToken);
      router.push("/(auth)/resetPassword");
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    
    try {
      await resendOtp({ email: email.toLowerCase().trim() });
      setTimer(60);
      setOtp("");
      setErrors({});
      Alert.alert("Success", "OTP resent to your email");
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert("Error", error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'email') {
      router.back();
    } else {
      setStep('email');
      setOtp('');
      setTimer(0);
      setErrors({});
    }
  };

  return (
    <View style={styles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#323232ff" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={28} color="#eeececff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {step === 'email' ? 'Reset Password' : 'Verify OTP'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.formContainer}>
              {/* Step 1: Email */}
              {step === 'email' && (
                <>
                  <Text style={styles.stepDescription}>
                    Enter your email address and we&apos;ll send you an OTP to reset your password.
                  </Text>
                  
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[
                          styles.input,
                          errors.email ? styles.inputError : styles.inputNormal
                        ]}
                        placeholder="Email"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={100}
                      />
                    </View>
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      isLoading ? styles.buttonDisabled : styles.buttonEnabled
                    ]}
                    onPress={handleRequestOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Send OTP</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {/* Step 2: OTP */}
              {step === 'otp' && (
                <>
                  <Text style={styles.stepDescription}>
                    Enter the 6-digit OTP sent to {'\n'}
                    <Text style={styles.emailHighlight}>{email}</Text>
                  </Text>
                  
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[
                          styles.input,
                          styles.otpInput,
                          errors.otp ? styles.inputError : styles.inputNormal
                        ]}
                        placeholder="XXXXXX"
                        placeholderTextColor="#9CA3AF"
                        value={otp}
                        onChangeText={(text) => handleInputChange('otp', text)}
                        keyboardType="number-pad"
                        maxLength={6}
                        textAlign="center"
                      />
                    </View>
                    {errors.otp && (
                      <Text style={styles.errorText}>{errors.otp}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.button,
                      isLoading ? styles.buttonDisabled : styles.buttonEnabled
                    ]}
                    onPress={handleVerifyOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>

                  {timer > 0 ? (
                    <Text style={styles.timerText}>
                      Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </Text>
                  ) : (
                    <TouchableOpacity 
                      onPress={handleResendOtp}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.resendText,
                        isLoading && styles.resendTextDisabled
                      ]}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  )}
                  <Text style={{fontSize: 13,
                        color: '#9CA3AF',
                        textAlign: 'center',
                        marginVertical: 6,}
                    }
                    >
                    Note: OTP expires in 5 minutes
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Footer Spacer */}
          <View style={styles.footerSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#323232ff',
  },
  container: {
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
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  emailHighlight: {
    color: '#1173d4',
    fontWeight: '600',
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
  otpInput: {
    letterSpacing: 8,
    fontSize: 18,
  },
  inputNormal: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputError: {
    borderColor: '#EF4444',
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
  timerText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#1173d4',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  },
  resendTextDisabled: {
    color: '#9CA3AF',
  },
  footerSpacer: {
    padding: 24,
  },
});