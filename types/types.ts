export interface Exercise{
    id: number;
    name:string;

}

export interface WorkoutExercise extends Exercise{
    sets: number;
    reps:number;
}

export interface Workout{
    id: number;
    name: string;
    exercises: WorkoutExercise[];
}