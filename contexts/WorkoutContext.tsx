import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout, WorkoutLog } from '../types/types';

const WORKOUTS_STORAGE_KEY = '@TreinoHub:workouts';
const LOGS_STORAGE_KEY = '@TreinoHub:logs';

// 1. Definir a "forma" do contexto
interface WorkoutContextData {
  workouts: Workout[];
  logs: WorkoutLog[];
  loading: boolean;
  addWorkout: (newWorkout: Workout) => void;
  deleteWorkout: (workoutId: number) => void;
  updateWorkout: (updatedWorkout: Workout) => void;
  finishWorkout: (workout: Workout) => void;
  deleteLog: (logId: string) => void;
  clearHistory: () => void;
}

// 2. Criar o Contexto
const WorkoutContext = createContext<WorkoutContextData | undefined>(undefined);

// 3. Criar o Provedor (Provider)
export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [storedWorkouts, storedLogs] = await Promise.all([
          AsyncStorage.getItem(WORKOUTS_STORAGE_KEY),
          AsyncStorage.getItem(LOGS_STORAGE_KEY)
        ]);

        if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));
        if (storedLogs) setLogs(JSON.parse(storedLogs));
      } catch (e) {
        console.error("Falha ao carregar dados.", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const saveWorkoutsToStorage = useCallback(async (newWorkouts: Workout[]) => {
    try {
      setWorkouts(newWorkouts);
      await AsyncStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(newWorkouts));
    } catch (e) {
      console.error("Falha ao salvar treinos.", e);
    }
  }, []);

  const saveLogsToStorage = useCallback(async (newLogs: WorkoutLog[]) => {
    try {
      setLogs(newLogs);
      await AsyncStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(newLogs));
    } catch (e) {
      console.error("Falha ao salvar logs.", e);
    }
  }, []);

  const addWorkout = useCallback((newWorkout: Workout) => {
    const updatedWorkouts = [...workouts, newWorkout];
    saveWorkoutsToStorage(updatedWorkouts);
  }, [workouts, saveWorkoutsToStorage]);

  const deleteWorkout = useCallback((workoutId: number) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    saveWorkoutsToStorage(updatedWorkouts);
  }, [workouts, saveWorkoutsToStorage]);

  const updateWorkout = useCallback((updatedWorkout: Workout) => {
    const updatedWorkouts = workouts.map(w => w.id === updatedWorkout.id ? updatedWorkout : w);
    saveWorkoutsToStorage(updatedWorkouts);
  }, [workouts, saveWorkoutsToStorage]);

  const finishWorkout = useCallback((workout: Workout) => {
    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      workoutId: workout.id,
      workoutName: workout.name,
      date: new Date().toISOString(),
    };
    const updatedLogs = [newLog, ...logs];
    saveLogsToStorage(updatedLogs);
  }, [logs, saveLogsToStorage]);

  const deleteLog = useCallback((logId: string) => {
    const updatedLogs = logs.filter(l => l.id !== logId);
    saveLogsToStorage(updatedLogs);
  }, [logs, saveLogsToStorage]);

  const clearHistory = useCallback(() => {
    saveLogsToStorage([]);
  }, [saveLogsToStorage]);

  const value = {
    workouts,
    logs,
    loading,
    addWorkout,
    deleteWorkout,
    updateWorkout,
    finishWorkout,
    deleteLog,
    clearHistory,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
};
