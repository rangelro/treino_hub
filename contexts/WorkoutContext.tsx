import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types/types';

const WORKOUTS_STORAGE_KEY = '@TreinoHub:workouts';

// 1. Definir a "forma" do nosso contexto
interface WorkoutContextData {
  workouts: Workout[];
  loading: boolean;
  addWorkout: (newWorkout: Workout) => void;
  deleteWorkout: (workoutId: number) => void;
  updateWorkout: (updatedWorkout: Workout) => void;
}

// 2. Criar o Contexto
const WorkoutContext = createContext<WorkoutContextData | undefined>(undefined);

// 3. Criar o Provedor (Provider)
// Este componente vai "abraçar" a nossa aplicação e fornecer o estado
export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const storedWorkouts = await AsyncStorage.getItem(WORKOUTS_STORAGE_KEY);
        if (storedWorkouts) {
          setWorkouts(JSON.parse(storedWorkouts));
        }
      } catch (e) {
        console.error("Falha ao carregar treinos.", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const saveWorkoutsToStorage = useCallback(async (newWorkouts: Workout[]) => {
    try {
      setWorkouts(newWorkouts);
      const jsonValue = JSON.stringify(newWorkouts);
      await AsyncStorage.setItem(WORKOUTS_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error("Falha ao salvar treinos.", e);
    }
  }, []);

  const addWorkout = useCallback((newWorkout: Workout) => {
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    saveWorkoutsToStorage(updatedWorkouts);
  }, [workouts, saveWorkoutsToStorage]);

  const deleteWorkout = useCallback((workoutId: number) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    setWorkouts(updatedWorkouts);
    saveWorkoutsToStorage(updatedWorkouts);
  }, [workouts, saveWorkoutsToStorage]);

  const updateWorkout = useCallback((updatedWorkout: Workout) => {
    const updatedWorkouts = workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w);
    setWorkouts(updatedWorkouts);
    saveWorkoutsToStorage(updatedWorkouts)
  }, [workouts, saveWorkoutsToStorage]);


  const value = {
    workouts,
    loading,
    addWorkout,
    deleteWorkout,
    updateWorkout,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

// 4. Criar um hook personalizado para usar o contexto facilmente
export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
};
