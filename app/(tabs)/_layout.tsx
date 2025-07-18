import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        // Adicionei esta linha para garantir que o cabeçalho de cada aba
        // seja renderizado pelo Stack pai, o que dá o título correto a cada tela.
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="treinos"
        options={{
          title: 'Treinos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" color={color} size={size} />
          ),
        }}
      />
       <Tabs.Screen
        name="configuracoes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
