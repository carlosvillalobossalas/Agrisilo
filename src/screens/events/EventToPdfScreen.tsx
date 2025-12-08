import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import CustomMultipleInputWithBottomSheet from '../../components/CustomMultipleInputWithBottomSheet'
import { useAppSelector } from '../../store'
import { Button, TextInput } from 'react-native-paper'
import dayjs from 'dayjs'
import DatePicker from 'react-native-date-picker'
import { exportTablePDF, getFilteredEvents } from '../../services/events'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { setPDFPath } from '../../store/slices/eventSlice'

interface EventForm {
    clients: string[]
    services: string[]
    statuses: string[]
    startDate: string
    endDate: string

}

const EventToPdfScreen = () => {

    const navigation = useNavigation()

    const clientState = useAppSelector(state => state.clientState)
    const servicesState = useAppSelector(state => state.serviceState)
    const statusState = useAppSelector(state => state.statusState)
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [eventForm, setEventForm] = useState<EventForm>({
        clients: [],
        services: [],
        statuses: [],
        endDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
    })

    const [modalsForm, setModalsForm] = useState({
        startDate: false,
        endDate: false
    })

    const handleSubmit = async () => {
        // If user didn't open/select filters, treat empty arrays as "all"
        const clientsToFilter = eventForm.clients && eventForm.clients.length > 0
            ? eventForm.clients
            : clientState.clients.map(c => c.id);

        const servicesToFilter = eventForm.services && eventForm.services.length > 0
            ? eventForm.services
            : servicesState.services.map(s => s.id);

        const statusesToFilter = eventForm.statuses && eventForm.statuses.length > 0
            ? eventForm.statuses
            : statusState.statuses.map(s => s.id);

        const normalizedForm: EventForm = {
            ...eventForm,
            clients: clientsToFilter,
            services: servicesToFilter,
            statuses: statusesToFilter,
        }

        console.log('Normalized filter form:', normalizedForm)

        const events = await getFilteredEvents(normalizedForm)
        console.log(events)

        const eventsMapped = events.map(ev => {
            const client = clientState.clients.find(client => client.id === ev.client)
            return {
                client: client?.name || 'Desconocido',
                area: ev?.area.toString() || 'Desconocido',
                location: ev?.location || 'Desconocido',
                service: ev.services.map(srvId => servicesState.services.find(srv => srv.id === srvId)?.name || 'Desconocido').join(', '),
                status: statusState.statuses.find(status => status.id === ev.status)?.name || 'Desconocido',
                startDate: dayjs(ev.startDate).format('DD/MM/YYYY HH:mm'),
                endDate: dayjs(ev.endDate).format('DD/MM/YYYY HH:mm'),
                name: ev.name
            }
        })

        // Si no hay eventos, mostrar alerta y permanecer en la vista actual
        if (!eventsMapped || eventsMapped.length === 0) {
            Alert.alert('Sin eventos', 'No hay eventos para exportar en el rango y filtros seleccionados.');
            return;
        }

        const file = await exportTablePDF(eventsMapped)
        dispatch(setPDFPath(file))

        navigation.navigate('PdfViewerScreen')
    }

    return (
        <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 15 }}>

            <View style={{ gap: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Cliente(s)</Text>
                <CustomMultipleInputWithBottomSheet
                    placeholder='Seleccione clientes'
                    value={eventForm.clients}
                    items={
                        [
                            { label: 'Todos', value: 'all' },
                            ...clientState.clients.map(client => {
                                return { label: client.name, value: client.id }
                            })
                        ]
                    }
                    onPress={(value) => {
                        const selectedClients = [...eventForm.clients]
                        if (value === 'all' && !selectedClients.includes('all')) {
                            setEventForm(prev => ({
                                ...prev,
                                clients: clientState.clients.map(client => client.id)
                            }))
                            return
                        }

                        if (selectedClients.includes(value)) {
                            selectedClients.splice(selectedClients.indexOf(value), 1)
                        } else {
                            selectedClients.push(value)
                        }
                        setEventForm(prev => ({
                            ...prev,
                            clients: selectedClients
                        }))
                    }}
                    icon='account-group-outline'
                    title='Clientes'
                    key={'clients'}
                />
            </View>

            <View style={{ gap: 5 }}>

                <Text style={{ fontWeight: 'bold' }}>Servicios</Text>

                <CustomMultipleInputWithBottomSheet
                    placeholder='Seleccione servicios'
                    value={eventForm.services}
                    items={
                        [
                            { label: 'Todos', value: 'all' }, ...servicesState.services.map(service => {
                                return { label: service.name, value: service.id }
                            })]
                    }
                    onPress={(value) => {
                        const selectedServices = [...eventForm.services]

                        if (value === 'all' && !selectedServices.includes('all')) {
                            setEventForm(prev => ({
                                ...prev,
                                services: servicesState.services.map(service => service.id)
                            }))
                            return
                        }

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

            <View style={{ gap: 5 }}>

                <Text style={{ fontWeight: 'bold' }}>Estados</Text>

                <CustomMultipleInputWithBottomSheet
                    placeholder='Seleccione estados'
                    value={eventForm.statuses}
                    items={
                        [
                            { label: 'Todos', value: 'all' }, ...statusState.statuses.map(status => {
                                return { label: status.name, value: status.id }
                            })]
                    }
                    onPress={(value) => {
                        const selectedStatuses = [...eventForm.statuses]

                        if (value === 'all' && !selectedStatuses.includes('all')) {
                            setEventForm(prev => ({
                                ...prev,
                                statuses: statusState.statuses.map(status => status.id)
                            }))
                            return
                        }

                        if (selectedStatuses.includes(value)) {
                            selectedStatuses.splice(selectedStatuses.indexOf(value), 1)
                        } else {
                            selectedStatuses.push(value)
                        }
                        setEventForm(prev => ({
                            ...prev,
                            statuses: selectedStatuses
                        }))
                    }}
                    icon='account-wrench-outline'
                    title='Estados'
                    key={'statuses'}
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

            <Button style={{ marginTop: 'auto', paddingVertical: 5 }} mode='contained' onPress={handleSubmit} loading={isLoading}>
                <Text style={{ fontWeight: 'bold', color: 'white' }}>Exportar eventos</Text>
            </Button>
        </View>
    )
}

export default EventToPdfScreen