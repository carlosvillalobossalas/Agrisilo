import 'dayjs/locale/es'; // 👈 importa el idioma
import 'react-native-reanimated'
import { Alert } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { customColors } from './src/themeColors';
import { DefaultTheme, PaperProvider } from 'react-native-paper'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './src/store';
import dayjs from 'dayjs';
import messaging from '@react-native-firebase/messaging';
import Navigation from './src/navigation';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setOnOpenNotification } from './src/store/slices/eventSlice';
import { getEventById } from './src/services/events';
import { setPendingNavigation } from './src/store/slices/notificationSlice';

dayjs.locale('es');

const theme = {
  ...DefaultTheme,
  colors: customColors.colors,
}

// Componente interno que usa hooks de Redux y Navegación
const AppContent = () => {
  const dispatch = useDispatch();

  const handleNotificationOpen = async (remoteMessage: any) => {
    if (!remoteMessage?.data) return;

    const notificationType = remoteMessage.data.type;

    if (notificationType === 'todo_reminder') {
      // Es un recordatorio de tarea, despachar navegación pendiente
      console.log('🔔 Opening todo reminder');
      dispatch(setPendingNavigation({ screen: 'Recordatorios', type: 'todo_reminder' }));
    } else if (remoteMessage.data.eventId) {
      // Es un evento o recordatorio de evento
      const eventId = remoteMessage.data.eventId.toString();
      console.log('🔍 Fetching event with ID:', eventId);
      
      const event = await getEventById(eventId);
      console.log('✅ Event fetched:', event);
      
      if (event) {
        dispatch(setOnOpenNotification(event));
        dispatch(setPendingNavigation({ screen: 'EventScreen', type: 'event' }));
      } else {
        console.warn('⚠️ Event not found for ID:', eventId);
      }
    }
  };

  useEffect(() => {

    // Manejar notificaciones en foreground (cuando la app está abierta)
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('📱 Foreground notification received');
      Alert.alert(
        remoteMessage.notification?.title ?? 'Notificación',
        remoteMessage.notification?.body,
        [
          { text: 'Cerrar', style: 'cancel' },
          {
            text: 'Ver', onPress: () => handleNotificationOpen(remoteMessage)
          }
        ]
      );
    });

    // Manejar tap en notificación cuando la app está en background
    const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('📱 Background notification opened');
      await handleNotificationOpen(remoteMessage);
    });

    // Manejar SOLO cuando la app se abre por primera vez desde una notificación (killed state)
    // Este solo se ejecuta una vez al montar el componente
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log('🚀 App opened from killed state via notification');
          await handleNotificationOpen(remoteMessage);
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpen();
    };
  }, [dispatch]);

  return <Navigation />;
};

const App = () => {
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <AppContent />
          </PaperProvider>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default App

