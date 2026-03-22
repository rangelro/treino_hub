export interface Exercise {
    id: number;
    name: string;
    muscleGroup: string;
}

export interface WorkoutExercise extends Exercise {
    sets: number;
    reps: number;
    weight?: string;
}

export interface Workout {
    id: number;
    name: string;
    exercises: WorkoutExercise[];
}

export interface WorkoutLog {
    id: string;
    workoutId: number;workoutName: string;
    date: string; // ISO String
    durationMinutes?: number;
}