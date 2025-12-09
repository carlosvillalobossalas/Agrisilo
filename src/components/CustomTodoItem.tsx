import React, { useEffect, useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { IconButton, TextInput, Text, useTheme } from 'react-native-paper'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { ToDo } from '../interfaces/todos'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import CustomBottomSheetPicker from './CustomBottomSheetPicker'

interface TodoItemProps {
    item: ToDo
    onToggle: () => void
    onDelete: () => void
    onEdit: (text: string) => void
    onAssignUser: (userId: string) => void
    users: Array<{ id: string; name: string }>
    assignedUserName?: string
}

const TodoItem = ({ item, onToggle, onDelete, onEdit, onAssignUser, users, assignedUserName }: TodoItemProps) => {

    const theme = useTheme()
    const [editing, setEditing] = useState(false)
    const [textLocal, setTextLocal] = useState(item.description)
    const bottomSheetRef = useRef<BottomSheetModal>(null)

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

    return (
        <>
            <Animated.View
                layout={LinearTransition.springify()}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 15,
                    paddingHorizontal: 5,
                    gap: 12,
                    backgroundColor: 'white',
                    borderRadius: 10
                }}
            >

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
                </View>

                <IconButton
                    icon="account-outline"
                    size={24}
                    iconColor={theme.colors.primary}
                    onPress={handleOpenUserSheet}
                    style={{ margin: 0 }}
                />

                <IconButton
                    icon="trash-can-outline"
                    size={24}
                    onPress={onDelete}
                    style={{ margin: 0 }}
                />

            </Animated.View>

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
