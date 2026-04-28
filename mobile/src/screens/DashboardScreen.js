import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import tw from 'twrnc';
import { getUser, logout } from '../utils/auth';

export default function DashboardScreen({ navigation, setAuth }) {
  const [user, setUserData] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    getUser().then(res => setUserData(res));
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    await logout();
    setAuth(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      <ScrollView contentContainerStyle={tw`p-6 pb-16`}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Header */}
          <View style={tw`flex-row justify-between items-center mb-8 mt-2`}>
            <View>
              <Text style={tw`text-[#8892b0] font-medium text-sm`}>Welcome Back,</Text>
              <Text style={tw`text-2xl font-black text-white capitalize`}>{user?.name || 'Traveler'} 👋</Text>
            </View>
            <TouchableOpacity
              style={tw`w-12 h-12 bg-[#6c5ce7] rounded-2xl items-center justify-center`}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={tw`text-white text-xl font-bold`}>{user?.name?.charAt(0) || 'U'}</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Card */}
          <View style={tw`bg-[#1a1f35] rounded-3xl p-6 mb-8 border border-[#2d3555]`}>
            <View style={tw`flex-row items-center mb-4`}>
              <View style={tw`w-10 h-10 bg-[#6c5ce720] rounded-xl items-center justify-center mr-3`}>
                <Text style={tw`text-lg`}>🏆</Text>
              </View>
              <View>
                <Text style={tw`text-[#8892b0] font-bold tracking-widest text-xs uppercase`}>Explorer Level</Text>
                <Text style={tw`text-white text-2xl font-black`}>Globetrotter</Text>
              </View>
            </View>

            <View style={tw`flex-row justify-between bg-[#0a0e1a] rounded-2xl p-4 mt-2`}>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-[#6c5ce7] font-black text-2xl`}>12</Text>
                <Text style={tw`text-[#8892b0] text-xs font-bold mt-1`}>Connections</Text>
              </View>
              <View style={tw`w-px bg-[#2d3555]`} />
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-[#00cec9] font-black text-2xl`}>4</Text>
                <Text style={tw`text-[#8892b0] text-xs font-bold mt-1`}>Trips</Text>
              </View>
              <View style={tw`w-px bg-[#2d3555]`} />
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-[#fdcb6e] font-black text-2xl`}>4.8⭐</Text>
                <Text style={tw`text-[#8892b0] text-xs font-bold mt-1`}>Reviews</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={tw`text-xs font-bold text-[#6c5ce7] tracking-widest uppercase mb-2 ml-1`}>EXPLORE</Text>
          <Text style={tw`text-xl font-black text-white mb-5`}>Quick Actions</Text>

          <View style={tw`flex-row flex-wrap justify-between`}>
            <ActionCard icon="✈️" title="Find Buddy" subtitle="Match travelers" color="#6c5ce7" onPress={() => navigation.navigate('TravelMatch')} />
            <ActionCard icon="🤝" title="Local Guide" subtitle="Hire experts" color="#00cec9" onPress={() => navigation.navigate('LocalBuddy')} />
            <ActionCard icon="🎁" title="Sponsors" subtitle="Get funded" color="#e17055" onPress={() => {}} />
            <ActionCard icon="💡" title="Skills" subtitle="Trade talents" color="#fdcb6e" onPress={() => navigation.navigate('SkillExchange')} />
          </View>

          {/* Admin Panel */}
          {user?.isAdmin && (
            <TouchableOpacity
              style={tw`bg-[#1a1f35] border border-[#6c5ce7] rounded-2xl p-5 mt-4 flex-row items-center`}
              onPress={() => navigation.navigate('Admin')}
            >
              <View style={tw`w-12 h-12 bg-[#6c5ce720] rounded-2xl items-center justify-center mr-4`}>
                <Text style={tw`text-2xl`}>👑</Text>
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-white font-bold text-lg`}>Admin Control Center</Text>
                <Text style={tw`text-[#8892b0] text-xs font-medium mt-1`}>Manage users and platform statistics</Text>
              </View>
              <Text style={tw`text-[#6c5ce7] font-bold`}>→</Text>
            </TouchableOpacity>
          )}

          {/* Medical Safety */}
          <TouchableOpacity style={tw`bg-[#1a1f35] border border-[#ff6b6b40] rounded-2xl p-5 mt-4 flex-row items-center`}>
            <View style={tw`w-12 h-12 bg-[#ff6b6b20] rounded-2xl items-center justify-center mr-4`}>
              <Text style={tw`text-2xl`}>🚨</Text>
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white font-bold text-lg`}>Medical Safety</Text>
              <Text style={tw`text-[#8892b0] text-xs font-medium mt-1`}>Emergency contacts, hospitals & first aid</Text>
            </View>
            <Text style={tw`text-[#ff6b6b] font-bold`}>→</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={tw`bg-[#1a1f35] border border-[#2d3555] rounded-2xl py-4 items-center mt-8`}
            onPress={handleLogout}
          >
            <Text style={tw`text-[#ff6b6b] font-bold text-base`}>Log Out</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionCard({ icon, title, subtitle, color, onPress }) {
  return (
    <TouchableOpacity
      style={tw`bg-[#1a1f35] w-[48%] p-5 rounded-2xl mb-4 border border-[#2d3555] items-center`}
      onPress={onPress}
    >
      <View style={[tw`w-14 h-14 rounded-2xl items-center justify-center mb-3`, { backgroundColor: color + '20' }]}>
        <Text style={tw`text-2xl`}>{icon}</Text>
      </View>
      <Text style={tw`font-bold text-white text-base`}>{title}</Text>
      <Text style={tw`text-[#8892b0] text-xs font-medium mt-1`}>{subtitle}</Text>
    </TouchableOpacity>
  );
}
