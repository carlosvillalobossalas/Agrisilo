import React from 'react'
import { DefaultTheme, PaperProvider } from 'react-native-paper'
import { customColors } from './src/themeColors';
import { store } from './src/store';
import { Provider } from 'react-redux';
import Navigation from './src/navigation';

const theme = {
  ...DefaultTheme,
  colors: customColors.colors,
}


const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <Navigation />
      </PaperProvider>
    </Provider>
  )
}

export default App

