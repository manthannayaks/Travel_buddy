import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function LocalBuddyScreen({ navigation }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/guides')
      .then(res => setGuides(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-6 border-b border-gray-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-4`}>
          <Text style={tw`font-bold text-gray-700`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-2xl font-extrabold text-indigo-900`}>Hire Local Guide</Text>
      </View>
      
      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={tw`p-6 pb-12`}>
          {guides.length === 0 ? (
            <Text style={tw`text-center text-gray-500 mt-10 text-lg font-medium`}>No verified local guides found.</Text>
          ) : guides.map(guide => (
            <View key={guide._id} style={tw`bg-white p-5 rounded-3xl mb-5 shadow-sm border border-gray-100`}>
              <View style={tw`flex-row items-center mb-4 pb-4 border-b border-gray-50`}>
                <View style={tw`bg-indigo-100 w-14 h-14 rounded-full items-center justify-center mr-4`}>
                  <Text style={tw`text-2xl`}>🤝</Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-gray-900 font-black text-lg`}>{guide.name}</Text>
                  <Text style={tw`text-indigo-600 font-bold`}>📍 {guide.location}</Text>
                </View>
                <View style={tw`bg-green-100 px-3 py-1 rounded-full`}>
                  <Text style={tw`text-green-800 font-bold text-xs uppercase`}>Verified</Text>
                </View>
              </View>
              
              <Text style={tw`text-gray-600 mb-4 font-medium italic`}>"{guide.expertise}"</Text>
              
              <View style={tw`flex-row justify-between items-center bg-gray-50 p-4 rounded-2xl`}>
                <Text style={tw`text-indigo-900 font-black text-xl`}>${guide.rate}/day</Text>
                <TouchableOpacity style={tw`bg-indigo-600 px-6 py-3 rounded-xl shadow-md`}>
                  <Text style={tw`text-white font-bold tracking-wide`}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
