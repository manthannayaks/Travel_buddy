import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function TravelMatchScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    api.get('/api/trips/matches')
      .then(res => setTrips(res.data))
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      {/* Header */}
      <View style={tw`flex-row items-center p-6 border-b border-[#2d3555]`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center mr-4 border border-[#2d3555]`}>
          <Text style={tw`font-bold text-white text-lg`}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={tw`text-2xl font-black text-white`}>Find a Buddy</Text>
          <Text style={tw`text-[#8892b0] text-xs font-medium`}>Connect with travelers worldwide</Text>
        </View>
      </View>

      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#6c5ce7" />
          <Text style={tw`text-[#8892b0] mt-4 font-medium`}>Finding matches...</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView contentContainerStyle={tw`p-6 pb-16`}>
            {trips.length === 0 ? (
              <View style={tw`items-center mt-16`}>
                <Text style={tw`text-6xl mb-4`}>✈️</Text>
                <Text style={tw`text-white text-xl font-bold mb-2`}>No trips yet</Text>
                <Text style={tw`text-[#8892b0] text-center text-sm font-medium px-8`}>Be the first to post a trip and find your travel buddy!</Text>
              </View>
            ) : trips.map(trip => (
              <View key={trip._id} style={tw`bg-[#1a1f35] p-5 rounded-3xl mb-5 border border-[#2d3555]`}>
                <View style={tw`bg-[#6c5ce720] rounded-2xl p-4 mb-4`}>
                  <Text style={tw`text-[#a78bfa] font-black text-lg mb-1 uppercase tracking-wider`}>📍 {trip.destination}</Text>
                  <Text style={tw`text-[#8892b0] font-bold text-sm`}>🗓️ {new Date(trip.date).toLocaleDateString()}</Text>
                </View>
                <Text style={tw`text-white font-black text-xl mb-2`}>{trip.title}</Text>
                <Text style={tw`text-[#8892b0] mb-5 leading-relaxed text-sm`} numberOfLines={3}>{trip.description}</Text>

                <View style={tw`flex-row justify-between items-center bg-[#0a0e1a] p-4 rounded-2xl`}>
                  <View style={tw`flex-row items-center flex-1`}>
                    <View style={tw`bg-[#6c5ce7] w-10 h-10 rounded-full items-center justify-center mr-3`}>
                      <Text style={tw`font-bold text-white`}>{trip.creator?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <Text style={tw`text-white font-bold text-sm`}>{trip.creator?.name || 'Traveler'}</Text>
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
