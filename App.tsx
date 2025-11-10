import React from 'react'
import { DefaultTheme, PaperProvider } from 'react-native-paper'
import { customColors } from './src/themeColors';
import { store } from './src/store';
import { Provider } from 'react-redux';
import Navigation from './src/navigation';
import 'react-native-reanimated'
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // 👈 importa el idioma
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

dayjs.locale('es');

const theme = {
  ...DefaultTheme,
  colors: customColors.colors,
}


const App = () => {


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

