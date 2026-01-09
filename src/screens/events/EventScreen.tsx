import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Alert, TouchableOpacity, View, DeviceEventEmitter, Pressable, Keyboard } from 'react-native'
import { Button, Text, TextInput, IconButton } from 'react-native-paper'
import { deleteEvent, saveEvent } from '../../services/events'
import { eventLoading, setEvent } from '../../store/slices/eventSlice'
import { IEvent } from '../../interfaces/events'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import CustomInputWithBottomSheet from '../../components/CustomInputWithBottomSheet'
import CustomMultipleInputWithBottomSheet from '../../components/CustomMultipleInputWithBottomSheet'
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'
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
        status: '',
        area: 0,
        location: '',
    })

    const [modalsForm, setModalsForm] = useState({
        startDate: false,
        endDate: false
    })


    const handleSubmit = async () => {
        console.log('Guardando evento:', eventForm)

        // Validar que los campos requeridos estén completos
        if (!eventForm.name.trim()) {
            Alert.alert('Validación', 'El nombre del evento es requerido');
            return;
        }
        if (!eventForm.client) {
            Alert.alert('Validación', 'Debes seleccionar un cliente');
            return;
        }
        if (!eventForm.status) {
            Alert.alert('Validación', 'Debes seleccionar un estado');
            return;
        }
        // Sanear referencias: eliminar servicios inexistentes; si client/status no existen, limpiarlos
        const validServices = (eventForm.services || []).filter(sid => servicesState.services.some(s => s.id === sid))

        const clientExists = clientState.clients.some(c => c.id === eventForm.client)
        const sanitizedClient = clientExists ? eventForm.client : ''

        const statusExists = statusState.statuses.some(s => s.id === eventForm.status)
        const sanitizedStatus = statusExists ? eventForm.status : ''
        if (new Date(eventForm.endDate) <= new Date(eventForm.startDate)) {
            Alert.alert('Validación', 'La fecha de fin debe ser posterior a la fecha de inicio');
            return;
        }

        try {
            dispatch(eventLoading(true))
            const payload: IEvent = { ...eventForm, services: validServices, client: sanitizedClient, status: sanitizedStatus }
            await saveEvent(payload)
            console.log('Evento guardado exitosamente. Notificaciones será enviadas por Cloud Function.')
            dispatch(eventLoading(false))

            if (!statusState.loading) {
                navigation.goBack()
            }
        } catch (error) {
            console.error('Error al guardar evento:', error)
            dispatch(eventLoading(false))
            Alert.alert('Error', 'No se pudo guardar el evento. Intenta de nuevo.')
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
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 15 }}>
                <TextInput
                    label='Nombre'
                    value={eventForm.name}
                    onChangeText={(text) => setEventForm({ ...eventForm, name: text })}
                    placeholder='Ingrese el nombre del evento'
                    mode='outlined'
                    right={<TextInput.Icon icon={'account-outline'} />}
                    onFocus={() => { DeviceEventEmitter.emit('dismissSheets'); setModalsForm({ startDate: false, endDate: false }) }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flex: 1 }}>
                        <CustomInputWithBottomSheet
                            placeholder='Seleccione un cliente'
                            label='Cliente'
                            value={eventForm.client}
                            items={clientState.clients.map(client => {
                                return { label: client.name, value: client.id }
                            })}
                            onPress={(value) => {
                                setEventForm(prev => ({
                                    ...prev,
                                    client: value
                                }))
                            }}
                            icon='account-group-outline'
                            title='Clientes'
                            key={'client'}
                        />
                    </View>
                    <IconButton icon='plus' mode='contained' onPress={() => navigation.navigate('ClientScreen')} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flex: 1 }}>
                        <CustomMultipleInputWithBottomSheet
                            placeholder='Seleccione servicios'
                            label='Servicios'
                            value={eventForm.services}
                            items={servicesState.services.map(service => {
                                return { label: service.name, value: service.id }
                            })}
                            onPress={(value) => {
                                const selectedServices = [...eventForm.services]
                                if (selectedServices.includes(value)) {
                                    selectedServices.splice(selectedServices.indexOf(value), 1)
                                } else {
                                    selectedServices.push(value)
                                }
                                setEventForm(prev => ({
                                    ...prev,
                                    services: selectedServices
                                }))
                            }}
                            icon='account-wrench-outline'
                            title='Servicios'
                            key={'service'}
                        />
                    </View>
                    <IconButton icon='plus' mode='contained' onPress={() => navigation.navigate('ServiceScreen')} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ flex: 1 }}>
                        <CustomInputWithBottomSheet
                            placeholder='Seleccione un estado'
                            value={eventForm.status}
                            label='Estado'
                            items={statusState.statuses.map(status => {
                                return { label: status.name, value: status.id }
                            })}
                            onPress={(value) => {
                                setEventForm(prev => ({
                                    ...prev,
                                    status: value
                                }))
                            }}
                            icon='check'
                            title='Estados'
                            key={'status'}
                        />
                    </View>
                    <IconButton icon='plus' mode='contained' onPress={() => navigation.navigate('StatusScreen')} />
                </View>
                <TextInput
                    label='Area (hectáreas)'
                    value={eventForm.area === 0 ? '' : eventForm.area.toString()}
                    onChangeText={(text) => {
                        if (text === '') {
                            setEventForm({ ...eventForm, area: 0 })
                        } else {
                            const parsed = parseFloat(text)
                            if (!isNaN(parsed) && isFinite(parsed)) {
                                setEventForm({ ...eventForm, area: parsed })
                            }
                        }
                    }}
                    inputMode='numeric'
                    placeholder='0'
                    mode='outlined'
                    right={<TextInput.Icon icon={'terrain'} />}
                />
                <TextInput
                    label='Ubicación del terreno'
                    value={eventForm.location}
                    onChangeText={(text) => setEventForm({ ...eventForm, location: text })}
                    placeholder='Ingrese la ubicación del terreno'
                    mode='outlined'
                    right={<TextInput.Icon icon={'map-marker-outline'} />}
                />
                <TextInput
                    label='Fecha de inicio'
                    value={dayjs(eventForm.startDate).format('DD/MM/YYYY')}
                    mode='outlined'
                    editable={false}
                    right={<TextInput.Icon icon='calendar' onPress={() => setModalsForm({ startDate: true, endDate: false })} />}
                    onPressIn={() => setModalsForm({ startDate: true, endDate: false })}
                />
                <DatePicker
                    locale='ES'
                    mode='date'
                    modal
                    open={modalsForm.startDate}
                    date={new Date(eventForm.startDate)}
                    onConfirm={(date) => {
                        setModalsForm({
                            startDate: false,
                            endDate: false
                        })
                        // Establecer la hora a las 00:00:00 (primera hora del día)
                        const startOfDay = new Date(date)
                        startOfDay.setHours(0, 0, 0, 0)
                        setEventForm(prev => ({
                            ...prev,
                            startDate: startOfDay.toISOString()
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
                    value={dayjs(eventForm.endDate).format('DD/MM/YYYY')}
                    mode='outlined'
                    editable={false}
                    right={<TextInput.Icon icon='calendar' onPress={() => setModalsForm({ startDate: false, endDate: true })} />}
                    onPressIn={() => setModalsForm({ startDate: false, endDate: true })}
                />
                <DatePicker
                    locale='ES'
                    modal
                    mode='date'
                    open={modalsForm.endDate}
                    date={new Date(eventForm.endDate)}
                    onConfirm={(date) => {
                        setModalsForm({
                            startDate: false,
                            endDate: false
                        })
                        // Establecer la hora a las 23:59:59 (última hora del día)
                        const endOfDay = new Date(date)
                        endOfDay.setHours(23, 59, 59, 999)
                        setEventForm(prev => ({
                            ...prev,
                            endDate: endOfDay.toISOString()
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
        </Pressable>
    )
}

export default EventScreen