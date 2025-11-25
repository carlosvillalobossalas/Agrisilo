import React, { useEffect } from 'react'
import { DefaultTheme, PaperProvider } from 'react-native-paper'
import { customColors } from './src/themeColors';
import { store } from './src/store';
import { Provider } from 'react-redux';
import Navigation from './src/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import 'react-native-reanimated'
import 'dayjs/locale/es'; // 👈 importa el idioma
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

dayjs.locale('es');

const theme = {
  ...DefaultTheme,
  colors: customColors.colors,
}


const App = () => {

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification?.title ?? 'Notificación',
        remoteMessage.notification?.body
      );
    });

    return unsubscribe;
  }, []);

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <PaperProvider theme={theme}>
            <Navigation />
          </PaperProvider>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

export default App

