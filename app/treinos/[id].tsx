import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ExerciseItem from '../../components/ExerciseItem';
import { Colors } from '../../constants/Colors';
import { useWorkoutContext } from '../../contexts/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Link, Stack } from 'expo-router';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts, loading, deleteWorkout, finishWorkout, updateWorkout } = useWorkoutContext();
  const router = useRouter();

  const WorkoutId = parseInt(id as string);
  const workout = workouts.find(w => w.id === WorkoutId);

  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());

  const saveExerciseWeight = (exerciseId: number, weight: string) => {
    if (!workout) return;
    const updatedExercises = workout.exercises.map(ex =>
      ex.id === exerciseId ? { ...ex, weight } : ex
    );
    updateWorkout({ ...workout, exercises: updatedExercises });
  };

  const toggleExerciseDone = (exerciseId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Apagar Treino",
      "Tem a certeza que quer apagar este treino? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar", style: "destructive", onPress: () => {
            if (WorkoutId) {
              deleteWorkout(WorkoutId);
              router.back();
            }
          }
        }
      ]
    );
  };

  const handleFinishWorkout = () => {
    if (workout) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      finishWorkout(workout);
      Alert.alert(
        "Parabéns!",
        "Treino finalizado com sucesso e salvo no histórico.",
        [{ text: "OK", onPress: () => router.push('/(tabs)/treinos') }]
      );
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.centered} size="large" color={Colors.primary} />;
  }

  if (!workout) {
    return (
      <View style={styles.centered}>
        <Text>Treino não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        title: workout.name,
        headerRight: () => (
          <Link href={`/treinos/edit/${id}`} asChild>
            <TouchableOpacity>
              <Text style={{ color: Colors.primary, fontSize: 16 }}>Editar</Text>
            </TouchableOpacity>
          </Link>
        )
      }} />

      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ExerciseItem
            exercise={item}
            isDone={completedExercises.has(item.id)}
            onToggleDone={() => toggleExerciseDone(item.id)}
            weight={item.weight || ''}
            onWeightChange={(text) => saveExerciseWeight(item.id, text)}
          />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: 160 }]}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.fabDelete} onPress={handleDelete} activeOpacity={0.8}>
          <Ionicons name="trash-outline" size={24} color={Colors.danger} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.finishButton} onPress={handleFinishWorkout} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.finishButtonText}>Finalizar Treino</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: Colors.primary,
    height: 50,
    paddingHorizontal: 32,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginLeft: 16,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fabDelete: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
