import React, { useEffect, useRef, useState } from 'react'
import { Pressable, View, Alert } from 'react-native'
import { IconButton, TextInput, Text, useTheme } from 'react-native-paper'
import Animated, { LinearTransition, useAnimatedStyle, useSharedValue, withSpring, runOnJS } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { ToDo } from '../interfaces/todos'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CustomBottomSheetPicker from './CustomBottomSheetPicker'
import DatePicker from 'react-native-date-picker'
import dayjs from 'dayjs'

interface TodoItemProps {
    item: ToDo
    onToggle: () => void
    onDelete: () => void
    onEdit: (text: string) => void
    onAssignUser: (userId: string) => void
    onCreateReminder: (todoId: string, date: Date) => void
    users: Array<{ id: string; name: string }>
    assignedUserName?: string
    reminderDate?: string
}

const TodoItem = ({ item, onToggle, onDelete, onEdit, onAssignUser, onCreateReminder, users, assignedUserName, reminderDate }: TodoItemProps) => {

    const theme = useTheme()
    const [editing, setEditing] = useState(false)
    const [textLocal, setTextLocal] = useState(item.description)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const bottomSheetRef = useRef<BottomSheetModal>(null)
    
    // Swipe to delete
    const translateX = useSharedValue(0)
    const SWIPE_THRESHOLD = -100

    useEffect(() => {
        setTextLocal(item.description)
    }, [item.description])

    const handleOpenUserSheet = () => {
        bottomSheetRef.current?.present()
    }

    const handleSelectUser = (userId: string) => {
        onAssignUser(userId)
        bottomSheetRef.current?.dismiss()
    }

    const handleCreateReminder = () => {
        setShowDatePicker(true)
    }

    const handleDeleteConfirmation = () => {
        Alert.alert(
            'Eliminar tarea',
            '¿Estás seguro de que deseas eliminar esta tarea?',
            [
                { text: 'Cancelar', style: 'cancel', onPress: () => {
                    translateX.value = withSpring(0)
                }},
                { text: 'Eliminar', style: 'destructive', onPress: onDelete }
            ]
        )
    }

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            // Solo permitir deslizar hacia la izquierda
            if (e.translationX < 0) {
                translateX.value = e.translationX
            }
        })
        .onEnd(() => {
            'worklet'
            if (translateX.value < SWIPE_THRESHOLD) {
                // Si supera el umbral, mostrar alerta de confirmación
                runOnJS(handleDeleteConfirmation)()
            } else {
                // Si no, regresar a la posición original
                translateX.value = withSpring(0)
            }
        })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }]
    }))

    return (
        <>
            <View style={{ position: 'relative' }}>
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
                        layout={LinearTransition.springify()}
                        style={[
                            {
                                backgroundColor: 'white',
                                borderRadius: 10,
                                padding: 12,
                                gap: 8
                            },
                            animatedStyle
                        ]}
                    >
                        {/* Fila principal: checkbox + texto */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <IconButton
                                icon={item.completed ? 'check-circle' : 'circle-outline'}
                                size={24}
                                iconColor={item.completed ? '#0A84FF' : '#C0C0C0'}
                                onPress={onToggle}
                                style={{ margin: 0 }}
                            />

                            <View style={{ flex: 1 }}>
                                {editing ? (
                                    <TextInput
                                        mode="flat"
                                        value={textLocal}
                                        onChangeText={setTextLocal}
                                        multiline
                                        scrollEnabled={false}
                                        submitBehavior='blurAndSubmit'
                                        onBlur={() => {
                                            onEdit(textLocal)
                                            setEditing(false)
                                        }}
                                        style={{ backgroundColor: 'transparent' }}
                                    />
                                ) : (
                                    <Pressable onPress={() => setEditing(true)}>
                                        <Text
                                            style={{
                                                fontSize: 17,
                                                color: item.completed ? '#9b9b9b' : 'black',
                                                textDecorationLine: item.completed ? 'line-through' : 'none',
                                            }}
                                        >
                                            {item.description}
                                        </Text>
                                    </Pressable>
                                )}

                                {assignedUserName && (
                                    <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                        👤 {assignedUserName}
                                    </Text>
                                )}
                                {reminderDate && (
                                    <Text style={{ fontSize: 12, color: '#FF9800', marginTop: 2 }}>
                                        🔔 {dayjs(reminderDate).format('DD/MM/YYYY HH:mm')}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Fila de acciones: asignar usuario + recordatorio */}
                        <View style={{ 
                            flexDirection: 'row', 
                            gap: 8, 
                            paddingLeft: 40,
                            borderTopWidth: 1,
                            borderTopColor: '#f0f0f0',
                            paddingTop: 8
                        }}>
                            <Pressable
                                onPress={handleOpenUserSheet}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6,
                                    paddingHorizontal: 10,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 6
                                }}
                            >
                                <IconButton
                                    icon="account-outline"
                                    size={18}
                                    iconColor={theme.colors.primary}
                                    style={{ margin: 0 }}
                                />
                                <Text style={{ fontSize: 12, color: theme.colors.primary, flex: 1 }}>
                                    {assignedUserName ? 'Cambiar' : 'Asignar'}
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleCreateReminder}
                                disabled={!item.assignedUserId}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6,
                                    paddingHorizontal: 10,
                                    backgroundColor: item.assignedUserId ? '#f5f5f5' : '#e0e0e0',
                                    borderRadius: 6,
                                    opacity: item.assignedUserId ? 1 : 0.5
                                }}
                            >
                                <IconButton
                                    icon="bell-outline"
                                    size={18}
                                    iconColor={item.assignedUserId ? theme.colors.primary : '#999'}
                                    style={{ margin: 0 }}
                                />
                                <Text style={{ 
                                    fontSize: 12, 
                                    color: item.assignedUserId ? theme.colors.primary : '#999',
                                    flex: 1 
                                }}>
                                    Recordar
                                </Text>
                            </Pressable>
                        </View>

                    </Animated.View>
                </GestureDetector>
            </View>

            <DatePicker
                locale='ES'
                modal
                open={showDatePicker}
                date={new Date()}
                minimumDate={new Date()}
                onConfirm={(date) => {
                    setShowDatePicker(false)
                    if (date > new Date()) {
                        onCreateReminder(item.id, date)
                        Alert.alert('Recordatorio creado', 'Se enviará una notificación en la fecha seleccionada')
                    } else {
                        Alert.alert('Error', 'La fecha debe ser futura')
                    }
                }}
                title='Seleccione fecha y hora del recordatorio'
                confirmText='Confirmar'
                cancelText='Cancelar'
                onCancel={() => setShowDatePicker(false)}
            />

            <CustomBottomSheetPicker
                ref={bottomSheetRef}
                title="Asignar responsable"
                items={[
                    { label: 'Sin asignar', value: '' },
                    ...users.map(user => ({ label: user.name, value: user.id }))
                ]}
                selectedValue={item.assignedUserId || ''}
                onPress={handleSelectUser}
            />
        </>
    )
}


export default TodoItem
