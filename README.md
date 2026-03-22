# 🏋️‍♂️ Treino Hub

![Status](https://img.shields.io/badge/Status-Ativo-success)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)

O **Treino Hub** é um aplicativo mobile moderno projetado para ajudar você a gerenciar suas rotinas de treino de forma digital e inteligente. O objetivo é substituir as tradicionais fichas de treino em papel, oferecendo uma solução prática, rápida e com foco total na melhor experiência de usuário (UX/UI) para acompanhar seu progresso na academia.

---

## ✨ Funcionalidades

O aplicativo oferece um conjunto robusto de ferramentas para você focar no que importa:

- 📝 **Gestão Completa de Treinos**: Crie, visualize, edite e exclua treinos (ex: Treino A, B, C) de forma intuitiva.
- 💪 **Banco de Exercícios Integrado**: Escolha exercícios a partir de uma lista pré-definida com filtros inteligentes por grupo muscular (Peito, Costas, Pernas, etc.). Busca super rápida!
- 🔄 **Séries e Repetições**: Personalize facilmente o volume do seu treino (ex: 4 Séries x 12 Repetições) usando inputs customizados em modais elegantes.
- ⚖️ **Registro de Cargas Automático (Progressive Overload)**: Digite o peso (kg) que você usou em cada exercício enquanto treina. O salvamento é automático! No seu próximo treino, o aplicativo lembrará exatamente a carga que você parou.
- ✅ **Checklist Interativo do Treino**: Marque os exercícios como concluídos diretamente na lista do treino. Eles recebem feedback tátil visual opaco e texto riscado, para nunca se perder.
- 💾 **Persistência Local Offline**: Os exercícios e cargas mudadas são salvos no dispositivo de forma totalmente offline. Sem internet? Sem problemas.
- 💡 **Dica do Dia**: Receba fatos interessantes ou dicas de hipertrofia direto na página principal, para se manter motivado.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído pregando as práticas modernas de desenvolvimento mobile:

- **React Native** e **Expo**: Base principal para desenvolvimento híbrido super veloz.
- **TypeScript**: Usado em 100% do projeto para tipagem forte e manutenção segura.
- **Expo Router**: Gerenciamento de navegação fluída entre telas baseada em arquivos (`app/`).
- **React Context API e Hooks**: Utilizado amplamente para gerenciamento global e limpo de estado, incluindo hidratação do AsyncStorage.
- **AsyncStorage**: Banco de dados não relacional simples embutido no aparelho.
- **Expo Haptics**: Inclui micro-vibrações (feedback tátil) ao marcar exercícios e finalizar treinos para garantir uma experiência mais premium.

---

## 🚀 Como Executar o Projeto

Para executar o app localmente em sua máquina, siga os passos abaixo:

**1. Clone este repositório:**
```bash
git clone https://github.com/rangelro/treino_hub.git
```

**2. Acesse a pasta e instale as dependências:**
```bash
cd treino_hub
npm install
```

**3. Inicie o servidor de desenvolvimento Expo:**
```bash
npm start
```

Após iniciar, um QR code será exibido no terminal. 
- **Se você tem um Celular**: Baixe o aplicativo `Expo Go` no seu (Android/iOS) e leia o QR code diretamente pela câmera.
- **Se você usa um Emulador**: Apenas digite a tecla `a` (para abrir no Android) ou `i` (caso possua MacOS simulador iOS) no própio terminal acima do servidor recém iniciado.

---

## 📱 Telas do Aplicativo

<p align="center">
  <img width="200" alt="Screenshot_1" src="https://github.com/user-attachments/assets/cacd116a-9dcc-435d-b3c7-931ce8e6d77d" />
  <img width="200" alt="Screenshot_2" src="https://github.com/user-attachments/assets/26895c19-3e61-40a1-95ed-e90cdde64a69" />
  <img width="200" alt="Screenshot_3" src="https://github.com/user-attachments/assets/3e0a38cb-814f-4f7a-96a1-5d8f43181b15" />
  <img width="200" alt="Screenshot_4" src="https://github.com/user-attachments/assets/cf1f8c10-103b-4929-bdbb-94d985c48d73" />
</p>

---
⭐ Desenvolvido para facilitar o dia a dia de quem busca evolução e consistência contínua!
