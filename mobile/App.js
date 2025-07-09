import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { setupNotifications } from './src/services/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}