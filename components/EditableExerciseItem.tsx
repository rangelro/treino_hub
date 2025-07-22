import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutExercise } from '../types/types';
import { Colors } from '../constants/Colors';

interface EditableExerciseItemProps {
  exercise: WorkoutExercise;
  onSetChange: (change: number) => void;
  onRepChange: (change: number) => void;
  onRemove: () => void;
}

export default function EditableExerciseItem({ exercise, onSetChange, onRepChange, onRemove }: EditableExerciseItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.controlsContainer}>
          {/* Controlando as Séries */}
          <View style={styles.control}>
            <TouchableOpacity onPress={() => onSetChange(-1)} style={styles.button}>
              <Ionicons name="remove-circle-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.valueText}>{exercise.sets} séries</Text>
            <TouchableOpacity onPress={() => onSetChange(1)} style={styles.button}>
              <Ionicons name="add-circle-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          {/* Controlando as Repetições */}
          <View style={styles.control}>
            <TouchableOpacity onPress={() => onRepChange(-1)} style={styles.button}>
              <Ionicons name="remove-circle-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.valueText}>{exercise.reps} reps</Text>
            <TouchableOpacity onPress={() => onRepChange(1)} style={styles.button}>
              <Ionicons name="add-circle-outline" size={28} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={24} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 12,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 8,
  },
  valueText: {
    fontSize: 16,
    color: Colors.secondary,
    minWidth: 70,
    textAlign: 'center',
  },
  removeButton: {
    marginLeft: 12,
    padding: 4,
  },
});
