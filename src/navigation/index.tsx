import React, { useEffect, useState } from 'react'
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { useAppSelector } from '../store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../store/slices/authSlice';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import ToDoScreen from '../screens/todos/ToDoScreen';
import ClientScreen from '../screens/clients/ClientScreen';
import ConfigScreen from '../screens/config/ConfigScreen';
import ServiceScreen from '../screens/services/ServiceScreen';
import ClientsScreen from '../screens/clients/ClientsScreen';
import StatusScreen from '../screens/status/StatusScreen';
import { getAllStatus } from '../services/status';
import { setAllStatus } from '../store/slices/statusSlice';
import StatusesScreen from '../screens/status/StatusesScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import { getAllServices } from '../services/services';
import { setAllServices } from '../store/slices/serviceSlice';
import { getAllClients } from '../services/clients';
import { setAllClients } from '../store/slices/clientSlice';
import EventScreen from '../screens/events/EventScreen';
import { getAllEvents } from '../services/events';
import { setAllEvents } from '../store/slices/eventSlice';
import Icon from '@react-native-vector-icons/material-design-icons';
import { TouchableOpacity, View } from 'react-native';
import UsersScreen from '../screens/users/UsersScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import { getUser } from '../services/auth';
import ProfileScreen from '../screens/users/ProfileScreen';
import UserScreen from '../screens/users/UserScreen';



const AuthStack = createNativeStackNavigator({
    initialRouteName: 'Login',
    screens: {
        Login: {
            screen: Login,
            options: {
                headerShown: false
            }
        },
        SignUp: {
            screen: SignUpScreen,
            options: {
                headerShown: true,
                headerTitle: 'Registro',
                headerBackButtonDisplayMode: 'minimal'
            },
        },
    }
})

const AppTabs = createBottomTabNavigator({
    initialRouteName: 'Calendario',
    screenOptions: {
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
            screen: ClientsScreen,
            options: ({ navigation }) => ({
                tabBarIcon: ({ focused }) => {
                    const { colors } = useTheme()
                    return (
                        <IconButton
                            icon="account-group-outline"
                            iconColor={focused ? colors.primary : colors.outline}
                        />
                    )
                },
                headerRight: () => <IconButton icon={'plus'} onPress={() => navigation.navigate('ClientScreen')} />
            })
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
        headerBackButtonDisplayMode: 'minimal',
    },
    screens: {
        Calendar: AppTabs,
        EventScreen: {
            screen: EventScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'Agregar Evento',
            },
        },
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
        ServiceScreen: {
            screen: ServiceScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'Agregar Servicio',
            },
        },
        ServicesScreen: {
            screen: ServicesScreen,
            headerStyle: {
                // height: 110,
            },
            options: ({ navigation }) => ({
                // headerTransparent: true,
                headerShown: true,
                headerShadowVisible: false,
                headerTitle: 'Servicios',
                headerStyle: {
                },
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ServiceScreen')}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.25)',
                            padding: 5,
                            borderRadius: 20,
                        }}
                    >
                        <Icon name="plus" size={28} color="#000" />
                    </TouchableOpacity>
                ),



            })
        },
        StatusScreen: {
            screen: StatusScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'Agregar Estado',
            },
        },
        StatusesScreen: {
            screen: StatusesScreen,
            headerStyle: {
                height: 110
            },
            options: ({ navigation }) => (
                {
                    headerShown: true,
                    headerTitle: 'Estados',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('StatusScreen')}
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                padding: 5,
                                borderRadius: 20,
                            }}
                        >
                            <Icon name="plus" size={28} color="#000" />
                        </TouchableOpacity>
                    ),

                }
            )
        },

        UsersScreen: {
            screen: UsersScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'Usuarios',
            },
        },
        UserScreen: {
            screen: UserScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'Usuario',
            },
        },
        ProfileScreen: {
            screen: ProfileScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'Mi Perfil',
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


    const handleAuthStateChanged = async (res: any) => {

        const userResponse = res as FirebaseAuthTypes.User | null;
        const user = userResponse?.toJSON()
        if (userResponse) {
            dispatch(loginStart())

            const userFS = await getUser(userResponse?.uid)
            console.log(userFS)
            if (user && userFS) {
                dispatch(loginSuccess({ user, userFS }))
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

    useEffect(() => {
        if (user) {
            const unsubscribe = getAllStatus((data) => {
                console.log('status', data)
                dispatch(setAllStatus(data))
            })
            return () => unsubscribe()
        }
    }, [user])

    useEffect(() => {
        if (user) {
            const unsubscribe = getAllServices((data) => {
                console.log('services', data)
                dispatch(setAllServices(data))
            })
            return () => unsubscribe()
        }
    }, [user])

    useEffect(() => {
        if (user) {
            const unsubscribe = getAllClients((data) => {
                console.log('clients', data)
                dispatch(setAllClients(data))
            })
            return () => unsubscribe()
        }
    }, [user])

    useEffect(() => {
        if (user) {
            const unsubscribe = getAllEvents((data) => {
                console.log('events', data)
                dispatch(setAllEvents(data))
            })
            return () => unsubscribe()
        }
    }, [user])


    if (initializing) return null;


    const Navigation = createStaticNavigation(user ? RootStack : AuthStack);
    return <Navigation />;
}
