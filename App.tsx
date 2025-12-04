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

dayjs.locale('es');

const theme = {
  ...DefaultTheme,
  colors: customColors.colors,
}

// Componente interno que usa hooks de Redux y Navegación
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {

    // Manejar notificaciones en foreground
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title ?? 'Notificación',
        remoteMessage.notification?.body,
        [
          { text: 'Cerrar', style: 'cancel' },
          {
            text: 'Ver', onPress: async () => {
              if (remoteMessage.data?.eventId) {
                const eventId = remoteMessage.data.eventId.toString();
                const event = await getEventById(eventId);
                dispatch(setOnOpenNotification(event));
              }
            }
          }
        ]
      );
    });

    // Manejar tap en notificación (cuando la app está en background)
    const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp(async remoteMessage => {
      if (remoteMessage.data?.eventId) {
        const eventId = remoteMessage.data.eventId.toString();
        const event = await getEventById(eventId);
        dispatch(setOnOpenNotification(event));
      } else {
        console.warn('⚠️ No se encontró eventId en remoteMessage.data');
      }
    });

    // Manejar tap en notificación (cuando la app estaba cerrada)
    messaging().getInitialNotification().then(async remoteMessage => {
      if (remoteMessage) {

        if (remoteMessage.data?.eventId) {
          const eventId = remoteMessage.data.eventId.toString();
          const event = await getEventById(eventId);
          dispatch(setOnOpenNotification(event));
        } else {
          console.warn('⚠️ No se encontró eventId en remoteMessage.data');
        }
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

