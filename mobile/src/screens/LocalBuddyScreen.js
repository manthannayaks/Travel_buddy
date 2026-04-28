import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function LocalBuddyScreen({ navigation }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    api.get('/api/guides')
      .then(res => setGuides(res.data))
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
          <Text style={tw`text-2xl font-black text-white`}>Local Guides</Text>
          <Text style={tw`text-[#8892b0] text-xs font-medium`}>Verified local experts near you</Text>
        </View>
      </View>

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
                <Text style={tw`text-[#8892b0] text-center text-sm font-medium px-8`}>No verified local guides are available yet. Check back soon!</Text>
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
                    <Text style={tw`text-[#00cec9] font-bold text-xs uppercase`}>Verified</Text>
                  </View>
                </View>

                <Text style={tw`text-[#8892b0] mb-4 font-medium italic`}>"{guide.expertise}"</Text>

                <View style={tw`flex-row justify-between items-center bg-[#0a0e1a] p-4 rounded-2xl`}>
                  <Text style={tw`text-white font-black text-xl`}>${guide.rate}<Text style={tw`text-[#8892b0] text-sm font-medium`}>/day</Text></Text>
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
