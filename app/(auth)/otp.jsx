import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { useResetToken } from "../hooks/ResetTokenContext";
import { forgotPassword, resendOtp, verifyOtp } from "../services/authApi";

function ForgotPasswordScreen() {
  const [step, setStep] = useState('email');
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
    <View style={otpStyles.safeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#323232ff" />
      
      <View style={otpStyles.header}>
        <TouchableOpacity 
          style={otpStyles.backButton}
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={28} color="#eeececff" />
        </TouchableOpacity>
        <Text style={otpStyles.headerTitle}>
          {step === 'email' ? 'Reset Password' : 'Verify OTP'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={otpStyles.scrollView}
        contentContainerStyle={otpStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={otpStyles.mainContent}>
          <View style={otpStyles.formContainer}>
            {step === 'email' && (
              <>
                <Text style={otpStyles.stepDescription}>
                  Enter your email address and we&apos;ll send you an OTP to reset your password.
                </Text>
                
                <View style={otpStyles.inputContainer}>
                  <View style={otpStyles.inputWrapper}>
                    <TextInput
                      style={[
                        otpStyles.input,
                        errors.email ? otpStyles.inputError : otpStyles.inputNormal
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
                    <Text style={otpStyles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    otpStyles.button,
                    isLoading ? otpStyles.buttonDisabled : otpStyles.buttonEnabled
                  ]}
                  onPress={handleRequestOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={otpStyles.buttonText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {step === 'otp' && (
              <>
                <Text style={otpStyles.stepDescription}>
                  Enter the 6-digit OTP sent to {'\n'}
                  <Text style={otpStyles.emailHighlight}>{email}</Text>
                </Text>
                
                <View style={otpStyles.inputContainer}>
                  <View style={otpStyles.inputWrapper}>
                    <TextInput
                      style={[
                        otpStyles.input,
                        otpStyles.otpInput,
                        errors.otp ? otpStyles.inputError : otpStyles.inputNormal
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
                    <Text style={otpStyles.errorText}>{errors.otp}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    otpStyles.button,
                    isLoading ? otpStyles.buttonDisabled : otpStyles.buttonEnabled
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={otpStyles.buttonText}>Verify OTP</Text>
                  )}
                </TouchableOpacity>

                {timer > 0 ? (
                  <Text style={otpStyles.timerText}>
                    Resend OTP in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </Text>
                ) : (
                  <TouchableOpacity 
                    onPress={handleResendOtp}
                    disabled={isLoading}
                  >
                    <Text style={[
                      otpStyles.resendText,
                      isLoading && otpStyles.resendTextDisabled
                    ]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                )}
                <Text style={otpStyles.noteText}>
                  Note: OTP expires in 5 minutes
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={otpStyles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

export default ForgotPasswordScreen;

const otpStyles = StyleSheet.create({
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
  noteText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 6,
  },
  footerSpacer: {
    padding: 24,
  },
});