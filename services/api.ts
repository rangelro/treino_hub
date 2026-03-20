import { EXERCICIOS_LOCAIS } from "../data/exercises";
import { Exercise } from "../types/types";

// Busca exercícios por nome ou por grupo muscular
export const searchExercises = (query: string, muscleGroup?: string): Exercise[] => {
    let filtered = EXERCICIOS_LOCAIS;

    if (muscleGroup && muscleGroup !== 'Todos') {
        filtered = filtered.filter(ex => ex.muscleGroup === muscleGroup);
    }

    if (query.trim() !== '') {
        const lowerCaseQuery = query.toLowerCase();
        filtered = filtered.filter(ex =>
            ex.name.toLowerCase().includes(lowerCaseQuery)
        );
    }

    return filtered;
}

// Retorna todos os grupos musculares únicos disponíveis
export const getMuscleGroups = (): string[] => {
    const groups = EXERCICIOS_LOCAIS.map(ex => ex.muscleGroup);
    return ['Todos', ...new Set(groups)];
}