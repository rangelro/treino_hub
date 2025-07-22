import { Stack } from 'expo-router';
import { WorkoutProvider } from '../contexts/WorkoutContext'; // 1. Importar o Provedor

export default function RootLayout() {
  return (
    // 2. Envolver toda a aplicação com o WorkoutProvider
    <WorkoutProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="treinos/add" 
          options={{ title: 'Adicionar Treino', presentation: 'modal' }} 
        />
        <Stack.Screen 
          name="treinos/[id]" 
          options={{ title: 'Detalhes do Treino' }} 
        />
        <Stack.Screen 
          name="treinos/edit/[id]" 
          options={{ title: 'Editar Treino' }} 
        />
      </Stack>
    </WorkoutProvider>
  );
}
