import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';
import { setUser, getStoredUser } from '../utils/auth';

export default function ProfileScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await api.get('/api/users/me');
      setName(data.name || '');
      setEmail(data.email || '');
      setBio(data.bio || '');
      setHobbies(data.hobbies ? data.hobbies.join(', ') : '');
      setSkills(data.skills ? data.skills.join(', ') : '');
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile details.');
    } finally {
      setInitialLoad(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Convert comma-separated strings to arrays
      const hobbiesArray = hobbies.split(',').map(item => item.trim()).filter(Boolean);
      const skillsArray = skills.split(',').map(item => item.trim()).filter(Boolean);

      const { data } = await api.put('/api/users/profile', {
        name,
        bio,
        hobbies: hobbiesArray,
        skills: skillsArray
      });

      await setUser(data);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Update Failed', error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 items-center justify-center`}>
        <Text style={tw`text-lg font-bold text-gray-500`}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-6 pb-12`}>
        
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-gray-200 w-10 h-10 rounded-full items-center justify-center`}>
            <Text style={tw`font-bold text-gray-700`}>←</Text>
          </TouchableOpacity>
          <Text style={tw`text-2xl font-black text-blue-900`}>My Profile</Text>
          <View style={tw`w-10`} />
        </View>

        <View style={tw`items-center mb-8`}>
          <View style={tw`w-24 h-24 bg-blue-600 rounded-full items-center justify-center shadow-md mb-3`}>
            <Text style={tw`text-white text-4xl font-bold`}>{name.charAt(0)}</Text>
          </View>
          <Text style={tw`text-xl font-bold text-gray-800`}>{name}</Text>
          <Text style={tw`text-gray-500 font-medium`}>{email}</Text>
        </View>

        <View style={tw`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6`}>
          <Text style={tw`text-lg font-extrabold text-gray-800 mb-4`}>Personal Details</Text>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-bold text-gray-600 mb-1 ml-1`}>Travel Biography</Text>
            <TextInput 
              style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`}
              placeholder="Tell others about your travel style..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={bio}
              onChangeText={setBio}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-bold text-gray-600 mb-1 ml-1`}>Hobbies (comma separated)</Text>
            <TextInput 
              style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`}
              placeholder="e.g. Hiking, Photography, Food Tasting"
              value={hobbies}
              onChangeText={setHobbies}
            />
          </View>

          <View style={tw`mb-6`}>
            <Text style={tw`text-sm font-bold text-gray-600 mb-1 ml-1`}>Skills (comma separated)</Text>
            <TextInput 
              style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800`}
              placeholder="e.g. Translation, Driving, Content Creation"
              value={skills}
              onChangeText={setSkills}
            />
          </View>

          <TouchableOpacity 
            style={tw`bg-blue-600 w-full rounded-2xl py-4 items-center shadow-lg mb-4 ${loading ? 'opacity-70' : ''}`}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={tw`text-white font-bold text-lg`}>{loading ? 'Saving Changes...' : 'Save Profile'}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={tw`bg-red-50 border border-red-200 w-full rounded-2xl py-4 items-center shadow-sm`}
            onPress={async () => {
              const { logout } = require('../utils/auth');
              await logout();
              // In mobile, we might need a context or AppNavigator restart, 
              // but reloading the app handles temporary mobile UX.
              Alert.alert('Logged Out', 'Please restart the app to clear session fully.');
            }}
          >
            <Text style={tw`text-red-600 font-bold text-lg`}>Log Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
