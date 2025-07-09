import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// App Screens
import HomeScreen from '../screens/app/HomeScreen';
import PetsScreen from '../screens/app/PetsScreen';
import AddPetScreen from '../screens/app/AddPetScreen';
import PetDetailScreen from '../screens/app/PetDetailScreen';
import FeedingScreen from '../screens/app/FeedingScreen';
import NewsScreen from '../screens/app/NewsScreen';
import ProfileScreen from '../screens/app/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Entrar' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ title: 'Criar Conta' }}
      />
    </Stack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Pets':
              iconName = 'paw';
              break;
            case 'Feeding':
              iconName = 'food';
              break;
            case 'News':
              iconName = 'newspaper';
              break;
            case 'Profile':
              iconName = 'account';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.surface,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Início' }}
      />
      <Tab.Screen 
        name="Pets" 
        component={PetsScreen} 
        options={{ title: 'Meus Pets' }}
      />
      <Tab.Screen 
        name="Feeding" 
        component={FeedingScreen} 
        options={{ title: 'Alimentação' }}
      />
      <Tab.Screen 
        name="News" 
        component={NewsScreen} 
        options={{ title: 'Notícias' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddPet" 
        component={AddPetScreen} 
        options={{ title: 'Adicionar Pet' }}
      />
      <Stack.Screen 
        name="PetDetail" 
        component={PetDetailScreen} 
        options={{ title: 'Detalhes do Pet' }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { signed, loading } = useAuth();

  if (loading) {
    return null; // Adicionar splash screen aqui
  }

  return signed ? <AppStack /> : <AuthNavigator />;
}