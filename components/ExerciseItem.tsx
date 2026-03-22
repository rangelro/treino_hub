import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { WorkoutExercise } from '../types/types';
import { Colors } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseItemProps {
  exercise: WorkoutExercise;
  isDone?: boolean;
  onToggleDone?: () => void;
  weight?: string;
  onWeightChange?: (text: string) => void;
  interactive?: boolean;
}

export default function ExerciseItem({ 
  exercise, 
  isDone = false, 
  onToggleDone, 
  weight = '', 
  onWeightChange,
  interactive = true 
}: ExerciseItemProps) {
  const [localWeight, setLocalWeight] = useState(weight);

  useEffect(() => {
    setLocalWeight(weight);
  }, [weight]);

  return (
    <View style={[styles.container, isDone && styles.containerDone]}>
      {interactive && (
        <TouchableOpacity style={styles.doneButton} onPress={onToggleDone} activeOpacity={0.7}>
          <Ionicons 
            name={isDone ? "checkmark-circle" : "ellipse-outline"} 
            size={32} 
            color={isDone ? Colors.primary : Colors.lightGray} 
          />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={[styles.name, isDone && styles.textDone]}>{exercise.name}</Text>
        <View style={styles.setsRepsContainer}>
          <Text style={[styles.setsRepsText, isDone && styles.textDone]}>{exercise.sets}</Text>
          <Text style={styles.setsRepsLabel}> Séries x </Text>
          <Text style={[styles.setsRepsText, isDone && styles.textDone]}>{exercise.reps}</Text>
          <Text style={styles.setsRepsLabel}> Reps</Text>
        </View>
      </View>

      {interactive && (
        <View style={styles.weightContainer}>
          <TextInput
            style={[styles.weightInput, isDone && styles.weightInputDone]}
            placeholder="0"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={localWeight}
            onChangeText={setLocalWeight}
            onEndEditing={() => onWeightChange && onWeightChange(localWeight)}
            maxLength={5}
          />
          <Text style={styles.weightLabel}>kg</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  containerDone: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 0,
    shadowOpacity: 0,
  },
  doneButton: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  setsRepsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 6,
  },
  setsRepsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  setsRepsLabel: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '500',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  weightInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.secondary,
    textAlign: 'center',
    minWidth: 40,
    paddingVertical: 4,
  },
  weightInputDone: {
    color: '#999',
  },
  weightLabel: {
    fontSize: 14,
    color: Colors.secondary,
    marginLeft: 4,
  },
});