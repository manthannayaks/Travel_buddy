import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getToken } from '../utils/auth';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AdminScreen from '../screens/AdminScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TravelMatchScreen from '../screens/TravelMatchScreen';
import LocalBuddyScreen from '../screens/LocalBuddyScreen';
import SkillExchangeScreen from '../screens/SkillExchangeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return null; // Can render a splash screen here

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setAuth={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Signup">
            {(props) => <SignupScreen {...props} setAuth={setIsAuthenticated} />}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="Dashboard">
             {(props) => <DashboardScreen {...props} setAuth={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="Profile">
             {(props) => <ProfileScreen {...props} setAuth={setIsAuthenticated} />}
          </Stack.Screen>
          <Stack.Screen name="TravelMatch" component={TravelMatchScreen} />
          <Stack.Screen name="LocalBuddy" component={LocalBuddyScreen} />
          <Stack.Screen name="SkillExchange" component={SkillExchangeScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
