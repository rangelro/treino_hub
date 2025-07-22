import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ExerciseItem from '../../components/ExerciseItem';
import { Colors } from '../../constants/Colors';
import { useWorkoutContext } from '../../contexts/WorkoutContext';

import {Link, Stack} from 'expo-router';


export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); 
  const { workouts, loading, deleteWorkout } = useWorkoutContext();
  const router = useRouter();
  
  const WorkoutId = parseInt(id as string);
  const workout = workouts.find(w => w.id === WorkoutId);

  const handleDelete = () => {
    Alert.alert(
      "Apagar Treino",
      "Tem a certeza que quer apagar este treino? Esta ação não pode ser desfeita.",
      [
        // Botão de cancelar
        { text: "Cancelar", style: "cancel" },
        // Botão de confirmar
        { text: "Apagar", style: "destructive", onPress: () => {
            if (WorkoutId) {
              deleteWorkout(WorkoutId);
              router.back(); // Volta para a lista após apagar
            }
          } 
        }
      ]
    );
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
        headerRight: () => (
          <Link href={`/treinos/edit/${id}`} asChild>
            <TouchableOpacity>
              <Text style={{ color: Colors.primary, fontSize: 16 }}>Editar</Text>
            </TouchableOpacity>
          </Link>
        )
      }}/>
      <FlatList
        data={workout.exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ExerciseItem exercise={item} />}
        contentContainerStyle={styles.list}
        // Adiciona um botão de apagar no final da lista
        ListFooterComponent={
          <View style={{ marginTop: 20 }}>
            <Button title="Apagar Treino" color={Colors.danger} onPress={handleDelete} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
});