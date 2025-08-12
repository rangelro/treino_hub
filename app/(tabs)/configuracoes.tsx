import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { OneSignal } from 'react-native-onesignal';
import { Colors } from '../../constants/Colors';



export default function ConfiguracoesScreen() {

  const [activeNotification, setActiveNotification] = useState(true);

  useEffect(() => {
    checkNotificationStatus();
  
  }, []);

  const checkNotificationStatus = async () => {
    try{
      const isSubscribed = OneSignal.User.pushSubscription.getOptedInAsync();
      setActiveNotification(!isSubscribed);
    } catch (error) {
      console.error('Erro ao verificar o status da notificação:', error);
    }
    }

  const switchNotification = (active:boolean) => {
    try{
      if(active){
        OneSignal.User.pushSubscription.optIn();
      }else{
        OneSignal.User.pushSubscription.optOut();
      }
      setActiveNotification(active);
    } catch (error) {
      console.error('Erro ao ativar/desativar notificação:', error);
    }
  };

  return (
    <View style={styles.container}>      
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notificações Push</Text>
        <Switch
          value={activeNotification}
          onValueChange={switchNotification}
          trackColor={{ false: '#767577', true: Colors.primary }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
  },

});