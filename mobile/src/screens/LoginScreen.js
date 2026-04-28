import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
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
      setAuth(true); // Triggers AppNavigator to switch to Dashboard
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white justify-center`}>
      <View style={tw`p-8`}>
        <Text style={tw`text-4xl font-extrabold text-blue-600 mb-2`}>Welcome Back</Text>
        <Text style={tw`text-gray-500 mb-10 text-base`}>Log in to continue your journey.</Text>

        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-bold text-gray-700 mb-1 ml-1`}>Email Address</Text>
          <TextInput 
            style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`}
            placeholder="traveler@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={tw`mb-8`}>
          <Text style={tw`text-sm font-bold text-gray-700 mb-1 ml-1`}>Password</Text>
          <TextInput 
            style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={tw`bg-blue-600 w-full rounded-2xl py-4 items-center shadow-lg ${loading ? 'opacity-70' : ''}`}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={tw`text-white font-bold text-lg`}>{loading ? 'Logging in...' : 'Log In'}</Text>
        </TouchableOpacity>

        <View style={tw`flex-row items-center my-6`}>
          <View style={tw`flex-1 h-px bg-gray-200`} />
          <Text style={tw`mx-4 text-gray-400 font-bold`}>OR</Text>
          <View style={tw`flex-1 h-px bg-gray-200`} />
        </View>

        <TouchableOpacity 
          style={tw`bg-white border border-gray-200 w-full rounded-2xl py-4 flex-row justify-center items-center shadow-sm mb-2 ${!request ? 'opacity-50' : ''}`}
          onPress={() => promptAsync()}
          disabled={!request || loading}
        >
          <Text style={tw`text-xl mr-3`}>🇬</Text>
          <Text style={tw`text-gray-800 font-bold text-lg`}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={tw`flex-row justify-center mt-6`}>
          <Text style={tw`text-gray-600`}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={tw`text-blue-600 font-bold`}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
