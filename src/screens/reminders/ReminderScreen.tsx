import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, Pressable, Keyboard, Alert, TouchableOpacity } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { IReminder } from '../../interfaces/reminders'
import { saveReminder, deleteReminder } from '../../services/reminders'
import { reminderLoading, setReminder } from '../../store/slices/reminderSlice'
import CustomInputWithBottomSheet from '../../components/CustomInputWithBottomSheet'
import CustomMultipleInputWithBottomSheet from '../../components/CustomMultipleInputWithBottomSheet'
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'
import Icon from '@react-native-vector-icons/material-design-icons'

const ReminderScreen = () => {
    const eventState = useAppSelector(state => state.eventState)
    const todoState = useAppSelector(state => state.todoState)
    const authState = useAppSelector(state => state.authState)
    const reminderState = useAppSelector(state => state.reminderState)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [reminderType, setReminderType] = useState<'event' | 'todo'>('event')
    const [reminderForm, setReminderForm] = useState<IReminder>({
        id: '',
        eventId: '',
        todoId: '',
        reminderDate: new Date().toISOString(),
        userIds: [],
        createdAt: new Date().toISOString()
    })

    const [showDatePicker, setShowDatePicker] = useState(false)

    const handleDelete = async () => {
        dispatch(reminderLoading(true))
        await deleteReminder(reminderForm.id)
        dispatch(setReminder(null))
        dispatch(reminderLoading(false))
        if (!reminderState.loading) {
            navigation.goBack()
        }
    }

    const confirmDelete = () => {
        Alert.alert(
            "Eliminar recordatorio",
            "¿Estás seguro de que deseas eliminar este recordatorio?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Eliminar", style: "destructive", onPress: handleDelete }
            ]
        )
    }

    // Actualizar título del header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: reminderForm.id ? 'Modificar recordatorio' : 'Nuevo recordatorio',
            headerRight: reminderForm.id
                ? () => (
                    <TouchableOpacity
                        onPress={confirmDelete}
                        style={{
                            padding: 5,
                            borderRadius: 20,
                        }}
                    >
                        <Icon name="delete-outline" size={26} color="#000" />
                    </TouchableOpacity>
                )
                : undefined
        })
    }, [navigation, reminderForm.id])

    // Cargar recordatorio existente si viene desde la lista
    useEffect(() => {
        if (reminderState.reminder) {
            setReminderForm(reminderState.reminder)
            // Determinar el tipo basado en si tiene eventId o todoId
            if (reminderState.reminder.todoId) {
                setReminderType('todo')
            } else if (reminderState.reminder.eventId) {
                setReminderType('event')
            }
        }
        return () => {
            dispatch(setReminder(null))
        }
    }, [reminderState.reminder])

    const handleSubmit = async () => {
        // Validar que todos los campos estén completos
        if (!reminderForm.eventId && !reminderForm.todoId) {
            Alert.alert('Validación', 'Debes seleccionar un evento o una tarea')
            return
        }
        
        if (!reminderForm.reminderDate) {
            Alert.alert('Validación', 'Debes seleccionar una fecha y hora para el recordatorio')
            return
        }
        
        // Validar que haya al menos un usuario seleccionado
        if (reminderForm.userIds.length === 0) {
            Alert.alert('Validación', 'Debes seleccionar al menos un usuario a notificar')
            return
        }

        // Validar que la fecha del recordatorio sea futura
        if (new Date(reminderForm.reminderDate) <= new Date()) {
            Alert.alert('Validación', 'La fecha del recordatorio debe ser posterior a la fecha actual')
            return
        }

        try {
            dispatch(reminderLoading(true))
            await saveReminder(reminderForm)
            dispatch(reminderLoading(false))
            
            Alert.alert(
                'Éxito',
                'Recordatorio guardado correctamente. Se enviará la notificación en la fecha programada.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            )
            
            console.log('📋 Recordatorio guardado:', {
                eventId: reminderForm.eventId,
                eventName: eventState.events.find(e => e.id === reminderForm.eventId)?.name,
                reminderDate: dayjs(reminderForm.reminderDate).format('DD/MM/YYYY HH:mm'),
                userIds: reminderForm.userIds,
                users: authState.users.filter(u => reminderForm.userIds.includes(u.id)).map(u => u.name)
            })
        } catch (error) {
            console.error('Error al guardar recordatorio:', error)
            dispatch(reminderLoading(false))
            Alert.alert('Error', 'No se pudo guardar el recordatorio. Intenta de nuevo.')
        }
    }

    return (
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 15 }}>
                <TextInput
                    label='Tipo de recordatorio'
                    value={reminderType === 'event' ? 'Evento' : 'Tarea'}
                    mode='outlined'
                    disabled
                    editable={false}
                    right={<TextInput.Icon icon='format-list-bulleted-type' />}
                />

                {reminderType === 'event' ? (
                    <CustomInputWithBottomSheet
                        label='Evento'
                        placeholder='Seleccione un evento'
                        value={reminderForm.eventId || ''}
                        items={eventState.events.map(event => ({
                            label: event.name,
                            value: event.id
                        }))}
                        onPress={(value) => {
                            setReminderForm(prev => ({
                                ...prev,
                                eventId: value,
                                todoId: ''
                            }))
                        }}
                        icon='calendar-check'
                        title='Eventos'
                    />
                ) : (
                    <CustomInputWithBottomSheet
                        label='Tarea'
                        placeholder='Seleccione una tarea'
                        value={reminderForm.todoId || ''}
                        items={todoState.todos.map(todo => ({
                            label: todo.description,
                            value: todo.id
                        }))}
                        onPress={(value) => {
                            const selectedTodo = todoState.todos.find(t => t.id === value)
                            setReminderForm(prev => ({
                                ...prev,
                                todoId: value,
                                eventId: '',
                                // Pre-seleccionar el usuario asignado pero permitir cambiar
                                userIds: selectedTodo?.assignedUserId ? [selectedTodo.assignedUserId] : []
                            }))
                        }}
                        icon='checkbox-marked-circle-outline'
                        title='Tareas'
                    />
                )}

                <TextInput
                    label='Fecha y hora del recordatorio'
                    value={dayjs(reminderForm.reminderDate).format('DD/MM/YYYY HH:mm')}
                    mode='outlined'
                    editable={false}
                    right={<TextInput.Icon icon='clock-outline' onPress={() => setShowDatePicker(true)} />}
                    onPressIn={() => setShowDatePicker(true)}
                />

                <DatePicker
                    locale='ES'
                    modal
                    open={showDatePicker}
                    date={new Date(reminderForm.reminderDate)}
                    onConfirm={(date) => {
                        setShowDatePicker(false)
                        setReminderForm(prev => ({
                            ...prev,
                            reminderDate: date.toISOString()
                        }))
                    }}
                    title='Seleccione fecha y hora del recordatorio'
                    confirmText='Confirmar'
                    cancelText='Cancelar'
                    onCancel={() => setShowDatePicker(false)}
                />

                {reminderType === 'event' && (
                    <CustomMultipleInputWithBottomSheet
                        label='Usuarios a notificar'
                        placeholder='Seleccione usuarios'
                        value={(() => {
                            // Calcular qué mostrar en el input
                            if (reminderForm.userIds.length === 0) return []
                            const allUserIds = authState.users.map(u => u.id)
                            const allSelected = reminderForm.userIds.length === allUserIds.length && 
                                              allUserIds.every(id => reminderForm.userIds.includes(id))
                            // Si todos están seleccionados, retornar solo 'all' para mostrar "Todos los usuarios"
                            if (allSelected) return ['all']
                            return reminderForm.userIds
                        })()}
                        items={[
                            { label: 'Todos los usuarios', value: 'all' },
                            ...authState.users.map(user => ({
                                label: user.name,
                                value: user.id
                            }))
                        ]}
                        onPress={(value) => {
                            if (value === 'all') {
                                // Si selecciona "Todos", agregar todos los IDs de usuarios
                                const allUserIds = authState.users.map(u => u.id)
                                const allSelected = reminderForm.userIds.length === allUserIds.length && 
                                                   allUserIds.every(id => reminderForm.userIds.includes(id))
                                
                                setReminderForm(prev => ({
                                    ...prev,
                                    userIds: allSelected ? [] : allUserIds
                                }))
                            } else {
                                const selectedUsers = [...reminderForm.userIds]
                                if (selectedUsers.includes(value)) {
                                    selectedUsers.splice(selectedUsers.indexOf(value), 1)
                                } else {
                                    selectedUsers.push(value)
                                }
                                setReminderForm(prev => ({
                                    ...prev,
                                    userIds: selectedUsers
                                }))
                            }
                        }}
                        icon='account-multiple'
                        title='Usuarios'
                    />
                )}

                {reminderType === 'todo' && (
                    <CustomInputWithBottomSheet
                        label='Usuario a notificar'
                        placeholder='Seleccione un usuario'
                        value={reminderForm.userIds[0] || ''}
                        items={authState.users.map(user => ({
                            label: user.name,
                            value: user.id
                        }))}
                        onPress={(value) => {
                            setReminderForm(prev => ({
                                ...prev,
                                userIds: [value]
                            }))
                        }}
                        icon='account'
                        title='Usuario'
                    />
                )}

                <Button 
                    style={{ marginTop: 'auto', paddingVertical: 5 }} 
                    mode='contained' 
                    onPress={handleSubmit}
                    loading={reminderState.loading}
                >
                    <Text style={{ fontWeight: 'bold', color: 'white' }}>
                        Guardar Recordatorio
                    </Text>
                </Button>
            </View>
        </Pressable>
    )
}

export default ReminderScreen