import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function SkillExchangeScreen({ navigation }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/skills')
      .then(res => setSkills(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`flex-row items-center p-6 border-b border-gray-100 bg-white`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-4`}>
          <Text style={tw`font-bold text-gray-700`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-2xl font-extrabold text-yellow-900`}>Skill Exchange</Text>
      </View>
      
      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#eab308" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={tw`p-6 pb-12`}>
          {skills.length === 0 ? (
            <Text style={tw`text-center text-gray-500 mt-10 text-lg font-medium`}>No skills listed for exchange yet.</Text>
          ) : skills.map(skill => (
            <View key={skill._id} style={tw`bg-white p-5 rounded-3xl mb-5 shadow-sm border border-gray-100`}>
              <View style={tw`bg-yellow-50 rounded-2xl p-4 mb-4 flex-row items-center border border-yellow-100`}>
                <View style={tw`bg-yellow-400 w-12 h-12 rounded-full items-center justify-center mr-3 shadow-md`}>
                  <Text style={tw`text-white font-black text-xl`}>💡</Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-yellow-800 font-black text-lg`}>{skill.title}</Text>
                  <Text style={tw`text-yellow-600 font-bold uppercase text-xs tracking-wider`}>Trade for: {skill.tradingFor}</Text>
                </View>
              </View>
              
              <Text style={tw`text-gray-600 mb-5 leading-relaxed`} numberOfLines={4}>{skill.description}</Text>
              
              <View style={tw`flex-row justify-between items-center bg-gray-50 p-4 rounded-2xl`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`bg-gray-300 w-10 h-10 rounded-full items-center justify-center mr-3`}>
                    <Text style={tw`font-bold text-gray-700`}>{skill.creator?.name?.charAt(0) || 'U'}</Text>
                  </View>
                  <Text style={tw`text-gray-700 font-bold text-sm`}>{skill.creator?.name || 'Traveler'}</Text>
                </View>
                <TouchableOpacity style={tw`bg-yellow-500 px-5 py-3 rounded-xl shadow-md`}>
                  <Text style={tw`text-yellow-900 font-black tracking-wide`}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
