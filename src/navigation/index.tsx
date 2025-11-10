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
import { IconButton, useTheme } from 'react-native-paper';
import ToDoScreen from '../screens/todos/ToDoScreen';
import ClientScreen from '../screens/clients/ClientScreen';
import ConfigScreen from '../screens/config/ConfigScreen';

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
    initialRouteName: 'Calendario',
    screenOptions: {
        // headerRight: () => (
        //     <LogoutButton />
        // ),
        headerStyle: {
            height: 110
        }
    },
    screens: {
        Calendario: {
            screen: CalendarScreen,
            options: {
                headerShown: false,
                tabBarIcon: ({ focused }) => {
                    const { colors } = useTheme()
                    return (
                        <IconButton
                            icon="calendar"
                            iconColor={focused ? colors.primary : colors.outline}
                        />
                    )
                }
            }
        },
        Tareas: {
            screen: ToDoScreen,
            options: {
                tabBarIcon: ({ focused }) => {
                    const { colors } = useTheme()
                    return (
                        <IconButton
                            icon="format-list-checks"
                            iconColor={focused ? colors.primary : colors.outline}
                        />
                    )
                }
            }
        },
        Clientes: {
            screen: ClientScreen,
            options: {
                tabBarIcon: ({ focused }) => {
                    const { colors } = useTheme()
                    return (
                        <IconButton
                            icon="account-group-outline"
                            iconColor={focused ? colors.primary : colors.outline}
                        />
                    )
                }
            }
        },
        Config: {
            screen: ConfigScreen,
            options: {
                tabBarIcon: ({ focused }) => {
                    const { colors } = useTheme()
                    return (
                        <IconButton
                            icon="cog"
                            iconColor={focused ? colors.primary : colors.outline}
                        />
                    )
                }
            }
        }
    }
})


const RootStack = createNativeStackNavigator({
    initialRouteName: 'Calendar',
    screenOptions: {
        headerShown: false,
        headerBackButtonDisplayMode: 'minimal'
    },
    screens: {
        Calendar: AppTabs,
        ClientScreen: {
            screen: ClientScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'Agregar Cliente',
            },
        },
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
        if (!user) {
            dispatch(loginStart())
            const userResponse = res as FirebaseAuthTypes.User | null;
            const userJson = userResponse?.toJSON()
            console.log("🚀 ~ handleAuthStateChanged ~ user:", userJson)
            if (userJson) {
                dispatch(loginSuccess(userJson))
            } else {
                dispatch(loginFailure('No user logged in'))
            }
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
