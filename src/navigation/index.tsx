import React from 'react'
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { useAppSelector } from '../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
// import JobsScreen from '../screens/jobs/JobsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import SignUp from '../screens/auth/SignUp';


const AuthStack = createNativeStackNavigator({
    initialRouteName: 'Login',
    screens: {
        Login: {
            screen: Login,
            options: {
                headerShown: false
            }
        },
        // SignUp: {
        //     screen: SignUp,
        //     options: {
        //         headerShown: true,
        //         headerTitle: '',
        //         headerBackTitle: 'Iniciar sesión',                
        //     }
        // }
    }
})

const AppTabs = createBottomTabNavigator({
    screens: {
        // Jobs: JobsScreen
    }
})


const RootStack = createNativeStackNavigator({
    initialRouteName: 'App',
    screens: {
        App: AppTabs
    }
})

type AuthStackParamList = StaticParamList<typeof AuthStack>;
type RootStackParamList = StaticParamList<typeof RootStack>;
export type { AuthStackParamList, RootStackParamList };

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList, AuthStackParamList { }
    }
}

export default function Navigation() {
    const user = useAppSelector((state) => state.authState.user);


    const Navigation = createStaticNavigation(user ? RootStack : AuthStack);
    return <Navigation />;
}
