import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import { Colors } from '../../constants/Colors';
import { useWorkoutContext } from '../../contexts/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';

export default function ConfiguracoesScreen() {
  const { logs, deleteLog, clearHistory } = useWorkoutContext();
  const [activeNotification, setActiveNotification] = useState(true);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      const isSubscribed = await OneSignal.User.pushSubscription.getOptedInAsync();
      setActiveNotification(isSubscribed);
    } catch (error) {
      console.error('Erro ao verificar o status da notificação:', error);
    }
  }

  const switchNotification = (active: boolean) => {
    try {
      if (active) {
        OneSignal.User.pushSubscription.optIn();
      } else {
        OneSignal.User.pushSubscription.optOut();
      }
      setActiveNotification(active);
    } catch (error) {
      console.error('Erro ao ativar/desativar notificação:', error);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja apagar todo o seu histórico de treinos?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Limpar", style: "destructive", onPress: clearHistory }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notificações Push</Text>
          <Switch
            value={activeNotification}
            onValueChange={switchNotification}
            trackColor={{ false: '#767577', true: Colors.primary }}
          />
        </View>
      </View>

      <View style={[styles.section, { flex: 1 }]}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>Histórico de Treinos</Text>
          {logs.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearText}>Limpar tudo</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <View>
                <Text style={styles.logWorkoutName}>{item.workoutName}</Text>
                <Text style={styles.logDate}>{formatDate(item.date)}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteLog(item.id)}>
                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Nenhum treino concluído ainda.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.secondary,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearText: {
    color: Colors.danger,
    fontSize: 14,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  logWorkoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  logDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#999',
    marginTop: 10,
    fontSize: 16,
  },
});
