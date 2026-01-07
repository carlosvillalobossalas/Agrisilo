import { View, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Text, TextInput, Chip, IconButton } from 'react-native-paper'
import { useAppSelector } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { setReminder } from '../../store/slices/reminderSlice'
import CustomButtonWithIconRight from '../../components/CustomButtonWithIconRight'
import dayjs from 'dayjs'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { deleteReminder } from '../../services/reminders'

const RemindersScreen = () => {
    const reminderState = useAppSelector(state => state.reminderState)
    const eventState = useAppSelector(state => state.eventState)
    const todoState = useAppSelector(state => state.todoState)
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [filterValue, setFilterValue] = useState('')

    return (
        <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 25 }}>
            <TextInput
                mode='flat'
                left={<TextInput.Icon icon={'magnify'} />}
                label={'Buscar recordatorio'}
                value={filterValue}
                onChangeText={(text) => setFilterValue(text)}
                style={{
                    marginBottom: 10,
                    backgroundColor: 'white',
                    paddingVertical: 5,
                    borderRadius: 10,
                    zIndex: 0
                }}
            />
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 10 }} showsVerticalScrollIndicator={false}>
                {
                    reminderState?.reminders
                        ?.filter(reminder => {
                            if (filterValue === '') return true
                            const event = eventState.events.find(e => e.id === reminder.eventId)
                            const todo = todoState.todos.find(t => t.id === reminder.todoId)
                            const searchName = event?.name || todo?.description || ''
                            return searchName.toLowerCase().includes(filterValue.toLowerCase())
                        })
                        .map((reminder) => {
                            const event = eventState.events.find(e => e.id === reminder.eventId)
                            const todo = todoState.todos.find(t => t.id === reminder.todoId)

                            // Obtener el nombre y truncarlo si es necesario
                            let itemName = 'No encontrado'
                            if (event) {
                                itemName = event.name
                            } else if (todo) {
                                // Truncar descripción del todo a 40 caracteres
                                itemName = todo.description.length > 40
                                    ? todo.description.substring(0, 40) + '...'
                                    : todo.description
                            }

                            const itemType = event ? '📅' : '✓'
                            const userCount = reminder.userIds.length
                            const isPast = new Date(reminder.reminderDate) < new Date()
                            const isSent = reminder.sent

                            const ReminderItem = () => {
                                const translateX = useSharedValue(0)
                                const SWIPE_THRESHOLD = -100

                                const handleDeleteConfirmation = () => {
                                    Alert.alert(
                                        'Eliminar recordatorio',
                                        '¿Estás seguro de que deseas eliminar este recordatorio?',
                                        [
                                            {
                                                text: 'Cancelar', style: 'cancel', onPress: () => {
                                                    translateX.value = withSpring(0)
                                                }
                                            },
                                            {
                                                text: 'Eliminar', style: 'destructive', onPress: async () => {
                                                    await deleteReminder(reminder.id)
                                                }
                                            }
                                        ]
                                    )
                                }

                                const panGesture = Gesture.Pan()
                                    .onUpdate((e) => {
                                        if (e.translationX < 0) {
                                            translateX.value = e.translationX
                                        }
                                    })
                                    .onEnd(() => {
                                        'worklet'
                                        if (translateX.value < SWIPE_THRESHOLD) {
                                            runOnJS(handleDeleteConfirmation)()
                                        } else {
                                            translateX.value = withSpring(0)
                                        }
                                    })

                                const animatedStyle = useAnimatedStyle(() => ({
                                    transform: [{ translateX: translateX.value }]
                                }))

                                return (
                                    <View key={reminder.id} style={{ position: 'relative', marginBottom: 8 }}>
                                        {/* Fondo rojo que aparece al deslizar */}
                                        <View style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 100,
                                            backgroundColor: '#FF3B30',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderTopRightRadius: 10,
                                            borderBottomRightRadius: 10
                                        }}>
                                            <IconButton
                                                icon="trash-can-outline"
                                                size={24}
                                                iconColor="white"
                                                style={{ margin: 0 }}
                                            />
                                        </View>

                                        <GestureDetector gesture={panGesture}>
                                            <Animated.View
                                                style={[
                                                    {
                                                        borderRadius: 10,
                                                    },
                                                    animatedStyle
                                                ]}
                                            >
                                                <CustomButtonWithIconRight
                                                    label={`${itemType} ${itemName}`}
                                                    onPress={isSent ? undefined : () => {
                                                        dispatch(setReminder(reminder))
                                                        navigation.navigate('ReminderScreen')
                                                    }}
                                                    disabled={isSent}
                                                    icon='chevron-right'
                                                    labelStyle={{ fontWeight: 'bold' }}
                                                    contentStyle={{ height: 90, }}
                                                    style={{ 
                                                        height: 90,
                                                    }}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                        <Text style={{ fontSize: 12, color: '#666' }}>
                                                            🕐 {dayjs(reminder.reminderDate).format('DD/MM/YYYY HH:mm')}
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
                                            </Animated.View>
                                        </GestureDetector>
                                    </View>
                                )
                            }

                            return <ReminderItem key={reminder.id} />
                        })
                }
            </ScrollView>
        </View>
    )
}

export default RemindersScreen