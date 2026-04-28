import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function TravelMatchScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Form fields
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  const fetchTrips = () => {
    setLoading(true);
    api.get('/api/trips')
      .then(res => setTrips(res.data))
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
  };

  useEffect(() => { fetchTrips(); }, []);

  const handlePostTrip = async () => {
    if (!destination || !startDate || !endDate || !budget) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    setPosting(true);
    try {
      await api.post('/api/trips', {
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: Number(budget)
      });
      Alert.alert('🎉 Trip Posted!', 'Your trip is now visible to other travelers.');
      setShowForm(false);
      setDestination(''); setStartDate(''); setEndDate(''); setBudget('');
      fetchTrips();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to post trip');
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
            <Text style={tw`text-2xl font-black text-white`}>Find a Buddy</Text>
            <Text style={tw`text-[#8892b0] text-xs font-medium`}>{trips.length} trips posted</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowForm(true)} style={tw`bg-[#6c5ce7] px-4 py-2.5 rounded-xl`}>
          <Text style={tw`text-white font-bold`}>+ Post</Text>
        </TouchableOpacity>
      </View>

      {/* Post Trip Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView style={tw`flex-1`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={tw`flex-1 bg-[#0a0e1a] bg-opacity-95 justify-end`}>
            <View style={tw`bg-[#1a1f35] rounded-t-3xl p-6 border-t border-[#2d3555]`}>
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <Text style={tw`text-2xl font-black text-white`}>Post a Trip ✈️</Text>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Text style={tw`text-[#8892b0] font-bold text-lg`}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Destination</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="e.g. Tokyo, Japan" placeholderTextColor="#4a5568" value={destination} onChangeText={setDestination} />
              </View>

              <View style={tw`flex-row gap-3 mb-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Start Date</Text>
                  <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="2025-06-15" placeholderTextColor="#4a5568" value={startDate} onChangeText={setStartDate} />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>End Date</Text>
                  <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="2025-06-20" placeholderTextColor="#4a5568" value={endDate} onChangeText={setEndDate} />
                </View>
              </View>

              <View style={tw`mb-6`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Budget ($)</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="1500" placeholderTextColor="#4a5568" keyboardType="numeric" value={budget} onChangeText={setBudget} />
              </View>

              <TouchableOpacity style={tw`bg-[#6c5ce7] rounded-2xl py-4.5 items-center ${posting ? 'opacity-70' : ''}`} onPress={handlePostTrip} disabled={posting}>
                <Text style={tw`text-white font-black text-lg`}>{posting ? 'Posting...' : 'Post Trip →'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#6c5ce7" />
          <Text style={tw`text-[#8892b0] mt-4 font-medium`}>Finding trips...</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView contentContainerStyle={tw`p-6 pb-16`}>
            {trips.length === 0 ? (
              <View style={tw`items-center mt-16`}>
                <Text style={tw`text-6xl mb-4`}>✈️</Text>
                <Text style={tw`text-white text-xl font-bold mb-2`}>No trips yet</Text>
                <Text style={tw`text-[#8892b0] text-center text-sm font-medium px-8 mb-6`}>Be the first to post a trip and find your travel buddy!</Text>
                <TouchableOpacity onPress={() => setShowForm(true)} style={tw`bg-[#6c5ce7] px-8 py-3 rounded-xl`}>
                  <Text style={tw`text-white font-bold`}>Post Your First Trip</Text>
                </TouchableOpacity>
              </View>
            ) : trips.map(trip => (
              <View key={trip._id} style={tw`bg-[#1a1f35] p-5 rounded-3xl mb-5 border border-[#2d3555]`}>
                <View style={tw`bg-[#6c5ce720] rounded-2xl p-4 mb-4`}>
                  <Text style={tw`text-[#a78bfa] font-black text-lg mb-1 uppercase tracking-wider`}>📍 {trip.destination}</Text>
                  <Text style={tw`text-[#8892b0] font-bold text-sm`}>🗓️ {new Date(trip.startDate).toLocaleDateString()} → {new Date(trip.endDate).toLocaleDateString()}</Text>
                </View>
                <View style={tw`flex-row justify-between items-center mb-3`}>
                  <Text style={tw`text-white font-black text-xl`}>💰 ${trip.budget}</Text>
                  <Text style={tw`text-[#8892b0] text-xs`}>Budget</Text>
                </View>
                <View style={tw`flex-row justify-between items-center bg-[#0a0e1a] p-4 rounded-2xl`}>
                  <View style={tw`flex-row items-center flex-1`}>
                    <View style={tw`bg-[#6c5ce7] w-10 h-10 rounded-full items-center justify-center mr-3`}>
                      <Text style={tw`font-bold text-white`}>{trip.user?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <Text style={tw`text-white font-bold text-sm`}>{trip.user?.name || 'Traveler'}</Text>
                  </View>
                  <TouchableOpacity style={tw`bg-[#6c5ce7] px-6 py-3 rounded-xl`}>
                    <Text style={tw`text-white font-bold tracking-wide`}>Connect</Text>
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
