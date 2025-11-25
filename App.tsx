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

