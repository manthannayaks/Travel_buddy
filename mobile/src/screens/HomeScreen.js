import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Animated, Dimensions } from 'react-native';
import tw from 'twrnc';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0a0e1a]`}>
      <ScrollView contentContainerStyle={tw`p-6 pb-16`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-10 mt-4`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-10 h-10 bg-[#6c5ce7] rounded-xl items-center justify-center mr-3`}>
              <Text style={tw`text-white text-lg font-bold`}>✈</Text>
            </View>
            <Text style={tw`text-xl font-black text-white`}>TravelBuddy</Text>
          </View>
          <TouchableOpacity
            style={tw`bg-[#1a1f35] border border-[#2d3555] px-5 py-2.5 rounded-full`}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={tw`font-bold text-[#a78bfa]`}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <Animated.View style={[tw`items-center mt-4 mb-12`, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={tw`bg-[#1a1f35] px-5 py-2.5 rounded-full mb-8 border border-[#2d3555]`}>
            <Text style={tw`text-[#a78bfa] font-bold text-xs tracking-wider`}>✨ THE ULTIMATE TRAVEL ECOSYSTEM</Text>
          </View>

          <Text style={tw`text-5xl text-center font-black text-white leading-tight mb-2`}>
            Travel{'\n'}
            <Text style={tw`text-[#6c5ce7]`}>Smarter.</Text>
          </Text>
          <Text style={tw`text-5xl text-center font-black text-white leading-tight mb-6`}>
            Travel{' '}
            <Text style={tw`text-[#00cec9]`}>Together.</Text>
          </Text>

          <Text style={tw`text-base text-[#8892b0] text-center font-medium mb-10 px-2 leading-relaxed`}>
            Find travel companions, connect with verified local guides, exchange skills, and unlock sponsored adventures worldwide.
          </Text>

          <Animated.View style={[tw`w-full`, { transform: [{ scale: pulseAnim }] }]}>
            <TouchableOpacity
              style={tw`w-full py-4.5 rounded-2xl items-center mb-4 bg-[#6c5ce7]`}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={tw`text-white font-black text-lg tracking-wide`}>Start Your Journey →</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={tw`bg-[#1a1f35] border border-[#2d3555] w-full py-4.5 rounded-2xl items-center`}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={tw`text-[#ccd6f6] font-bold text-lg`}>Find a Travel Buddy</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Features Section */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-xs font-bold text-[#6c5ce7] tracking-widest uppercase mb-2 ml-1`}>WHAT WE OFFER</Text>
          <Text style={tw`text-2xl font-black text-white mb-6`}>Core Features</Text>
        </View>

        <View style={tw`gap-4`}>
          <FeatureCard
            icon="✈️"
            title="Travel Matching"
            desc="Connect with travelers heading to your exact destination. Never travel alone again."
            gradient="#6c5ce7"
          />
          <FeatureCard
            icon="🤝"
            title="Local Buddy System"
            desc="Hire verified locals for authentic guidance, hidden gems, and cultural immersion."
            gradient="#00cec9"
          />
          <FeatureCard
            icon="💡"
            title="Skill Exchange"
            desc="Trade photography, coding, or translation skills for accommodation and local tours."
            gradient="#fdcb6e"
          />
          <FeatureCard
            icon="🏥"
            title="Medical Safety"
            desc="Instant access to emergency contacts, nearby hospitals, and first aid guides."
            gradient="#ff6b6b"
          />
        </View>

        {/* Stats */}
        <View style={tw`flex-row justify-between mt-10 bg-[#1a1f35] border border-[#2d3555] rounded-3xl p-6`}>
          <StatItem value="10K+" label="Travelers" />
          <View style={tw`w-px bg-[#2d3555]`} />
          <StatItem value="50+" label="Countries" />
          <View style={tw`w-px bg-[#2d3555]`} />
          <StatItem value="4.9★" label="Rating" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <View style={tw`bg-[#1a1f35] p-5 rounded-3xl border border-[#2d3555] flex-row items-center mb-1`}>
      <View style={[tw`w-14 h-14 rounded-2xl items-center justify-center mr-4`, { backgroundColor: gradient + '20' }]}>
        <Text style={tw`text-2xl`}>{icon}</Text>
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-lg font-bold text-white mb-1`}>{title}</Text>
        <Text style={tw`text-[#8892b0] text-xs font-medium leading-relaxed`}>{desc}</Text>
      </View>
    </View>
  );
}

function StatItem({ value, label }) {
  return (
    <View style={tw`items-center flex-1`}>
      <Text style={tw`text-2xl font-black text-white mb-1`}>{value}</Text>
      <Text style={tw`text-[#8892b0] text-xs font-bold uppercase tracking-wider`}>{label}</Text>
    </View>
  );
}
