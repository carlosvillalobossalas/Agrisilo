import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { FirebaseAuthTypes, getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
import { getAllClients } from '../services/clients';
import { getAllEvents } from '../services/events';
import { getAllServices } from '../services/services';
import { getAllStatus } from '../services/status';
import { getUser, saveUserFCMToken } from '../services/auth';
import { HeaderShareButton } from '../components/CustomHeaderShareButton';
import { IconButton, useTheme } from 'react-native-paper';
import { loginFailure, loginStart, loginSuccess } from '../store/slices/authSlice';
import { setAllClients } from '../store/slices/clientSlice';
import { setAllEvents } from '../store/slices/eventSlice';
import { setAllServices } from '../store/slices/serviceSlice';
import { setAllStatus } from '../store/slices/statusSlice';
import { TouchableOpacity } from 'react-native';
import { useAppSelector } from '../store';
import { useDispatch } from 'react-redux';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import ClientScreen from '../screens/clients/ClientScreen';
import ClientsScreen from '../screens/clients/ClientsScreen';
import ConfigScreen from '../screens/config/ConfigScreen';
import EventScreen from '../screens/events/EventScreen';
import EventToPdfScreen from '../screens/events/EventToPdfScreen';
import Icon from '@react-native-vector-icons/material-design-icons';
import Login from '../screens/auth/Login';
import messaging from '@react-native-firebase/messaging';
import PdfViewerScreen from '../screens/events/PdfViewerScreen';
import ProfileScreen from '../screens/users/ProfileScreen';
import React, { useEffect, useState } from 'react'
import ServiceScreen from '../screens/services/ServiceScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import StatusesScreen from '../screens/status/StatusesScreen';
import StatusScreen from '../screens/status/StatusScreen';
import ToDoScreen from '../screens/todos/ToDoScreen';
import UserScreen from '../screens/users/UserScreen';
import UsersScreen from '../screens/users/UsersScreen';


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
    screenOptions: () => {
        const { colors } = useTheme();
        return {
            headerStyle: {
                height: 110
            },
            tabBarActiveTintColor: colors.primary,     // 👈 texto del tab activo
            tabBarInactiveTintColor: colors.outline,   // 👈 texto del tab inactivo
            tabBarStyle: {
                backgroundColor: colors.surface,        // opcional, combina con tu tema
            },
        };
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
        // Clientes: {
        //     screen: ClientsScreen,
        //     options: ({ navigation }) => ({
        //         tabBarIcon: ({ focused }) => {
        //             const { colors } = useTheme()
        //             return (
        //                 <IconButton
        //                     icon="account-group-outline"
        //                     iconColor={focused ? colors.primary : colors.outline}
        //                 />
        //             )
        //         },
        //         headerRight: () => <IconButton icon={'plus'} onPress={() => navigation.navigate('ClientScreen')} />
        //     })
        // },
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
        EventToPdfScreen: {
            screen: EventToPdfScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'Exportar tareas',
            },
        },
        PdfViewerScreen: {
            screen: PdfViewerScreen,
            headerStyle: {
                height: 110
            },
            options: {
                headerShown: true,
                headerTitle: 'PDF',
                headerRight: () => <HeaderShareButton />,
            },
        },
        ClientsScreen: {
            screen: ClientsScreen,
            headerStyle: {
                // height: 110,
            },
            options: ({ navigation }) => ({
                // headerTransparent: true,
                headerShown: true,
                headerShadowVisible: false,
                headerTitle: 'Clientes',
                headerStyle: {
                },
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ClientScreen')}
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

    const requestPermissionAndToken = async () => {
        try {

            const authStatus = await messaging().requestPermission();

            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                // Eliminar token anterior para forzar uno nuevo (evita tokens inválidos por cambios en APNs)
                try {
                    await messaging().deleteToken();
                } catch (delErr) {
                    console.warn('⚠️ No se pudo eliminar token anterior:', delErr);
                }

                // Obtener el FCM token nuevo
                const fcmToken = await messaging().getToken();

                // Guardar el token en Firestore
                if (user?.uid) {
                    await saveUserFCMToken(user.uid, fcmToken);
                } else {
                    console.warn("⚠️ Usuario no disponible para guardar token");
                }
            } else {
                console.warn("⚠️ Permiso de notificaciones no otorgado");
            }
        } catch (error) {
            console.error("❌ Error al obtener token FCM:", error);
        }
    };

    // Mantener el token actualizado
    useEffect(() => {
        const unsubscribe = messaging().onTokenRefresh(async (fcmToken) => {
            try {
                if (user?.uid) {
                    await saveUserFCMToken(user.uid, fcmToken);
                }
            } catch (e) {
                console.error('Error guardando token refrescado:', e);
            }
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (user)
            requestPermissionAndToken();
    }, [user]);



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
