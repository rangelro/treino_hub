import { EXERCICIOS_LOCAIS } from "../data/exercises";
import { Exercise } from "../types/types";

//simula a busca , mas procura na lista (se eu achar uma api boa mudo depois)
export const searchExerciseByName = (name: string): Exercise[] => {
    if(name.trim() === ''){
        return [];
    }

    const lowerCaseName = name.toLowerCase();


    const filteredExercises = EXERCICIOS_LOCAIS.filter(exercise => //filtrando na lista local
        exercise.name.toLowerCase().includes(lowerCaseName)
    );

    return filteredExercises;

}