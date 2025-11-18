import React, { useEffect, useState } from 'react'
import { Button, Chip, Divider, Icon, IconButton, Portal, Text } from 'react-native-paper'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppSelector } from '../store';
import { View } from 'react-native';
import { Service } from '../interfaces/services';
import { Status } from '../interfaces/status';
import { Client } from '../interfaces/client';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { eventLoading } from '../store/slices/eventSlice';
import { deleteEvent } from '../services/events';


interface CustomBottomEventDetails {
    ref: React.RefObject<BottomSheetModal | null>,
}

interface Event {
    id: string
    name: string
    services: Service[]
    startDate: string
    endDate: string
    status: Status
    client: Client
}


const getContrastingTextColor = (hexColor: string) => {
    if (!hexColor) return "#000"; // fallback

    // Quita el #
    const c = hexColor.replace("#", "");

    // Convierte a RGB
    const r = parseInt(c.substr(0, 2), 16);
    const g = parseInt(c.substr(2, 2), 16);
    const b = parseInt(c.substr(4, 2), 16);

    // Luminancia (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#FFFFFF";
};


const CustomBottomEventDetails = ({ ref }: CustomBottomEventDetails) => {

    const eventState = useAppSelector(state => state.eventState)
    const serviceState = useAppSelector(state => state.serviceState)
    const statusState = useAppSelector(state => state.statusState)
    const clientState = useAppSelector(state => state.clientState)
    const dispatch = useDispatch()

    const navigation = useNavigation()


    const [event, setEvent] = useState<Event | null>(null)

    const insets = useSafeAreaInsets();

    const handleDeleteEvent = async () => {
        try {
            dispatch(eventLoading(false))
            await deleteEvent(event!.id)
            dispatch(eventLoading(true))
            setEvent(null)
            ref.current?.close()

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (eventState.event === null) return
        const details: Event = {
            ...eventState.event,
            services: serviceState.services.filter(service => eventState.event!.services.includes(service.id)),
            status: statusState.statuses.find(status => status.id === eventState.event!.status)!,
            client: clientState.clients.find(client => client.id === eventState.event!.client)!

        }
        setEvent(details)

        return () => {
            setEvent(null)
        }
    }, [eventState.event])


    return (
        <Portal>
            <BottomSheetModal
                ref={ref}
                index={1}
                snapPoints={['100%']}
                enablePanDownToClose={true}
                backgroundStyle={{
                    backgroundColor: '#f6f5f5ff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}
                handleStyle={{
                    marginTop: insets.top,
                }}
            >
                <BottomSheetView
                    style={{
                        flex: 1,
                        padding: 24,
                        height: '100%'
                    }}>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                            marginBottom: 15,
                        }}
                    >
                        {/* Botón invisible para balancear */}
                        <IconButton icon="close-circle-outline" size={28} style={{ opacity: 0 }} />

                        {/* Título centrado */}
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                            Detalles de la tarea
                        </Text>

                        {/* Botón real */}
                        <IconButton icon="close-circle-outline" size={28} onPress={() => ref.current?.close()} />
                    </View>

                    <View style={{
                        backgroundColor: 'white',
                        width: '100%',
                        minHeight: 200,
                        padding: 20,
                        borderRadius: 20,
                        // ANDROID
                        elevation: 5,

                        // iOS
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.2,
                        shadowRadius: 6,

                    }}>
                        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{event?.name}</Text>
                        <View style={{ alignItems: 'flex-start', marginTop: 10 }}>
                            <Chip style={{ backgroundColor: event?.status.color, }} >
                                <Text style={{ color: getContrastingTextColor(event?.status.color!), fontWeight: 'bold' }}>
                                    {event?.status.name}
                                </Text>
                            </Chip>
                        </View>

                        <View style={{ marginTop: 30, gap: 5 }}>
                            {
                                event?.services.map((service) => (
                                    <View
                                        key={service.id}
                                        style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                                        <Icon source={'account-wrench-outline'} size={32} />
                                        <View>
                                            <Text style={{ fontWeight: '200', fontSize: 16 }}>Servicio</Text>
                                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{service.name}</Text>
                                        </View>
                                    </View>
                                ))
                            }
                        </View>


                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 30 }}>
                            <Icon source={'account-group-outline'} size={32} />
                            <View>
                                <Text style={{ fontWeight: '200', fontSize: 16 }}>Cliente</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{event?.client.name}</Text>
                            </View>

                        </View>

                        <Divider style={{ marginTop: 25 }} />

                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 30 }}>
                            <Icon source={'calendar-badge-outline'} size={32} />
                            <View>
                                <Text style={{ fontWeight: '200', fontSize: 16 }}>Fecha de inicio</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{dayjs(event?.startDate).format("HH:mm DD/MM/YYYY")}</Text>
                            </View>

                        </View>

                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginTop: 30 }}>
                            <Icon source={'calendar-check-outline'} size={32} />
                            <View>
                                <Text style={{ fontWeight: '200', fontSize: 16 }}>Fecha de fin</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{dayjs(event?.endDate).format("HH:mm DD/MM/YYYY")}</Text>
                            </View>

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 'auto' }}>
                        <Button
                            mode='text'
                            onPress={handleDeleteEvent}
                            loading={eventState.loading}
                            icon={() => (
                                <Icon source={'delete'} size={22} color={'red'} />
                            )}
                        >
                            <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 15 }}>Eliminar</Text>
                        </Button>
                        <Button
                            mode='contained'
                            buttonColor='green'
                            onPress={() => {
                                navigation.navigate('EventScreen')
                                ref.current?.close()

                            }}
                            icon={() => (
                                <Icon source={'pencil-outline'} size={22} color={'white'} />
                            )}>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 15 }}>Editar</Text>
                        </Button>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </Portal >
    )
}

export default CustomBottomEventDetails