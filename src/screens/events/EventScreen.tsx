import { Alert, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { IEvent } from '../../interfaces/events'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { Button, Text, TextInput } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'
import { eventLoading, setEvent } from '../../store/slices/eventSlice'
import { deleteEvent, saveEvent } from '../../services/events'
import { useNavigation } from '@react-navigation/native'
import Icon from '@react-native-vector-icons/material-design-icons';

const EventScreen = () => {
    const eventState = useAppSelector(state => state.eventState)
    const clientState = useAppSelector(state => state.clientState)
    const statusState = useAppSelector(state => state.statusState)
    const servicesState = useAppSelector(state => state.serviceState)

    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [eventForm, setEventForm] = useState<IEvent>({
        id: '',
        client: '',
        endDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
        name: '',
        services: [],
        status: ''
    })
    const [dropdownsForm, setDropdownsForm] = useState({
        openClient: false,
        openStatus: false,
        openService: false
    })

    const [modalsForm, setModalsForm] = useState({
        startDate: false,
        endDate: false
    })


    const handleSubmit = async () => {
        console.log(eventForm)
        dispatch(eventLoading(true))
        await saveEvent(eventForm)
        dispatch(eventLoading(false))

        if (!statusState.loading) {
            navigation.goBack()
        }
    }

    const handleDelete = async () => {
        dispatch(eventLoading(true))
        await deleteEvent(eventForm.id)
        dispatch(setEvent(null))
        dispatch(eventLoading(false))
        if (!statusState.loading) {
            navigation.goBack()
        }
    }

    const confirmDelete = () => {
        Alert.alert(
            "Eliminar tarea",
            "¿Estás seguro de que deseas eliminar esta tarea?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: handleDelete }
            ]
        );
    };



    useEffect(() => {
        if (eventState.event) {
            setEventForm(eventState.event)
        }
        return () => {
            dispatch(setEvent(null))
        }
    }, [eventState.event])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: eventForm.id ? 'Modificar tarea' : 'Nueva tarea',
            headerRight: eventForm.id
                ? () => (
                    <TouchableOpacity
                        onPress={confirmDelete}
                        style={{
                            backgroundColor: 'rgba(229, 211, 211, 0.25)',
                            padding: 5,
                            borderRadius: 20,
                        }}
                    >
                        <Icon name="delete-outline" size={26} color="#000" />
                    </TouchableOpacity>
                )
                : undefined
        })
    }, [navigation, eventForm.id])


    return (
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 15 }}>
            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
                <TextInput
                    value={eventForm.name}
                    onChangeText={(text) => setEventForm({ ...eventForm, name: text })}
                    placeholder='Ingrese el nombre del evento'
                    mode='outlined'
                    right={<TextInput.Icon icon={'account-outline'} />}
                />
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Cliente</Text>

                <DropDownPicker
                    language='ES'
                    open={dropdownsForm.openClient}
                    setOpen={(value) => {
                        const opened = value as unknown as boolean

                        setDropdownsForm({
                            openClient: opened,
                            openService: false,
                            openStatus: false
                        })
                    }}
                    value={eventForm.client}
                    items={clientState.clients.map(client => {
                        return { label: client.name, value: client.id }
                    })}
                    placeholder='Seleccione un cliente'
                    setValue={(value) => {
                        setEventForm(prev => ({
                            ...prev,
                            client: value(prev.client)
                        }))
                    }}
                    zIndex={3000}
                    zIndexInverse={1000}
                    closeAfterSelecting={true}
                />
            </View>
            <View style={{ gap: 5 }}>

                <Text style={{ fontWeight: 'bold' }}>Servicios</Text>
                <DropDownPicker
                    language='ES'
                    open={dropdownsForm.openService}
                    setOpen={(value) => {
                        const opened = value as unknown as boolean
                        setDropdownsForm({
                            openService: opened,
                            openClient: false,
                            openStatus: false,
                        })
                    }}
                    multiple
                    value={eventForm.services}
                    items={servicesState.services.map(service => {
                        return { label: service.name, value: service.id }
                    })}
                    placeholder='Seleccione servicios'
                    setValue={(cb) => setEventForm(prev => ({
                        ...prev,
                        services: cb(prev.services)
                    }))}
                    zIndex={2000}
                    zIndexInverse={2000}
                />
            </View>
            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Estado</Text>
                <DropDownPicker
                    language='ES'
                    open={dropdownsForm.openStatus}
                    setOpen={(value) => {
                        const opened = value as unknown as boolean

                        setDropdownsForm({
                            openStatus: opened,
                            openService: false,
                            openClient: false
                        })
                    }}
                    value={eventForm.status}
                    items={statusState.statuses.map(status => {
                        return { label: status.name, value: status.id }
                    })}
                    placeholder='Seleccione un estado'
                    setValue={(value) => {
                        setEventForm(prev => ({
                            ...prev,
                            status: value(prev.status)
                        }))
                    }}
                    zIndex={1000}
                    zIndexInverse={3000}
                    closeAfterSelecting={true}
                />
            </View>
            <TextInput
                label='Fecha de inicio'
                value={dayjs(eventForm.startDate).format('DD/MM/YYYY HH:mm')}
                mode='outlined'
                editable={false}
                right={<TextInput.Icon icon='calendar' onPress={() => setModalsForm({ startDate: true, endDate: false })} />}
                onPressIn={() => setModalsForm({ startDate: true, endDate: false })}
            />
            <DatePicker
                locale='ES'
                modal
                open={modalsForm.startDate}
                date={new Date(eventForm.startDate)}
                onConfirm={(date) => {
                    setModalsForm({
                        startDate: false,
                        endDate: false
                    })
                    setEventForm(prev => ({
                        ...prev,
                        startDate: date.toISOString()
                    }))
                }}
                title={'Seleccione fecha de inicio'}
                confirmText='Confirmar'
                cancelText='Cancelar'
                onCancel={() => {
                    setModalsForm({
                        startDate: false,
                        endDate: false
                    })
                }}
            />
            <TextInput
                label='Fecha de fin'
                value={dayjs(eventForm.endDate).format('DD/MM/YYYY HH:mm')}
                mode='outlined'
                editable={false}
                right={<TextInput.Icon icon='calendar' onPress={() => setModalsForm({ startDate: false, endDate: true })} />}
                onPressIn={() => setModalsForm({ startDate: false, endDate: true })}
            />
            <DatePicker
                locale='ES'
                modal
                open={modalsForm.endDate}
                date={new Date(eventForm.endDate)}
                onConfirm={(date) => {
                    setModalsForm({
                        startDate: false,
                        endDate: false
                    })
                    setEventForm(prev => ({
                        ...prev,
                        endDate: date.toISOString()
                    }))
                }}
                title={'Seleccione fecha de fin'}
                confirmText='Confirmar'
                cancelText='Cancelar'
                onCancel={() => {
                    setModalsForm({
                        startDate: false,
                        endDate: false
                    })
                }}
            />

            <Button style={{ marginTop: 'auto', paddingVertical: 5 }} mode='contained' onPress={handleSubmit} loading={eventState.loading}>
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Guardar Evento</Text>
            </Button>
        </View>
    )
}

export default EventScreen