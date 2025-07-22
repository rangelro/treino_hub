import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Workout } from '../../types/types';
import WorkoutCard from '../../components/WorkoutCard'; 
import { Colors } from '../../constants/Colors';

const MOCK_WORKOUTS: Workout[] = [
  {
    id: 1, name: 'Treino A - Peito e Tríceps',
    exercises: [ { id: 101, name: 'Supino Reto', sets: 4, reps: 10 }, { id: 102, name: 'Supino Inclinado', sets: 4, reps: 12 }, ],
  },
  {
    id: 2, name: 'Treino B - Costas e Bíceps',
    exercises: [ { id: 201, name: 'Remada Curvada', sets: 4, reps: 10 }, { id: 202, name: 'Puxada Alta', sets: 3, reps: 15 }, ],
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_WORKOUTS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <WorkoutCard workout={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.headerTitle}>Treino de Hoje:</Text>
        }
        ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum treino encontrado.</Text>
        }
      />

    
      <Link href="/treinos/add" asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.secondary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
  },
});
