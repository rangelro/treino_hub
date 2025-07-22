import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutContext } from '../../../contexts/WorkoutContext';
import { searchExerciseByName } from '../../../services/api';
import { Exercise, WorkoutExercise, Workout } from '../../../types/types';
import { Colors } from '../../../constants/Colors';

import EditableExerciseItem from '../../../components/EditableExerciseItem';

export default function EditWorkoutScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts, updateWorkout } = useWorkoutContext();
  const router = useRouter();

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const WorkoutId = parseInt(id as string);


  useEffect(() => {
    const workoutToEdit = workouts.find(w => w.id === WorkoutId);
    if (workoutToEdit) {
      setWorkoutName(workoutToEdit.name);
      setExercises(workoutToEdit.exercises);
    }
  }, [id, workouts]);

  const handleExerciseChange = (exerciseId: number, type: 'sets' | 'reps', change: number) => {
    setExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          const newValue = ex[type] + change;
          return { ...ex, [type]: newValue > 0 ? newValue : 1 }; // Garante que o valor não seja menor que 1
        }
        return ex;
      })
    );
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setExercises(currentExercises => currentExercises.filter(ex => ex.id !== exerciseId));
  };

  const handleUpdateWorkout = () => {
    if (!id || workoutName.trim() === '' || exercises.length === 0) {
      Alert.alert('Atenção', 'O treino precisa de um nome e pelo menos um exercício.');
      return;
    }
    const updatedWorkout: Workout = { id:WorkoutId, name: workoutName, exercises };
    updateWorkout(updatedWorkout);
    router.back();
  };
  
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Treino"
        value={workoutName}
        onChangeText={setWorkoutName}
      />
      
      <Text style={styles.label}>Exercícios</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EditableExerciseItem
            exercise={item}
            onSetChange={(change) => handleExerciseChange(item.id, 'sets', change)}
            onRepChange={(change) => handleExerciseChange(item.id, 'reps', change)}
            onRemove={() => handleRemoveExercise(item.id)}
          />
        )}
      />
      
      <Button title="Guardar Alterações" onPress={handleUpdateWorkout} color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  label: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, fontSize: 16, marginBottom: 12 },
});