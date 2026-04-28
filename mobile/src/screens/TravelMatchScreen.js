import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function TravelMatchScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/trips/matches')
      .then(res => setTrips(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-6 border-b border-gray-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-4`}>
          <Text style={tw`font-bold text-gray-700`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-2xl font-extrabold text-blue-900`}>Find a Buddy</Text>
      </View>
      
      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={tw`p-6 pb-12`}>
          {trips.length === 0 ? (
            <Text style={tw`text-center text-gray-500 mt-10 text-lg font-medium`}>No trips available right now. Be the first to post!</Text>
          ) : trips.map(trip => (
            <View key={trip._id} style={tw`bg-white p-5 rounded-3xl mb-5 shadow-sm border border-gray-100`}>
              <View style={tw`bg-blue-50 rounded-2xl p-4 mb-4`}>
                <Text style={tw`text-blue-800 font-black text-lg mb-1 uppercase tracking-wider`}>📍 {trip.destination}</Text>
                <Text style={tw`text-blue-600 font-bold`}>🗓️ {new Date(trip.date).toLocaleDateString()}</Text>
              </View>
              <Text style={tw`text-gray-900 font-black text-xl mb-2`}>{trip.title}</Text>
              <Text style={tw`text-gray-600 mb-5 leading-relaxed`} numberOfLines={3}>{trip.description}</Text>
              
              <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row items-center flex-1`}>
                  <View style={tw`bg-gray-300 w-10 h-10 rounded-full items-center justify-center mr-3`}>
                    <Text style={tw`font-bold text-gray-700`}>{trip.creator?.name?.charAt(0) || 'U'}</Text>
                  </View>
                  <Text style={tw`text-gray-700 font-bold text-sm`}>{trip.creator?.name || 'Traveler'}</Text>
                </View>
                <TouchableOpacity style={tw`bg-blue-600 px-5 py-3 rounded-xl shadow-md`}>
                  <Text style={tw`text-white font-bold tracking-wide`}>Connect</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
