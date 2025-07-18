import { Stack } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
  return (
    <Stack>
      {/* A linha mais importante: diz ao Stack para renderizar o nosso
          grupo de abas como a tela principal. O nome "(tabs)" deve
          corresponder exatamente ao nome da pasta. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* As outras telas que abrem por cima das abas */}
      <Stack.Screen 
        name="treinos/add" 
        options={{ title: 'Adicionar Treino', presentation: 'modal' }} 
      />
      <Stack.Screen 
        name="treinos/[id]" 
        options={{ title: 'Detalhes do Treino' }} 
      />
    </Stack>
  );
}
