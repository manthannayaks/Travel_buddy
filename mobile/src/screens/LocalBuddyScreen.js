import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function LocalBuddyScreen({ navigation }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Form fields
  const [location, setLocation] = useState('');
  const [expertise, setExpertise] = useState('');
  const [price, setPrice] = useState('');
  const [languages, setLanguages] = useState('');

  const fetchGuides = () => {
    setLoading(true);
    api.get('/api/guides')
      .then(res => setGuides(res.data))
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
  };

  useEffect(() => { fetchGuides(); }, []);

  const handleBecomeGuide = async () => {
    if (!location || !expertise || !price) {
      return Alert.alert('Error', 'Please fill location, expertise, and price');
    }
    setPosting(true);
    try {
      await api.post('/api/guides', {
        location,
        expertise,
        price,
        languages: languages ? languages.split(',').map(l => l.trim()) : ['English']
      });
      Alert.alert('🤝 Guide Registered!', 'You are now listed as a local guide.');
      setShowForm(false);
      setLocation(''); setExpertise(''); setPrice(''); setLanguages('');
      fetchGuides();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to register as guide');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between p-6 border-b border-[#2d3555]`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center mr-4 border border-[#2d3555]`}>
            <Text style={tw`font-bold text-white text-lg`}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={tw`text-2xl font-black text-white`}>Local Guides</Text>
            <Text style={tw`text-[#8892b0] text-xs font-medium`}>{guides.length} guides available</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowForm(true)} style={tw`bg-[#00cec9] px-3 py-2.5 rounded-xl`}>
          <Text style={tw`text-[#0a0e1a] font-bold text-xs`}>Become Guide</Text>
        </TouchableOpacity>
      </View>

      {/* Register as Guide Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView style={tw`flex-1`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={tw`flex-1 bg-[#0a0e1a] bg-opacity-95 justify-end`}>
            <View style={tw`bg-[#1a1f35] rounded-t-3xl p-6 border-t border-[#2d3555]`}>
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <Text style={tw`text-2xl font-black text-white`}>Become a Guide 🤝</Text>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Text style={tw`text-[#8892b0] font-bold text-lg`}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Your Location</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="e.g. Delhi, India" placeholderTextColor="#4a5568" value={location} onChangeText={setLocation} />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Expertise</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="e.g. History & Food Tours" placeholderTextColor="#4a5568" value={expertise} onChangeText={setExpertise} />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Price Per Day</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="e.g. $25/day" placeholderTextColor="#4a5568" value={price} onChangeText={setPrice} />
              </View>

              <View style={tw`mb-6`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Languages (comma separated)</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="e.g. English, Hindi, French" placeholderTextColor="#4a5568" value={languages} onChangeText={setLanguages} />
              </View>

              <TouchableOpacity style={tw`bg-[#00cec9] rounded-2xl py-4.5 items-center ${posting ? 'opacity-70' : ''}`} onPress={handleBecomeGuide} disabled={posting}>
                <Text style={tw`text-[#0a0e1a] font-black text-lg`}>{posting ? 'Registering...' : 'Register as Guide →'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#00cec9" />
          <Text style={tw`text-[#8892b0] mt-4 font-medium`}>Finding guides...</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView contentContainerStyle={tw`p-6 pb-16`}>
            {guides.length === 0 ? (
              <View style={tw`items-center mt-16`}>
                <Text style={tw`text-6xl mb-4`}>🤝</Text>
                <Text style={tw`text-white text-xl font-bold mb-2`}>No guides found</Text>
                <Text style={tw`text-[#8892b0] text-center text-sm font-medium px-8 mb-6`}>Be the first local guide! Share your expertise.</Text>
                <TouchableOpacity onPress={() => setShowForm(true)} style={tw`bg-[#00cec9] px-8 py-3 rounded-xl`}>
                  <Text style={tw`text-[#0a0e1a] font-bold`}>Become a Guide</Text>
                </TouchableOpacity>
              </View>
            ) : guides.map(guide => (
              <View key={guide._id} style={tw`bg-[#1a1f35] p-5 rounded-3xl mb-5 border border-[#2d3555]`}>
                <View style={tw`flex-row items-center mb-4 pb-4 border-b border-[#2d3555]`}>
                  <View style={tw`bg-[#00cec920] w-14 h-14 rounded-2xl items-center justify-center mr-4`}>
                    <Text style={tw`text-2xl`}>🤝</Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white font-black text-lg`}>{guide.name}</Text>
                    <Text style={tw`text-[#00cec9] font-bold text-sm`}>📍 {guide.location}</Text>
                  </View>
                  <View style={tw`bg-[#00cec920] px-3 py-1.5 rounded-full border border-[#00cec9]`}>
                    <Text style={tw`text-[#00cec9] font-bold text-xs`}>⭐ {guide.rating}</Text>
                  </View>
                </View>

                <Text style={tw`text-[#8892b0] mb-2 font-medium`}>🎯 {guide.expertise}</Text>
                <Text style={tw`text-[#8892b0] mb-4 text-xs`}>🗣️ {guide.languages?.join(', ')}</Text>

                <View style={tw`flex-row justify-between items-center bg-[#0a0e1a] p-4 rounded-2xl`}>
                  <Text style={tw`text-white font-black text-xl`}>{guide.price}</Text>
                  <TouchableOpacity style={tw`bg-[#00cec9] px-6 py-3 rounded-xl`}>
                    <Text style={tw`text-[#0a0e1a] font-bold tracking-wide`}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
