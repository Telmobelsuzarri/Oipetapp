import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedToken = await AsyncStorage.getItem('@PetNutrition:token');
      const storedUser = await AsyncStorage.getItem('@PetNutrition:user');

      if (storedToken && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('@PetNutrition:token', token);
      await AsyncStorage.setItem('@PetNutrition:user', JSON.stringify(user));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao fazer login' 
      };
    }
  }

  async function signUp(name, email, password) {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('@PetNutrition:token', token);
      await AsyncStorage.setItem('@PetNutrition:user', JSON.stringify(user));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(user);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Erro ao criar conta' 
      };
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@PetNutrition:token');
    await AsyncStorage.removeItem('@PetNutrition:user');
    delete api.defaults.headers.Authorization;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      signed: !!user,
      user,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}