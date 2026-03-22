import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, Alert, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutContext } from '../../../contexts/WorkoutContext';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { searchExercises, getMuscleGroups } from '../../../services/api';
import { Exercise, WorkoutExercise, Workout } from '../../../types/types';
import { Colors } from '../../../constants/Colors';
import EditableExerciseItem from '../../../components/EditableExerciseItem';

export default function EditWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts, updateWorkout } = useWorkoutContext();
  const router = useRouter();

  const [workoutName, setWorkoutName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const WorkoutId = parseInt(id as string);

  // Estados para busca de novos exercícios
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Todos');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const muscleGroups = getMuscleGroups();

  // Modal para configurar novo exercício
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentSets, setCurrentSets] = useState(4);
  const [currentReps, setCurrentReps] = useState(10);

  useEffect(() => {
    const workoutToEdit = workouts.find(w => w.id === WorkoutId);
    if (workoutToEdit) {
      setWorkoutName(workoutToEdit.name);
      setExercises(workoutToEdit.exercises);
    }
  }, [id, workouts]);

  useEffect(() => {
    if (searchQuery.length > 0 || selectedMuscleGroup !== 'Todos') {
      const results = searchExercises(searchQuery, selectedMuscleGroup);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedMuscleGroup]);

  const handleExerciseChange = (exerciseId: number, type: 'sets' | 'reps', change: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          const newValue = ex[type] + change;
          return { ...ex, [type]: newValue > 0 ? newValue : 1 };
        }
        return ex;
      })
    );
  };

  const handleRemoveExercise = (exerciseId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExercises(currentExercises => currentExercises.filter(ex => ex.id !== exerciseId));
  };

  const handleAddExerciseClick = (exercise: Exercise) => {
    if (exercises.some(ex => ex.id === exercise.id)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Este exercício já está no treino.');
      return;
    }
    Haptics.selectionAsync();
    setSelectedExercise(exercise);
    setCurrentSets(4);
    setCurrentReps(10);
    setIsModalVisible(true);
  };

  const handleConfirmAddExercise = () => {
    if (selectedExercise) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newExercise: WorkoutExercise = {
        ...selectedExercise,
        sets: currentSets,
        reps: currentReps,
      };
      setExercises([...exercises, newExercise]);
      setIsModalVisible(false);
      setSelectedExercise(null);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleUpdateWorkout = () => {
    if (workoutName.trim() === '') {
      setNameError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (exercises.length === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Atenção', 'O treino precisa de pelo menos um exercício.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updatedWorkout: Workout = { id: WorkoutId, name: workoutName, exercises };
    updateWorkout(updatedWorkout);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Modal animationType='slide' transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>
            <Text style={styles.modalLabel}>Séries</Text>
            <View style={styles.modalControl}>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrentSets(s => Math.max(1, s - 1)); }}>
                <Ionicons name="remove-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.modalValue}>{currentSets}</Text>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrentSets(s => s + 1); }}>
                <Ionicons name="add-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLabel}>Repetições</Text>
            <View style={styles.modalControl}>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrentReps(r => Math.max(1, r - 1)); }}>
                <Ionicons name="remove-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.modalValue}>{currentReps}</Text>
              <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCurrentReps(r => r + 1); }}>
                <Ionicons name="add-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
              <Button title="Adicionar" onPress={handleConfirmAddExercise} color={Colors.primary} />
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
              <Button title="Cancelar" onPress={() => setIsModalVisible(false)} color="gray" />
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            <TextInput
              style={[styles.input, nameError && styles.inputError]}
              placeholder="Nome do Treino"
              placeholderTextColor="#666"
              value={workoutName}
              onChangeText={(text) => {
                setWorkoutName(text);
                if (text.trim() !== '') setNameError(false);
              }}
            />
            {nameError && <Text style={styles.errorText}>O nome é obrigatório.</Text>}

            <Text style={styles.label}>Adicionar Novo Exercício</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
              {muscleGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[styles.filterChip, selectedMuscleGroup === group && styles.filterChipSelected]}
                  onPress={() => { Haptics.selectionAsync(); setSelectedMuscleGroup(group); }}
                >
                  <Text style={[styles.filterText, selectedMuscleGroup === group && styles.filterTextSelected]}>{group}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Procurar por nome..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchResults.length > 0 && (
              <ScrollView nestedScrollEnabled style={[styles.resultsWrapper, { maxHeight: 250 }]}>
                {searchResults.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.resultItem} onPress={() => handleAddExerciseClick(item)}>
                    <Text style={{ fontSize: 16, color: Colors.secondary }}>{item.name}</Text>
                    <Ionicons name="add" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <Text style={styles.label}>Exercícios Atuais</Text>
          </>
        }
        renderItem={({ item }) => (
          <EditableExerciseItem
            exercise={item}
            onSetChange={(change) => handleExerciseChange(item.id, 'sets', change)}
            onRepChange={(change) => handleExerciseChange(item.id, 'reps', change)}
            onRemove={() => handleRemoveExercise(item.id)}
          />
        )}
        ListFooterComponent={
          <View style={{ marginTop: 20, marginBottom: 40 }}>
            <Button title="Salvar Alterações" onPress={handleUpdateWorkout} color={Colors.primary} />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  label: { fontSize: 16, fontWeight: 'bold', color: Colors.secondary, marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: Colors.card, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8, fontSize: 16, marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
  inputError: { borderColor: Colors.danger, backgroundColor: '#FFEBEE' },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: -8, marginBottom: 12 },
  filterContainer: { flexDirection: 'row', marginBottom: 12 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.card, marginRight: 8, borderWidth: 1, borderColor: Colors.lightGray, height: 40, justifyContent: 'center' },
  filterChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { color: Colors.secondary, fontSize: 14 },
  filterTextSelected: { color: 'white', fontWeight: 'bold' },
  resultsWrapper: { backgroundColor: Colors.card, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: Colors.lightGray, overflow: 'hidden' },
  resultItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.lightGray, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: '85%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: Colors.primary },
  modalLabel: { fontSize: 16, color: Colors.secondary, marginBottom: 10 },
  modalControl: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  modalValue: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 20, minWidth: 50, textAlign: 'center' },
});
