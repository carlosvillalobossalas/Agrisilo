import React, { useEffect, useState } from 'react'
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { useAppSelector } from '../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
// import JobsScreen from '../screens/jobs/JobsScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../store/slices/authSlice';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import LogoutButton from '../components/LogoutButton';

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
    initialRouteName: 'Calendar',
    screenOptions: {
        headerRight: () => (
            <LogoutButton />
        ),
        headerTitleStyle: {
            fontSize: 28,
        },
        tabBarShowLabel: false,
    },
    screens: {
        Calendar: CalendarScreen
    }
})


const RootStack = createNativeStackNavigator({
    initialRouteName: 'App',
    screenOptions: {
        headerShown: false,
    },
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
    const dispatch = useDispatch();

    const [initializing, setInitializing] = useState(true)


    const handleAuthStateChanged = (res: any) => {
        dispatch(loginStart())
        const userResponse = res as FirebaseAuthTypes.User | null;
        const userJson = userResponse?.toJSON()
        console.log("🚀 ~ handleAuthStateChanged ~ user:", userJson)
        if (userJson) {
            dispatch(loginSuccess(userJson))
        } else {
            dispatch(loginFailure('No user logged in'))
        }

        if (initializing) setInitializing(false)

    }

    useEffect(() => {
        const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
        return subscriber;
    }, [])


    if (initializing) return null;


    const Navigation = createStaticNavigation(user ? RootStack : AuthStack);
    return <Navigation />;
}
