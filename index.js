/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

AppRegistry.registerComponent(appName, () => App);
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;


messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Notificación en background:', remoteMessage);
});