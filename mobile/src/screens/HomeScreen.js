import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import tw from 'twrnc';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <ScrollView contentContainerStyle={tw`p-6 pb-12`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-10 mt-4`}>
          <Text style={tw`text-2xl font-black text-blue-600`}>🌍 TravelBuddy</Text>
          <TouchableOpacity 
            style={tw`bg-blue-100 px-4 py-2 rounded-full`}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={tw`font-bold text-blue-700`}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={tw`items-center mt-6 mb-12`}>
          <View style={tw`bg-blue-50 px-4 py-2 rounded-full mb-6 border border-blue-200`}>
            <Text style={tw`text-blue-600 font-bold text-xs`}>✨ The ultimate ecosystem for travelers</Text>
          </View>
          
          <Text style={tw`text-4xl text-center font-extrabold text-gray-900 leading-tight mb-4`}>
            Travel smarter, cheaper, and <Text style={tw`text-indigo-600`}>socially.</Text>
          </Text>
          
          <Text style={tw`text-base text-gray-500 text-center font-medium mb-8 px-4 leading-relaxed`}>
            Connect with travel companions, explore with verified local guides, and unlock sponsored travel worldwide.
          </Text>

          <TouchableOpacity 
            style={tw`bg-blue-600 w-full py-4 rounded-2xl shadow-lg items-center mb-4`}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={tw`text-white font-bold text-lg`}>Start Your Journey</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={tw`bg-white border flex-row border-gray-200 w-full py-4 rounded-2xl shadow-sm items-center justify-center`}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={tw`text-gray-800 font-bold text-lg`}>Find a Travel Buddy</Text>
          </TouchableOpacity>
        </View>

        {/* Features List */}
        <Text style={tw`text-2xl font-extrabold text-gray-900 mb-6 px-2`}>Core Features</Text>

        <View style={tw`flex-col gap-4`}>
          <FeatureCard 
            icon="✈️" 
            title="Travel Matching" 
            desc="Connect with people traveling to the same destination. Stop traveling solo." 
          />
          <FeatureCard 
            icon="🤝" 
            title="Local Buddy System" 
            desc="Hire or connect with locals for authentic guidance and hidden gems." 
          />
          <FeatureCard 
            icon="🏥" 
            title="Medical Safety" 
            desc="Access emergency info, first aid, and nearby hospitals instantly." 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <View style={tw`bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex-row items-center mb-4`}>
      <View style={tw`w-14 h-14 bg-indigo-50 rounded-2xl items-center justify-center mr-4`}>
        <Text style={tw`text-2xl`}>{icon}</Text>
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-lg font-bold text-gray-800 mb-1`}>{title}</Text>
        <Text style={tw`text-gray-500 text-xs font-medium`}>{desc}</Text>
      </View>
    </View>
  );
}
