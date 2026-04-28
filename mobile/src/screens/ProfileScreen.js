import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, Animated, KeyboardAvoidingView, Platform } from 'react-native';
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
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
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
      <SafeAreaView style={tw`flex-1 bg-[#0a0e1a] items-center justify-center`}>
        <Text style={tw`text-lg font-bold text-[#8892b0]`}>Loading Profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      <KeyboardAvoidingView style={tw`flex-1`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={tw`p-6 pb-16`}>
          <Animated.View style={{ opacity: fadeAnim }}>

            {/* Header */}
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center border border-[#2d3555]`}>
                <Text style={tw`font-bold text-white text-lg`}>←</Text>
              </TouchableOpacity>
              <Text style={tw`text-2xl font-black text-white`}>My Profile</Text>
              <View style={tw`w-11`} />
            </View>

            {/* Avatar */}
            <View style={tw`items-center mb-8`}>
              <View style={tw`w-24 h-24 bg-[#6c5ce7] rounded-3xl items-center justify-center mb-3`}>
                <Text style={tw`text-white text-4xl font-bold`}>{name.charAt(0)}</Text>
              </View>
              <Text style={tw`text-xl font-bold text-white`}>{name}</Text>
              <Text style={tw`text-[#8892b0] font-medium`}>{email}</Text>
            </View>

            {/* Profile Form */}
            <View style={tw`bg-[#1a1f35] p-6 rounded-3xl border border-[#2d3555] mb-6`}>
              <Text style={tw`text-xs font-bold text-[#6c5ce7] tracking-widest uppercase mb-4`}>PERSONAL DETAILS</Text>

              {/* Bio */}
              <View style={tw`mb-5`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Travel Biography</Text>
                <TextInput
                  style={tw`w-full bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-base text-white`}
                  placeholder="Tell others about your travel style..."
                  placeholderTextColor="#4a5568"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  value={bio}
                  onChangeText={setBio}
                />
              </View>

              {/* Hobbies */}
              <View style={tw`mb-5`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Hobbies</Text>
                <TextInput
                  style={tw`w-full bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-base text-white`}
                  placeholder="e.g. Hiking, Photography, Food"
                  placeholderTextColor="#4a5568"
                  value={hobbies}
                  onChangeText={setHobbies}
                />
              </View>

              {/* Skills */}
              <View style={tw`mb-6`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 ml-1 uppercase tracking-wider`}>Skills</Text>
                <TextInput
                  style={tw`w-full bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-base text-white`}
                  placeholder="e.g. Translation, Driving, Photography"
                  placeholderTextColor="#4a5568"
                  value={skills}
                  onChangeText={setSkills}
                />
              </View>

              {/* Save */}
              <TouchableOpacity
                style={tw`bg-[#6c5ce7] w-full rounded-2xl py-4.5 items-center ${loading ? 'opacity-70' : ''}`}
                onPress={handleUpdateProfile}
                disabled={loading}
              >
                <Text style={tw`text-white font-black text-lg tracking-wide`}>{loading ? 'Saving...' : 'Save Profile →'}</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
