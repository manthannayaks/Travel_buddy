import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Animated } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function AdminScreen({ navigation }) {
  const [stats, setStats] = useState({ users: 0, trips: 0, sponsorships: 0, skills: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to load Admin Data');
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  };

  const handleDeleteUser = (id, isAdmin) => {
    if (isAdmin) {
      Alert.alert("Locked", "Cannot delete another administrator.");
      return;
    }
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to completely erase this user?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/admin/users/${id}`);
              setUsers(users.filter(u => u._id !== id));
              setStats(prev => ({ ...prev, users: prev.users - 1 }));
            } catch (err) {
              Alert.alert('Error', 'Failed to delete user.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-[#0a0e1a] items-center justify-center`}>
        <Text style={tw`text-lg font-bold text-[#8892b0]`}>Loading Control Center...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      <ScrollView contentContainerStyle={tw`p-6 pb-16`}>
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Header */}
          <View style={tw`flex-row justify-between items-center mb-8`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center border border-[#2d3555]`}>
              <Text style={tw`font-bold text-white text-lg`}>←</Text>
            </TouchableOpacity>
            <Text style={tw`text-2xl font-black text-white`}>👑 Admin Panel</Text>
            <View style={tw`w-11`} />
          </View>

          {/* Stats Grid */}
          <View style={tw`flex-row flex-wrap justify-between mb-8`}>
            <StatBox title="Users" value={stats.users} color="#6c5ce7" />
            <StatBox title="Trips" value={stats.trips} color="#00cec9" />
            <StatBox title="Sponsors" value={stats.sponsorships} color="#e17055" />
            <StatBox title="Skills" value={stats.skills} color="#fdcb6e" />
          </View>

          {/* User Management */}
          <Text style={tw`text-xs font-bold text-[#6c5ce7] tracking-widest uppercase mb-2 ml-1`}>MANAGEMENT</Text>
          <Text style={tw`text-xl font-black text-white mb-5`}>All Users</Text>

          {users.map(user => (
            <View key={user._id} style={tw`bg-[#1a1f35] p-5 rounded-2xl mb-4 border border-[#2d3555] flex-row justify-between items-center`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`bg-[#6c5ce7] w-10 h-10 rounded-full items-center justify-center mr-3`}>
                  <Text style={tw`font-bold text-white`}>{user.name?.charAt(0) || 'U'}</Text>
                </View>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row items-center mb-0.5`}>
                    <Text style={tw`font-bold text-base text-white mr-2`}>{user.name}</Text>
                    {user.isAdmin && (
                      <View style={tw`bg-[#6c5ce720] px-2 py-0.5 rounded-full border border-[#6c5ce7]`}>
                        <Text style={tw`text-[#a78bfa] text-xs font-bold`}>Admin</Text>
                      </View>
                    )}
                  </View>
                  <Text style={tw`text-[#8892b0] text-sm`}>{user.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={tw`bg-[#ff6b6b20] px-4 py-2.5 rounded-xl border border-[#ff6b6b40] ${user.isAdmin ? 'opacity-30' : ''}`}
                onPress={() => handleDeleteUser(user._id, user.isAdmin)}
                disabled={user.isAdmin}
              >
                <Text style={tw`text-[#ff6b6b] font-bold text-sm`}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ title, value, color }) {
  return (
    <View style={[tw`w-[48%] p-5 rounded-3xl mb-4 items-center border`, { backgroundColor: color + '15', borderColor: color + '30' }]}>
      <Text style={[tw`text-3xl font-black mb-1`, { color }]}>{value}</Text>
      <Text style={tw`text-[#8892b0] text-xs font-bold uppercase tracking-widest`}>{title}</Text>
    </View>
  );
}
