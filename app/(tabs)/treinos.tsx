import React from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Workout } from '../../types/types';
import WorkoutCard from '../../components/WorkoutCard'; 
import { Colors } from '../../constants/Colors';
import { useWorkoutContext } from '../../contexts/WorkoutContext';


export default function WorkoutsScreen() {

  const { workouts, loading } = useWorkoutContext();

  if (loading) {
    return (
      <View style={styles.container}> 
        <ActivityIndicator size='large' color={Colors.primary}/> 
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
      
        renderItem={({ item }) => <WorkoutCard workout={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View>
              <Text style={styles.emptyText}>Nenhum treino encontrado.</Text>
              <Text style={styles.emptySubText}> Clique no botão + para adicionar um novo treino</Text>
          </View>
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.secondary,
  },
  emptySubText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
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