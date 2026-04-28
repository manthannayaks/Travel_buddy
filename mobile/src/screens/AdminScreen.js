import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function AdminScreen({ navigation }) {
  const [stats, setStats] = useState({ users: 0, trips: 0, sponsorships: 0, skills: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <SafeAreaView style={tw`flex-1 bg-gray-50 items-center justify-center`}>
        <Text style={tw`text-lg font-bold text-gray-500`}>Loading Control Center...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-6 pb-12`}>
        
        <View style={tw`flex-row justify-between items-center mb-8`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-gray-200 w-10 h-10 rounded-full items-center justify-center`}>
            <Text style={tw`font-bold text-gray-700`}>←</Text>
          </TouchableOpacity>
          <Text style={tw`text-2xl font-black text-indigo-900`}>👑 Admin Panel</Text>
          <View style={tw`w-10`} />
        </View>

        {/* Stats Grid */}
        <View style={tw`flex-row flex-wrap justify-between mb-8`}>
          <StatBox title="Users" value={stats.users} bg="bg-blue-100" color="text-blue-800" />
          <StatBox title="Trips" value={stats.trips} bg="bg-indigo-100" color="text-indigo-800" />
          <StatBox title="Sponsors" value={stats.sponsorships} bg="bg-emerald-100" color="text-emerald-800" />
          <StatBox title="Skills" value={stats.skills} bg="bg-yellow-100" color="text-yellow-800" />
        </View>

        {/* User Management */}
        <Text style={tw`text-xl font-extrabold text-gray-900 mb-4`}>User Management</Text>
        
        {users.map(user => (
          <View key={user._id} style={tw`bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100 flex-row justify-between items-center`}>
            <View style={tw`flex-1`}>
              <View style={tw`flex-row items-center mb-1`}>
                <Text style={tw`font-bold text-lg text-gray-800 mr-2`}>{user.name}</Text>
                {user.isAdmin && <Text style={tw`bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-bold`}>Admin</Text>}
              </View>
              <Text style={tw`text-gray-500 text-sm`}>{user.email}</Text>
            </View>
            <TouchableOpacity 
              style={tw`bg-red-50 px-4 py-2 rounded-xl border border-red-100 ${user.isAdmin ? 'opacity-50' : ''}`}
              onPress={() => handleDeleteUser(user._id, user.isAdmin)}
              disabled={user.isAdmin}
            >
              <Text style={tw`text-red-700 font-bold`}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ title, value, bg, color }) {
  return (
    <View style={tw`${bg} w-[48%] p-5 rounded-3xl mb-4 items-center shadow-sm`}>
      <Text style={tw`${color} text-3xl font-black mb-1`}>{value}</Text>
      <Text style={tw`${color} text-sm font-bold uppercase tracking-widest`}>{title}</Text>
    </View>
  );
}
