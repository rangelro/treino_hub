import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Workout } from '../types/types'; 
import { Colors } from '../constants/Colors';

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
 
  const exerciseSummary = workout.exercises.map(ex => ex.name).slice(0, 3).join(', ');

  return (
   
    <Link href={`/treinos/${workout.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{workout.name}</Text>
        <View style={styles.divider} />
        <Text style={styles.progress}>{workout.exercises.length} exercícios</Text>
        <Text style={styles.summary}>
          {exerciseSummary}{workout.exercises.length > 3 ? '...' : ''}
        </Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    // Sombra para dar um efeito de elevação
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginBottom: 8,
  },
  progress: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  summary: {
    fontSize: 14,
    color: '#666',
  },
});