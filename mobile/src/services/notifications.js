import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from './api';

export async function setupNotifications() {
  if (!Device.isDevice) {
    console.log('Notificações push só funcionam em dispositivos físicos');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Permissão para notificações não concedida');
    return;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId
    });
    
    await api.put('/auth/fcm-token', { fcmToken: token.data });
    
    console.log('Token de notificação registrado:', token.data);
  } catch (error) {
    console.error('Erro ao obter token de notificação:', error);
  }
}

export async function scheduleLocalNotification(title, body, data = {}, seconds = 1) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: {
      seconds,
    },
  });
}

export async function scheduleFeedingReminder(petName, time) {
  const [hours, minutes] = time.split(':').map(Number);
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hora da Alimentação',
      body: `Está na hora de alimentar ${petName}!`,
      sound: true,
    },
    trigger: {
      hour: hours,
      minute: minutes,
      repeats: true,
    },
  });
}