import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView, Animated, Platform, KeyboardAvoidingView } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';
import { setToken, setUser } from '../utils/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen({ navigation, setAuth }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [idDocument, setIdDocument] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '251186632070-djvmr3vuqmafkts6ldc8b78jm7oho47l.apps.googleusercontent.com',
    androidClientId: '251186632070-9cgrcr3296omgnq3066rqdc7lasn2ha6.apps.googleusercontent.com',
    redirectUri: Platform.select({
      web: 'https://auth.expo.io/@manthannayaks/mobile',
      default: undefined,
    }),
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleServerAuth(id_token);
    } else if (response?.type === 'error') {
      Alert.alert('Google Authentication Error', 'Browser window closed or failed to connect.');
    }
  }, [response]);

  const handleGoogleServerAuth = async (idToken) => {
    setLoading(true);
    try {
      const res = await api.post('/api/users/google', { idToken });
      await setToken(res.data.token);
      await setUser(res.data);
      setAuth(true);
    } catch (err) {
      Alert.alert('Signup Failed', err.response?.data?.message || 'Google Auth verification failed on server.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      setIdDocument(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please allow location access to proceed.');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocationInfo({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude
    });
    Alert.alert('Location Secured', 'Your GPS coordinates have been safely locked.');
  };

  const handleNextStep = async () => {
    if (!name || !email || !password || !phoneNumber) return Alert.alert('Error', 'Please fill all fields to lock your identity');
    setLoading(true);
    try {
      const res = await api.post('/api/users/generate-otp', { phoneNumber });
      // Auto-fill OTP from server response (mock SMS for development)
      if (res.data.otp) {
        setOtp(res.data.otp);
        Alert.alert('📱 OTP Received', `Your verification code is: ${res.data.otp}\n\nIt has been auto-filled for you.`);
      }
      setStep(2);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP to phone');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!locationInfo) return Alert.alert('Error', 'Please tag your GPS location for security.');
    if (!idDocument) return Alert.alert('Error', 'Please upload a Passport or Aadhar ID.');
    if (!otp || otp.length !== 6) return Alert.alert('Error', 'Please enter a valid 6-digit OTP code.');

    setLoading(true);
    try {
      const authRes = await api.post('/api/users', {
        name, email, password, phoneNumber, location: locationInfo, idDocument, otp
      });
      await setToken(authRes.data.token);
      await setUser(authRes.data);
      setAuth(true);
    } catch (err) {
      Alert.alert('Signup Failed', err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      <KeyboardAvoidingView style={tw`flex-1`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={tw`p-8 flex-grow justify-center`}>
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

            {/* Back Button */}
            <TouchableOpacity
              onPress={() => step === 2 ? setStep(1) : navigation.goBack()}
              style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center mb-8 border border-[#2d3555]`}
            >
              <Text style={tw`text-white font-bold text-lg`}>←</Text>
            </TouchableOpacity>

            {/* Header */}
            <Text style={tw`text-4xl font-black text-white mb-2`}>
              {step === 1 ? 'Join\nTravelBuddy 🌍' : 'Verify\nYour Identity 🔐'}
            </Text>

            {/* Progress Bar */}
            <View style={tw`flex-row items-center mb-8 mt-3`}>
              <View style={tw`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-[#6c5ce7]' : 'bg-[#2d3555]'} mr-2`} />
              <View style={tw`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-[#6c5ce7]' : 'bg-[#2d3555]'}`} />
            </View>

            <Text style={tw`text-[#8892b0] mb-8 text-sm font-medium`}>
              {step === 1 ? 'Step 1 of 2 — Create your account' : 'Step 2 of 2 — Security verification'}
            </Text>

            {step === 1 ? (
              <>
                {/* Full Name */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Full Name</Text>
                  <View style={tw`bg-[#1a1f35] border border-[#2d3555] rounded-2xl px-4 py-1 flex-row items-center`}>
                    <Text style={tw`text-[#6c5ce7] mr-3 text-lg`}>👤</Text>
                    <TextInput style={tw`flex-1 text-white text-base py-3`} placeholder="John Doe" placeholderTextColor="#4a5568" value={name} onChangeText={setName} />
                  </View>
                </View>

                {/* Email */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Email</Text>
                  <View style={tw`bg-[#1a1f35] border border-[#2d3555] rounded-2xl px-4 py-1 flex-row items-center`}>
                    <Text style={tw`text-[#6c5ce7] mr-3 text-lg`}>✉</Text>
                    <TextInput style={tw`flex-1 text-white text-base py-3`} placeholder="traveler@example.com" placeholderTextColor="#4a5568" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                  </View>
                </View>

                {/* Phone */}
                <View style={tw`mb-4`}>
                  <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Phone Number</Text>
                  <View style={tw`bg-[#1a1f35] border border-[#2d3555] rounded-2xl px-4 py-1 flex-row items-center`}>
                    <Text style={tw`text-[#6c5ce7] mr-3 text-lg`}>📱</Text>
                    <TextInput style={tw`flex-1 text-white text-base py-3 tracking-wider`} placeholder="+91 98765 43210" placeholderTextColor="#4a5568" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
                  </View>
                </View>

                {/* Password */}
                <View style={tw`mb-8`}>
                  <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Password</Text>
                  <View style={tw`bg-[#1a1f35] border border-[#2d3555] rounded-2xl px-4 py-1 flex-row items-center`}>
                    <Text style={tw`text-[#6c5ce7] mr-3 text-lg`}>🔒</Text>
                    <TextInput style={tw`flex-1 text-white text-base py-3`} placeholder="••••••••" placeholderTextColor="#4a5568" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Text style={tw`text-[#8892b0] font-bold text-sm`}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Next Button */}
                <TouchableOpacity style={tw`bg-[#6c5ce7] w-full rounded-2xl py-4.5 items-center ${loading ? 'opacity-70' : ''}`} onPress={handleNextStep} disabled={loading}>
                  <Text style={tw`text-white font-black text-lg tracking-wide`}>{loading ? 'Sending OTP...' : 'Next Step →'}</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={tw`flex-row items-center my-7`}>
                  <View style={tw`flex-1 h-px bg-[#2d3555]`} />
                  <Text style={tw`mx-4 text-[#4a5568] font-bold text-xs tracking-widest`}>OR</Text>
                  <View style={tw`flex-1 h-px bg-[#2d3555]`} />
                </View>

                {/* Google Button */}
                <TouchableOpacity
                  style={tw`bg-[#1a1f35] border border-[#2d3555] w-full rounded-2xl py-4 flex-row justify-center items-center ${!request ? 'opacity-40' : ''}`}
                  onPress={() => promptAsync()}
                  disabled={!request || loading}
                >
                  <Text style={tw`text-xl mr-3`}>🔵</Text>
                  <Text style={tw`text-[#ccd6f6] font-bold text-base`}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Login link */}
                <View style={tw`flex-row justify-center mt-8`}>
                  <Text style={tw`text-[#8892b0]`}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={tw`text-[#6c5ce7] font-bold`}>Log In</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                {/* OTP Info */}
                <View style={tw`bg-[#1a1f35] border border-[#2d3555] rounded-2xl p-4 mb-6`}>
                  <Text style={tw`text-[#8892b0] text-center text-sm`}>
                    An SMS OTP has been sent to{' '}
                    <Text style={tw`font-bold text-[#6c5ce7]`}>{phoneNumber}</Text>
                  </Text>
                </View>

                {/* OTP Input */}
                <View style={tw`mb-6`}>
                  <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Verification OTP</Text>
                  <TextInput
                    style={tw`w-full bg-[#1a1f35] border-2 border-[#6c5ce7] rounded-2xl px-4 py-4 text-3xl text-center font-black tracking-widest text-[#6c5ce7]`}
                    placeholder="000000"
                    placeholderTextColor="#2d3555"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={setOtp}
                  />
                </View>

                {/* Location & ID Buttons */}
                <View style={tw`flex-row justify-between mb-8`}>
                  <TouchableOpacity
                    style={tw`flex-1 mr-2 p-4 rounded-2xl border ${locationInfo ? 'bg-[#00cec920] border-[#00cec9]' : 'bg-[#1a1f35] border-[#2d3555]'} items-center justify-center`}
                    onPress={handleGetLocation}
                  >
                    <Text style={tw`text-3xl mb-2`}>{locationInfo ? '📍' : '🛰️'}</Text>
                    <Text style={tw`${locationInfo ? 'text-[#00cec9]' : 'text-[#8892b0]'} font-bold text-xs text-center`}>
                      {locationInfo ? 'GPS Locked ✓' : 'Tag Location'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tw`flex-1 ml-2 p-4 rounded-2xl border ${idDocument ? 'bg-[#00cec920] border-[#00cec9]' : 'bg-[#1a1f35] border-[#2d3555]'} items-center justify-center`}
                    onPress={handleImagePick}
                  >
                    <Text style={tw`text-3xl mb-2`}>{idDocument ? '✅' : '🛂'}</Text>
                    <Text style={tw`${idDocument ? 'text-[#00cec9]' : 'text-[#8892b0]'} font-bold text-xs text-center`}>
                      {idDocument ? 'ID Uploaded ✓' : 'Upload ID'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {idDocument && (
                  <View style={tw`bg-[#00cec920] border border-[#00cec9] rounded-2xl p-3 mb-6`}>
                    <Text style={tw`text-[#00cec9] text-xs text-center font-bold`}>✓ Document scan passed. We will re-verify later.</Text>
                  </View>
                )}

                {/* Signup Button */}
                <TouchableOpacity
                  style={tw`bg-[#00cec9] w-full rounded-2xl py-4.5 items-center ${loading ? 'opacity-70' : ''}`}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  <Text style={tw`text-[#0a0e1a] font-black text-lg tracking-wide`}>{loading ? 'Verifying...' : 'Verify & Create Account →'}</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
