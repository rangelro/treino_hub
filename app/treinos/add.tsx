import React, { use, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity, ActivityIndicator, Alert , Modal} from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutContext } from '../../contexts/WorkoutContext';

import { searchExerciseByName } from '../../services/api';
import { Exercise, WorkoutExercise } from '../../types/types';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';



export default function AddWorkoutScreen() {
  const [workoutName, setWorkoutName] = useState('');
  const [addedExercises, setAddedExercises] = useState<WorkoutExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [isSearching] = useState(false);

  //Modal
  const [isModalVisibe,setIsModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentSets,setCurrentSets] = useState(4);
  const [currentReps,setCurrentReps] = useState(10);




  const { addWorkout } = useWorkoutContext();  
  const router = useRouter();

  // Função chamada sempre que o texto da busca muda
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
    const results = searchExerciseByName(query); 
    setSearchResults(results);
    } else {
    setSearchResults([]);
  }
  };

  // Função para adicionar um exercício da busca à lista
  const handleSelectedExercise = (exercise: Exercise) => {
    if(addedExercises.some(ex => ex.id === exercise.id)){
      Alert.alert('Este exercício já está na lista.');
      return;
    }
    setSelectedExercise(exercise);
    setCurrentSets(4);
    setCurrentReps(10);
    setIsModalVisible(true);
  };

  const handleConfirmAddExercise = () => {
    if (selectedExercise) {
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
  //manipular os dados do exercicio
  const handleExerciseChange = (exerciseId: number, type: 'sets' | 'reps', change: number) => {
    setAddedExercises(currentExercises =>
      currentExercises.map(ex => {
        if (ex.id === exerciseId) {
          const newValue = ex[type] + change;
          return { ...ex, [type]: newValue > 0 ? newValue : 1 };
        }
        return ex;
      })
    );
  };

  //remover
  const handleRemoveExercise = (exerciseId: number) => {
    setAddedExercises(currentExercises => currentExercises.filter(ex => ex.id !== exerciseId));
  };

  // Função para guardar o treino 
  const handleSaveWorkout = () => {
    if (workoutName.trim() === '' || addedExercises.length === 0) {
      Alert.alert('Atenção', 'Por favor, dê um nome ao treino e adicione pelo menos um exercício.');
      return;
    }
    const newWorkout = {
      id: Date.now(), // ID único baseado no tempo 
      name: workoutName,
      exercises: addedExercises,
    };
    addWorkout(newWorkout); 
    router.back(); 
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
          {/* Series */}
          <Text style={styles.modalLabel}>Séries</Text>
            <View style={styles.modalControl}>
              <TouchableOpacity onPress={() => setCurrentSets(s => Math.max(1, s - 1))}>
                <Ionicons name="remove-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.modalValue}>{currentSets}</Text>
              <TouchableOpacity onPress={() => setCurrentSets(s => s + 1)}>
                <Ionicons name="add-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Repetições */}
            <Text style={styles.modalLabel}>Repetições</Text>
            <View style={styles.modalControl}>
              <TouchableOpacity onPress={() => setCurrentReps(r => Math.max(1, r - 1))}>
                <Ionicons name="remove-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.modalValue}>{currentReps}</Text>
              <TouchableOpacity onPress={() => setCurrentReps(r => r + 1)}>
                <Ionicons name="add-circle" size={40} color={Colors.primary} />
              </TouchableOpacity>
            </View>

  {/* Botões de Ação */}
  <View style={{width: '100%', marginTop: 10}}>
    <Button title="Confirmar" onPress={handleConfirmAddExercise} color={Colors.primary} />
  </View>
  <View style={{width: '100%', marginTop: 10}}>
    <Button title="Cancelar" onPress={() => setIsModalVisible(false)} color="gray" />
  </View>


        </View>
      </View>
    </Modal>
        <TextInput
          style={styles.input}
          placeholder="Nome do Treino (Ex: Treino A - Peito)"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
      
        <Text style={styles.label}>Adicionar Exercício</Text>
        <TextInput
          style={styles.input}
          placeholder="Procurar exercício (Ex: Supino reto)"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        {isSearching && <ActivityIndicator color={Colors.primary} style={{ marginVertical: 10 }} />}


        
        {searchResults.length > 0 && (
          <FlatList
            style={styles.resultsList}
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectedExercise(item)}>
                <Text>{item.name}</Text>
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
                  <Text>{item.name} ({item.sets}x{item.reps})</Text>
              </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum exercício adicionado.</Text>}
        />
    
        <Button title="Salvar Treino" onPress={handleSaveWorkout} color={Colors.primary} />
      
      

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
    marginBottom: 12 
  },

  resultsList: { 
    maxHeight: 150, 
    backgroundColor: Colors.card, 
    borderRadius: 8 
  },

  resultItem: { 
    padding: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.lightGray 
  },

  addedItem: { 
    backgroundColor: '#E0F2F1', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 8 
  },

  emptyListText: { 
    textAlign: 'center', 
    color: '#666', 
    marginVertical: 10 
  },

  modalContainer:{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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