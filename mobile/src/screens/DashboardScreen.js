import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import { getUser, logout } from '../utils/auth';

export default function DashboardScreen({ navigation, setAuth }) {
  const [user, setUserData] = useState(null);

  useEffect(() => {
    getUser().then(res => setUserData(res));
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-6 pb-12`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-8 mt-2`}>
          <View>
            <Text style={tw`text-gray-500 font-medium text-sm`}>Welcome Back,</Text>
            <Text style={tw`text-2xl font-extrabold text-blue-900 capitalize`}>{user?.name || 'Traveler'}</Text>
          </View>
          <TouchableOpacity 
            style={tw`w-12 h-12 bg-blue-600 rounded-full items-center justify-center shadow-md`}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={tw`text-white text-xl font-bold`}>{user?.name?.charAt(0) || 'U'}</Text>
          </TouchableOpacity>
        </View>

        {/* Level Card */}
        <View style={tw`bg-blue-600 rounded-3xl p-6 mb-8 shadow-lg`}>
          <Text style={tw`text-blue-100 font-bold tracking-widest text-xs mb-1 uppercase`}>Explorer Level</Text>
          <Text style={tw`text-white text-3xl font-black mb-4`}>Globetrotter</Text>
          
          <View style={tw`flex-row justify-between border-t border-blue-500 pt-4`}>
            <View>
              <Text style={tw`text-blue-200 text-xs`}>Connections</Text>
              <Text style={tw`text-white font-bold text-lg`}>12</Text>
            </View>
            <View>
              <Text style={tw`text-blue-200 text-xs`}>Trips</Text>
              <Text style={tw`text-white font-bold text-lg`}>4</Text>
            </View>
            <View>
              <Text style={tw`text-blue-200 text-xs`}>Reviews</Text>
              <Text style={tw`text-white font-bold text-lg`}>4.8 ⭐</Text>
            </View>
          </View>
        </View>

        {/* Actions Grid */}
        <Text style={tw`text-xl font-extrabold text-gray-900 mb-4 ml-1`}>Quick Actions</Text>
        <View style={tw`flex-row flex-wrap justify-between`}>
          <ActionCard icon="✈️" title="Find Buddy" color="bg-blue-500" onPress={() => navigation.navigate('TravelMatch')} />
          <ActionCard icon="🤝" title="Hire Local" color="bg-indigo-500" onPress={() => navigation.navigate('LocalBuddy')} />
          <ActionCard icon="🎁" title="Sponsors" color="bg-emerald-500" />
          <ActionCard icon="💡" title="Skills" color="bg-yellow-500" onPress={() => navigation.navigate('SkillExchange')} />
        </View>

        {/* Admin Center (Only visible for Admins) */}
        {user?.isAdmin && (
          <TouchableOpacity 
            style={tw`bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mt-6 shadow-sm flex-row items-center justify-between`}
            onPress={() => navigation.navigate('Admin')}
          >
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center mb-1`}>
                <Text style={tw`text-indigo-500 font-bold text-lg mr-2`}>👑</Text>
                <Text style={tw`text-indigo-900 font-bold text-lg`}>Admin Control Center</Text>
              </View>
              <Text style={tw`text-indigo-700 text-xs font-medium ml-8 leading-snug`}>Tap here to manage all users and platform statistics.</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Medical Safety */}
        <TouchableOpacity style={tw`bg-red-50 border border-red-200 rounded-2xl p-6 mt-4 shadow-sm flex-row items-center justify-between`}>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center mb-1`}>
              <Text style={tw`text-red-500 font-bold text-lg mr-2`}>🚨</Text>
              <Text style={tw`text-red-900 font-bold text-lg`}>Medical Safety</Text>
            </View>
            <Text style={tw`text-red-700 text-xs font-medium ml-8 leading-snug`}>Tap here for emergency contacts, hospitals, and first aid guide.</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({ icon, title, color, onPress }) {
  return (
    <TouchableOpacity 
      style={tw`bg-white w-[48%] p-5 rounded-2xl mb-4 shadow-sm border border-gray-100 items-center`}
      onPress={onPress}
    >
      <View style={tw`${color} w-14 h-14 rounded-full items-center justify-center mb-3 shadow-sm`}>
        <Text style={tw`text-2xl`}>{icon}</Text>
      </View>
      <Text style={tw`font-bold text-gray-800`}>{title}</Text>
    </TouchableOpacity>
  );
}
