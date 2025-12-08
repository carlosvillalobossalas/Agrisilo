import React, { useState } from 'react'
import { View, Pressable, Keyboard } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import { useAppSelector } from '../../store'
import { IReminder } from '../../interfaces/reminders'
import CustomInputWithBottomSheet from '../../components/CustomInputWithBottomSheet'
import CustomMultipleInputWithBottomSheet from '../../components/CustomMultipleInputWithBottomSheet'
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'

const ReminderScreen = () => {
    const eventState = useAppSelector(state => state.eventState)
    const authState = useAppSelector(state => state.authState)

    const [reminderForm, setReminderForm] = useState<IReminder>({
        id: '',
        eventId: '',
        reminderDate: new Date().toISOString(),
        userIds: [],
        createdAt: new Date().toISOString()
    })

    const [showDatePicker, setShowDatePicker] = useState(false)

    const handleSubmit = () => {
        console.log('📋 Datos del recordatorio:', {
            eventId: reminderForm.eventId,
            eventName: eventState.events.find(e => e.id === reminderForm.eventId)?.name,
            reminderDate: dayjs(reminderForm.reminderDate).format('DD/MM/YYYY HH:mm'),
            userIds: reminderForm.userIds,
            users: authState.users.filter(u => reminderForm.userIds.includes(u.id)).map(u => u.name)
        })
    }

    return (
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1, paddingTop: 10, paddingBottom: 15, paddingHorizontal: 15, gap: 15 }}>
                <CustomInputWithBottomSheet
                    label='Evento'
                    placeholder='Seleccione un evento'
                    value={reminderForm.eventId}
                    items={eventState.events.map(event => ({
                        label: event.name,
                        value: event.id
                    }))}
                    onPress={(value) => {
                        setReminderForm(prev => ({
                            ...prev,
                            eventId: value
                        }))
                    }}
                    icon='calendar-check'
                    title='Eventos'
                />

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

                <Button 
                    style={{ marginTop: 'auto', paddingVertical: 5 }} 
                    mode='contained' 
                    onPress={handleSubmit}
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