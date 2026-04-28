import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Animated, TextInput, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'twrnc';
import api from '../services/api';

export default function SkillExchangeScreen({ navigation }) {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Form fields
  const [skillName, setSkillName] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [description, setDescription] = useState('');

  const fetchSkills = () => {
    setLoading(true);
    api.get('/api/skills')
      .then(res => setSkills(res.data))
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      });
  };

  useEffect(() => { fetchSkills(); }, []);

  const handlePostSkill = async () => {
    if (!skillName || !lookingFor) {
      return Alert.alert('Error', 'Please fill skill name and what you are looking for');
    }
    setPosting(true);
    try {
      await api.post('/api/skills', {
        skills: skillName.split(',').map(s => s.trim()),
        lookingFor,
        description
      });
      Alert.alert('💡 Skill Posted!', 'Your skill listing is now live.');
      setShowForm(false);
      setSkillName(''); setLookingFor(''); setDescription('');
      fetchSkills();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to post skill');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between p-6 border-b border-[#2d3555]`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`bg-[#1a1f35] w-11 h-11 rounded-full items-center justify-center mr-4 border border-[#2d3555]`}>
            <Text style={tw`font-bold text-white text-lg`}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={tw`text-2xl font-black text-white`}>Skill Exchange</Text>
            <Text style={tw`text-[#8892b0] text-xs font-medium`}>{skills.length} skills listed</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowForm(true)} style={tw`bg-[#fdcb6e] px-4 py-2.5 rounded-xl`}>
          <Text style={tw`text-[#0a0e1a] font-bold`}>+ Post</Text>
        </TouchableOpacity>
      </View>

      {/* Post Skill Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <KeyboardAvoidingView style={tw`flex-1`} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={tw`flex-1 bg-[#0a0e1a] bg-opacity-95 justify-end`}>
            <View style={tw`bg-[#1a1f35] rounded-t-3xl p-6 border-t border-[#2d3555]`}>
              <View style={tw`flex-row justify-between items-center mb-6`}>
                <Text style={tw`text-2xl font-black text-white`}>Post a Skill 💡</Text>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Text style={tw`text-[#8892b0] font-bold text-lg`}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Your Skills (comma separated)</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="e.g. Photography, Translation" placeholderTextColor="#4a5568" value={skillName} onChangeText={setSkillName} />
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Looking For</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="e.g. Free Accommodation, Local Tours" placeholderTextColor="#4a5568" value={lookingFor} onChangeText={setLookingFor} />
              </View>

              <View style={tw`mb-6`}>
                <Text style={tw`text-xs font-bold text-[#8892b0] mb-2 uppercase tracking-wider`}>Description</Text>
                <TextInput style={tw`bg-[#0a0e1a] border border-[#2d3555] rounded-2xl px-4 py-3 text-white text-base`} placeholder="Tell people more about your skills..." placeholderTextColor="#4a5568" multiline numberOfLines={3} value={description} onChangeText={setDescription} />
              </View>

              <TouchableOpacity style={tw`bg-[#fdcb6e] rounded-2xl py-4.5 items-center ${posting ? 'opacity-70' : ''}`} onPress={handlePostSkill} disabled={posting}>
                <Text style={tw`text-[#0a0e1a] font-black text-lg`}>{posting ? 'Posting...' : 'Post Skill →'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#fdcb6e" />
          <Text style={tw`text-[#8892b0] mt-4 font-medium`}>Loading skills...</Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView contentContainerStyle={tw`p-6 pb-16`}>
            {skills.length === 0 ? (
              <View style={tw`items-center mt-16`}>
                <Text style={tw`text-6xl mb-4`}>💡</Text>
                <Text style={tw`text-white text-xl font-bold mb-2`}>No skills listed</Text>
                <Text style={tw`text-[#8892b0] text-center text-sm font-medium px-8 mb-6`}>Be the first to post a skill and start exchanging!</Text>
                <TouchableOpacity onPress={() => setShowForm(true)} style={tw`bg-[#fdcb6e] px-8 py-3 rounded-xl`}>
                  <Text style={tw`text-[#0a0e1a] font-bold`}>Post Your First Skill</Text>
                </TouchableOpacity>
              </View>
            ) : skills.map(skill => (
              <View key={skill._id} style={tw`bg-[#1a1f35] p-5 rounded-3xl mb-5 border border-[#2d3555]`}>
                <View style={tw`bg-[#fdcb6e15] rounded-2xl p-4 mb-4 flex-row items-center border border-[#fdcb6e30]`}>
                  <View style={tw`bg-[#fdcb6e] w-12 h-12 rounded-2xl items-center justify-center mr-3`}>
                    <Text style={tw`text-xl`}>💡</Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-white font-black text-lg`}>{skill.skills?.join(', ') || 'Skill'}</Text>
                    <Text style={tw`text-[#fdcb6e] font-bold uppercase text-xs tracking-wider`}>Trade for: {skill.lookingFor}</Text>
                  </View>
                </View>

                {skill.description && <Text style={tw`text-[#8892b0] mb-5 leading-relaxed text-sm`} numberOfLines={4}>{skill.description}</Text>}

                <View style={tw`flex-row justify-between items-center bg-[#0a0e1a] p-4 rounded-2xl`}>
                  <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-[#6c5ce7] w-10 h-10 rounded-full items-center justify-center mr-3`}>
                      <Text style={tw`font-bold text-white`}>{skill.user?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <Text style={tw`text-white font-bold text-sm`}>{skill.user?.name || 'Traveler'}</Text>
                  </View>
                  <TouchableOpacity style={tw`bg-[#fdcb6e] px-5 py-3 rounded-xl`}>
                    <Text style={tw`text-[#0a0e1a] font-black tracking-wide`}>Message</Text>
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
