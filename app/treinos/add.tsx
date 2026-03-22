import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutContext } from '../../contexts/WorkoutContext';
import * as Haptics from 'expo-haptics';

import { searchExercises, getMuscleGroups } from '../../services/api';
import { Exercise, WorkoutExercise } from '../../types/types';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function AddWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [addedExercises, setAddedExercises] = useState<WorkoutExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('Todos');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [isSearching] = useState(false);

  // Modal
  const [isModalVisibe, setIsModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentSets, setCurrentSets] = useState(3);
  const [currentReps, setCurrentReps] = useState(12);

  const { addWorkout } = useWorkoutContext();
  const router = useRouter();
  const muscleGroups = getMuscleGroups();

  useEffect(() => {
    const results = searchExercises(searchQuery, selectedMuscleGroup);
    setSearchResults(results);
  }, [searchQuery, selectedMuscleGroup]);

  const handleSelectedExercise = (exercise: Exercise) => {
    if (addedExercises.some(ex => ex.id === exercise.id)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Este exercício já está na lista.');
      return;
    }
    Haptics.selectionAsync();
    setSelectedExercise(exercise);
    setCurrentSets(3);
    setCurrentReps(12);
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
      setAddedExercises([...addedExercises, newExercise]);

      setIsModalVisible(false);
      setSelectedExercise(null);
      setSearchQuery('');
      setSearchResults([]);
    }
  }

  const handleRemoveExercise = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAddedExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleSaveWorkout = () => {
    let hasError = false;

    if (workoutName.trim() === '') {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (addedExercises.length === 0) {
      hasError = true;
    }

    if (hasError) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Atenção', 'Por favor, preencha o nome do treino e adicione ao menos um exercício.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newWorkout = {
      id: Date.now(),
      name: workoutName,
      exercises: addedExercises,
    };
    addWorkout(newWorkout);
    router.back();
  };

  const handleSelectGroup = (group: string) => {
    Haptics.selectionAsync();
    setSelectedMuscleGroup(group);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isModalVisibe}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedExercise?.name}</Text>

            <Text style={styles.modalLabel}>Séries</Text>
            <View style={styles.modalControl}>
              <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentSets(s => Math.max(1, s - 1));
              }}>
                <Ionicons name="remove-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.modalValue}>{currentSets}</Text>
              <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentSets(s => s + 1);
              }}>
                <Ionicons name="add-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLabel}>Repetições</Text>
            <View style={styles.modalControl}>
              <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentReps(r => Math.max(1, r - 1));
              }}>
                <Ionicons name="remove-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.modalValue}>{currentReps}</Text>
              <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCurrentReps(r => r + 1);
              }}>
                <Ionicons name="add-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={{ width: '100%', marginTop: 10 }}>
              <Button title="Confirmar" onPress={handleConfirmAddExercise} color={Colors.primary} />
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
              <Button title="Cancelar" onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsModalVisible(false);
              }} color="gray" />
            </View>
          </View>
        </View>
      </Modal>

      <TextInput
        style={[styles.input, nameError && styles.inputError]}
        placeholder="Nome do Treino (Ex: Treino A - Peito)"
        placeholderTextColor="#666"
        value={workoutName}
        onChangeText={(text) => {
          setWorkoutName(text);
          if (text.trim() !== '') setNameError(false);
        }}
      />
      {nameError && <Text style={styles.errorText}>O nome do treino é obrigatório.</Text>}

      <Text style={styles.label}>Adicionar Exercício</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {muscleGroups.map((group) => (
          <TouchableOpacity
            key={group}
            style={[
              styles.filterChip,
              selectedMuscleGroup === group && styles.filterChipSelected
            ]}
            onPress={() => handleSelectGroup(group)}
          >
            <Text style={[
              styles.filterText,
              selectedMuscleGroup === group && styles.filterTextSelected
            ]}>
              {group}
            </Text>
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

      {isSearching && <ActivityIndicator color={Colors.primary} style={{ marginVertical: 10 }} />}

      {searchResults.length > 0 && (
        <FlatList
          style={styles.resultsList}
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectedExercise(item)}>
              <Text style={styles.resultText}>{item.name}</Text>
              <Text style={styles.resultSubtext}>{item.muscleGroup}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text style={styles.label}>Exercícios Adicionados</Text>
      <FlatList
        data={addedExercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.addedItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.addedItemText}>{item.name}</Text>
              <Text style={styles.addedItemSubtext}>{item.sets} séries x {item.reps} reps</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveExercise(item.id)}>
              <Ionicons name="trash-outline" size={24} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum exercício adicionado.</Text>}
      />

      <View style={styles.saveButtonContainer}>
        <Button title="Salvar Treino" onPress={handleSaveWorkout} color={Colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.background
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginTop: 20,
    marginBottom: 8
  },
  input: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: '#FFEBEE'
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    maxHeight: 50,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    justifyContent: 'center'
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    color: Colors.secondary,
    fontSize: 14,
  },
  filterTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultsList: {
    maxHeight: 200,
    backgroundColor: Colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 10,
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 16,
    color: Colors.secondary,
  },
  resultSubtext: {
    fontSize: 12,
    color: '#999',
  },
  addedItem: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center'
  },
  addedItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addedItemSubtext: {
    fontSize: 14,
    color: '#555',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 10
  },
  saveButtonContainer: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.primary,
  },
  modalLabel: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 10,
  },
  modalControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    minWidth: 50,
    textAlign: 'center',
  },
});
