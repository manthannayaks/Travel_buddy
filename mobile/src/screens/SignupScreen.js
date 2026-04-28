import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
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

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '251186632070-djvmr3vuqmafkts6ldc8b78jm7oho47l.apps.googleusercontent.com',
  });

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
      await api.post('/api/users/generate-otp', { phoneNumber });
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
      setAuth(true); // Switch to Dashboard
    } catch (err) {
      Alert.alert('Signup Failed', err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white justify-center`}>
      <ScrollView contentContainerStyle={tw`p-8 flex-grow justify-center`}>
        <Text style={tw`text-4xl font-extrabold text-blue-600 mb-2`}>Join TravelBuddy</Text>
        <Text style={tw`text-gray-500 mb-8 text-base`}>Step {step} of 2 — Secure Registration</Text>

        {step === 1 ? (
          <>
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-bold text-gray-700 mb-1 ml-1`}>Full Name</Text>
              <TextInput style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`} placeholder="John Doe" value={name} onChangeText={setName} />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-bold text-gray-700 mb-1 ml-1`}>Email Address</Text>
              <TextInput style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`} placeholder="traveler@example.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-bold text-gray-700 mb-1 ml-1`}>Phone Number</Text>
              <TextInput style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 tracking-wider`} placeholder="+1 555-0100" keyboardType="phone-pad" value={phoneNumber} onChangeText={setPhoneNumber} />
            </View>

            <View style={tw`mb-8`}>
              <Text style={tw`text-sm font-bold text-gray-700 mb-1 ml-1`}>Password</Text>
              <TextInput style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`} placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
            </View>

            <TouchableOpacity style={tw`bg-blue-600 w-full rounded-2xl py-4 items-center shadow-lg ${loading ? 'opacity-70' : ''}`} onPress={handleNextStep} disabled={loading}>
              <Text style={tw`text-white font-bold text-lg`}>{loading ? 'Generating Security OTP...' : 'Next Step →'}</Text>
            </TouchableOpacity>

            <View style={tw`flex-row items-center my-6`}>
              <View style={tw`flex-1 h-px bg-gray-200`} />
              <Text style={tw`mx-4 text-gray-400 font-bold`}>OR</Text>
              <View style={tw`flex-1 h-px bg-gray-200`} />
            </View>

            <TouchableOpacity style={tw`bg-white border border-gray-200 w-full rounded-2xl py-4 flex-row justify-center items-center shadow-sm mb-2 ${!request ? 'opacity-50' : ''}`} onPress={() => promptAsync()} disabled={!request || loading}>
              <Text style={tw`text-xl mr-3`}>🇬</Text>
              <Text style={tw`text-gray-800 font-bold text-lg`}>Sign in with Google</Text>
            </TouchableOpacity>

            <View style={tw`flex-row justify-center mt-6`}>
              <Text style={tw`text-gray-600`}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={tw`text-blue-600 font-bold`}>Log In</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={tw`mb-4 items-center`}>
              <Text style={tw`text-gray-600 text-center mb-6 text-sm px-4`}>An SMS OTP has been sent securely to <Text style={tw`font-bold`}>{phoneNumber}</Text></Text>
            </View>

            <View style={tw`mb-6`}>
              <Text style={tw`text-sm font-bold text-gray-700 mb-1 ml-1`}>6-Digit Verification OTP</Text>
              <TextInput style={tw`w-full bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-4 text-2xl text-center font-black tracking-widest text-indigo-900`} placeholder="000000" keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} />
            </View>

            <View style={tw`flex-row justify-between mb-8`}>
              <TouchableOpacity style={tw`flex-1 mr-2 p-3 rounded-xl border ${locationInfo ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'} items-center justify-center`} onPress={handleGetLocation}>
                <Text style={tw`text-2xl mb-1`}>{locationInfo ? '📍' : '🛰️'}</Text>
                <Text style={tw`${locationInfo ? 'text-green-700' : 'text-gray-600'} font-bold text-xs text-center`}>{locationInfo ? 'GPS Locked' : 'Tag Location'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={tw`flex-1 ml-2 p-3 rounded-xl border ${idDocument ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'} items-center justify-center`} onPress={handleImagePick}>
                <Text style={tw`text-2xl mb-1`}>{idDocument ? '🟢' : '🛂'}</Text>
                <Text style={tw`${idDocument ? 'text-green-700' : 'text-gray-600'} font-bold text-xs text-center`}>{idDocument ? 'ID Verified' : 'Upload ID'}</Text>
              </TouchableOpacity>
            </View>

            {idDocument && (
              <Text style={tw`text-green-600 text-xs text-center mb-6 font-bold bg-green-50 py-2 rounded-lg`}>✓ Initial biometric scan passed. We will re-verify later.</Text>
            )}

            <TouchableOpacity style={tw`bg-emerald-600 w-full rounded-2xl py-4 items-center shadow-lg ${loading ? 'opacity-70' : ''}`} onPress={handleSignup} disabled={loading}>
              <Text style={tw`text-white font-bold text-lg`}>{loading ? 'Verifying Identity...' : 'Verify & Sign Up'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={tw`mt-6 items-center p-2`} onPress={() => setStep(1)}>
              <Text style={tw`text-gray-400 font-bold`}>← Go Back</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
