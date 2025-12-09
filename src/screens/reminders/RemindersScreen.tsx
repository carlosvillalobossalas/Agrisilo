import { View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, Chip } from 'react-native-paper'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { setReminder, setAllReminders } from '../../store/slices/reminderSlice'
import { getReminders } from '../../services/reminders'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import dayjs from 'dayjs'

const RemindersScreen = () => {
    const reminderState = useAppSelector(state => state.reminderState)
    const eventState = useAppSelector(state => state.eventState)
    const authState = useAppSelector(state => state.authState)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [filterValue, setFilterValue] = useState('')

    useEffect(() => {
        const unsubscribe = getReminders().onSnapshot((snapshot) => {
            const reminders = snapshot.docs.map((doc) => {
                const data = doc.data()
                return {
                    id: doc.id,
                    eventId: data.eventId,
                    reminderDate: data.reminderDate?.toDate?.() ? data.reminderDate.toDate().toISOString() : new Date(data.reminderDate).toISOString(),
                    userIds: data.userIds ?? [],
                    createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString(),
                    sent: data.sent ?? false
                }
            })
            dispatch(setAllReminders(reminders))
        })
        return () => unsubscribe()
    }, [dispatch])

    return (
        <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 25 }}>
            <TextInput
                mode='flat'
                left={<TextInput.Icon icon={'magnify'} />}
                label={'Buscar por evento'}
                value={filterValue}
                onChangeText={(text) => setFilterValue(text)}
                style={{
                    marginBottom: 10,
                    backgroundColor: 'white',
                    paddingVertical: 5,
                    borderRadius: 10
                }}
            />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10 }} showsVerticalScrollIndicator={false}>
                {
                    reminderState.reminders
                    .filter(reminder => {
                        if (filterValue === '') return true
                        const event = eventState.events.find(e => e.id === reminder.eventId)
                        return event?.name.toLowerCase().includes(filterValue.toLowerCase())
                    })
                    .map((reminder) => {
                        const event = eventState.events.find(e => e.id === reminder.eventId)
                        const eventName = event?.name ?? 'Evento no encontrado'
                        const userCount = reminder.userIds.length
                        const isPast = new Date(reminder.reminderDate) < new Date()
                        const isSent = reminder.sent

                        return (
                            <View
                                key={reminder.id}
                                style={{
                                    opacity: isSent ? 0.6 : 1,
                                    backgroundColor: isSent ? '#f5f5f5' : 'transparent',
                                    borderRadius: 10,
                                    marginBottom: 8
                                }}
                            >
                                <CustomButtonWithIconRight
                                    label={eventName}
                                    onPress={isSent ? undefined : () => {
                                        dispatch(setReminder(reminder))
                                        navigation.navigate('ReminderScreen')
                                    }}
                                    icon='chevron-right'
                                    labelStyle={{ fontWeight: 'bold' }}
                                    contentStyle={{ height: 90 }}
                                    style={{ height: 90 }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <Text style={{ fontSize: 12, color: '#666' }}>
                                            📅 {dayjs(reminder.reminderDate).format('DD/MM/YYYY HH:mm')}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#666' }}>
                                            👥 {userCount} {userCount === 1 ? 'usuario' : 'usuarios'}
                                        </Text>
                                        {isSent && (
                                            <Chip
                                                mode='flat'
                                                style={{ backgroundColor: '#4CAF50', height: 34 }}
                                            >
                                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Enviado</Text>
                                            </Chip>
                                        )}
                                        {!isSent && isPast && (
                                            <Chip
                                                mode='flat'
                                                style={{ backgroundColor: '#FF9800', height: 34 }}
                                            >
                                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Pendiente</Text>
                                            </Chip>
                                        )}
                                        {!isSent && !isPast && (
                                            <Chip
                                                mode='flat'
                                                style={{ backgroundColor: '#2196F3', height: 34 }}
                                            >
                                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Programado</Text>
                                            </Chip>
                                        )}
                                    </View>
                                </CustomButtonWithIconRight>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

export default RemindersScreen