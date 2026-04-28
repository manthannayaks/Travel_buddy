import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Animated } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

const ACTION_ICONS = {
  LOGIN: '🔑',
  SIGNUP: '📝',
  GOOGLE_AUTH: '🔵',
  TRIP_CREATED: '✈️',
  SKILL_POSTED: '💡',
  GUIDE_REGISTERED: '🤝',
  PROFILE_UPDATED: '👤',
};

const ACTION_COLORS = {
  LOGIN: '#6c5ce7',
  SIGNUP: '#00cec9',
  GOOGLE_AUTH: '#a78bfa',
  TRIP_CREATED: '#6c5ce7',
  SKILL_POSTED: '#fdcb6e',
  GUIDE_REGISTERED: '#00cec9',
  PROFILE_UPDATED: '#8892b0',
};

export default function AdminScreen({ navigation }) {
  const [stats, setStats] = useState({ users: 0, trips: 0, sponsorships: 0, skills: 0, guides: 0 });
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, activityRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/activity?limit=100')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setActivities(activityRes.data);
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

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
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
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center border border-[#2d3555]`}>
              <Text style={tw`font-bold text-white text-lg`}>←</Text>
            </TouchableOpacity>
            <Text style={tw`text-2xl font-black text-white`}>👑 Admin Panel</Text>
            <TouchableOpacity onPress={fetchAdminData} style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center border border-[#2d3555]`}>
              <Text style={tw`text-white text-lg`}>🔄</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Grid */}
          <View style={tw`flex-row flex-wrap justify-between mb-6`}>
            <StatBox title="Users" value={stats.users} color="#6c5ce7" />
            <StatBox title="Trips" value={stats.trips} color="#00cec9" />
            <StatBox title="Skills" value={stats.skills} color="#fdcb6e" />
            <StatBox title="Guides" value={stats.guides} color="#e17055" />
          </View>

          {/* Tab Switcher */}
          <View style={tw`flex-row bg-[#1a1f35] rounded-2xl p-1 mb-6 border border-[#2d3555]`}>
            <TouchableOpacity
              style={tw`flex-1 py-3 rounded-xl items-center ${activeTab === 'overview' ? 'bg-[#6c5ce7]' : ''}`}
              onPress={() => setActiveTab('overview')}
            >
              <Text style={tw`font-bold ${activeTab === 'overview' ? 'text-white' : 'text-[#8892b0]'}`}>Activity Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 py-3 rounded-xl items-center ${activeTab === 'users' ? 'bg-[#6c5ce7]' : ''}`}
              onPress={() => setActiveTab('users')}
            >
              <Text style={tw`font-bold ${activeTab === 'users' ? 'text-white' : 'text-[#8892b0]'}`}>All Users</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'overview' ? (
            <>
              <Text style={tw`text-xs font-bold text-[#6c5ce7] tracking-widest uppercase mb-3 ml-1`}>RECENT ACTIVITY</Text>
              {activities.length === 0 ? (
                <View style={tw`bg-[#1a1f35] rounded-2xl p-6 border border-[#2d3555] items-center`}>
                  <Text style={tw`text-[#8892b0] font-medium`}>No activity recorded yet</Text>
                </View>
              ) : activities.map((activity, idx) => (
                <View key={activity._id || idx} style={tw`bg-[#1a1f35] p-4 rounded-2xl mb-3 border border-[#2d3555] flex-row items-center`}>
                  <View style={[tw`w-10 h-10 rounded-xl items-center justify-center mr-3`, { backgroundColor: (ACTION_COLORS[activity.action] || '#6c5ce7') + '20' }]}>
                    <Text style={tw`text-lg`}>{ACTION_ICONS[activity.action] || '📋'}</Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row items-center mb-0.5`}>
                      <Text style={tw`text-white font-bold text-sm mr-2`}>{activity.user?.name || 'Unknown'}</Text>
                      <View style={[tw`px-2 py-0.5 rounded-full`, { backgroundColor: (ACTION_COLORS[activity.action] || '#6c5ce7') + '20' }]}>
                        <Text style={[tw`text-xs font-bold`, { color: ACTION_COLORS[activity.action] || '#6c5ce7' }]}>{activity.action}</Text>
                      </View>
                    </View>
                    <Text style={tw`text-[#8892b0] text-xs`}>{activity.details}</Text>
                  </View>
                  <Text style={tw`text-[#4a5568] text-xs font-medium`}>{timeAgo(activity.createdAt)}</Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text style={tw`text-xs font-bold text-[#6c5ce7] tracking-widest uppercase mb-3 ml-1`}>USER MANAGEMENT ({users.length})</Text>
              {users.map(user => (
                <View key={user._id} style={tw`bg-[#1a1f35] p-4 rounded-2xl mb-3 border border-[#2d3555]`}>
                  <View style={tw`flex-row justify-between items-center mb-3`}>
                    <View style={tw`flex-row items-center flex-1`}>
                      <View style={tw`bg-[#6c5ce7] w-10 h-10 rounded-full items-center justify-center mr-3`}>
                        <Text style={tw`font-bold text-white`}>{user.name?.charAt(0) || 'U'}</Text>
                      </View>
                      <View style={tw`flex-1`}>
                        <View style={tw`flex-row items-center`}>
                          <Text style={tw`font-bold text-white mr-2`}>{user.name}</Text>
                          {user.isAdmin && (
                            <View style={tw`bg-[#6c5ce720] px-2 py-0.5 rounded-full border border-[#6c5ce7]`}>
                              <Text style={tw`text-[#a78bfa] text-xs font-bold`}>Admin</Text>
                            </View>
                          )}
                        </View>
                        <Text style={tw`text-[#8892b0] text-xs`}>{user.email}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={tw`bg-[#ff6b6b20] px-3 py-2 rounded-xl border border-[#ff6b6b40] ${user.isAdmin ? 'opacity-30' : ''}`}
                      onPress={() => handleDeleteUser(user._id, user.isAdmin)}
                      disabled={user.isAdmin}
                    >
                      <Text style={tw`text-[#ff6b6b] font-bold text-xs`}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                  {/* User Meta */}
                  <View style={tw`flex-row justify-between bg-[#0a0e1a] p-3 rounded-xl`}>
                    <View style={tw`items-center`}>
                      <Text style={tw`text-[#6c5ce7] font-bold text-sm`}>{user.totalActivities || 0}</Text>
                      <Text style={tw`text-[#4a5568] text-xs font-medium`}>Activities</Text>
                    </View>
                    <View style={tw`items-center`}>
                      <Text style={tw`text-[#00cec9] font-bold text-sm`}>{user.verificationStatus || 'Pending'}</Text>
                      <Text style={tw`text-[#4a5568] text-xs font-medium`}>Status</Text>
                    </View>
                    <View style={tw`items-center`}>
                      <Text style={tw`text-[#8892b0] font-bold text-sm`}>{user.lastActivity ? timeAgo(user.lastActivity.date) : 'Never'}</Text>
                      <Text style={tw`text-[#4a5568] text-xs font-medium`}>Last Active</Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}

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
