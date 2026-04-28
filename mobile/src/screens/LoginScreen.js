import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';
import { setToken, setUser } from '../utils/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation, setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
      Alert.alert('Login Failed', err.response?.data?.message || 'Google Auth verification failed on server.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields');
    setLoading(true);
    try {
      const authRes = await api.post('/api/users/login', { email, password });
      await setToken(authRes.data.token);
      await setUser(authRes.data);
      setAuth(true);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      <KeyboardAvoidingView style={tw`flex-1`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.View style={[tw`flex-1 justify-center p-8`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center mb-8 border border-[#2d3555]`}
          >
            <Text style={tw`text-white font-bold text-lg`}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <Text style={tw`text-4xl font-black text-white mb-2`}>Welcome{'\n'}Back 👋</Text>
          <Text style={tw`text-[#8892b0] mb-10 text-base font-medium`}>Log in to continue your adventure.</Text>

          {/* Email */}
          <View style={tw`mb-5`}>
            <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Email</Text>
            <View style={tw`bg-[#1a1f35] border border-[#2d3555] rounded-2xl px-4 py-1 flex-row items-center`}>
              <Text style={tw`text-[#6c5ce7] mr-3 text-lg`}>✉</Text>
              <TextInput
                style={tw`flex-1 text-white text-base py-3`}
                placeholder="traveler@example.com"
                placeholderTextColor="#4a5568"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={tw`mb-8`}>
            <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Password</Text>
            <View style={tw`bg-[#1a1f35] border border-[#2d3555] rounded-2xl px-4 py-1 flex-row items-center`}>
              <Text style={tw`text-[#6c5ce7] mr-3 text-lg`}>🔒</Text>
              <TextInput
                style={tw`flex-1 text-white text-base py-3`}
                placeholder="••••••••"
                placeholderTextColor="#4a5568"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={tw`text-[#8892b0] font-bold text-sm`}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={tw`bg-[#6c5ce7] w-full rounded-2xl py-4.5 items-center ${loading ? 'opacity-70' : ''}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={tw`text-white font-black text-lg tracking-wide`}>{loading ? 'Logging in...' : 'Log In →'}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={tw`flex-row items-center my-7`}>
            <View style={tw`flex-1 h-px bg-[#2d3555]`} />
            <Text style={tw`mx-4 text-[#4a5568] font-bold text-xs tracking-widest`}>OR</Text>
            <View style={tw`flex-1 h-px bg-[#2d3555]`} />
          </View>

          {/* Google Sign In */}
          <TouchableOpacity
            style={tw`bg-[#1a1f35] border border-[#2d3555] w-full rounded-2xl py-4 flex-row justify-center items-center ${!request ? 'opacity-40' : ''}`}
            onPress={() => promptAsync()}
            disabled={!request || loading}
          >
            <Text style={tw`text-xl mr-3`}>🔵</Text>
            <Text style={tw`text-[#ccd6f6] font-bold text-base`}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={tw`flex-row justify-center mt-8`}>
            <Text style={tw`text-[#8892b0]`}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={tw`text-[#6c5ce7] font-bold`}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
