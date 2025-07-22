import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkoutExercise } from '../types/types';
import { Colors } from '../constants/Colors';

interface ExerciseItemProps {
  exercise: WorkoutExercise;
}

export default function ExerciseItem({ exercise }: ExerciseItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.setsRepsContainer}>
        <Text style={styles.setsRepsText}>{exercise.sets}</Text>
        <Text style={styles.setsRepsLabel}>x</Text>
        <Text style={styles.setsRepsText}>{exercise.reps}</Text>
      </View>
      <Text style={styles.name}>{exercise.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  setsRepsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: 16,
    minWidth: 70, 
  },
  setsRepsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  setsRepsLabel: {
    fontSize: 14,
    color: Colors.secondary,
    marginHorizontal: 4,
  },
  name: {
    fontSize: 16,
    color: Colors.secondary,
    flex: 1,
  },
});