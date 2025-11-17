import React, { useEffect, useState } from 'react'
import { Pressable } from 'react-native'
import { IconButton, TextInput, Text } from 'react-native-paper'
import Animated, { LinearTransition } from 'react-native-reanimated'
import { ToDo } from '../interfaces/todos'

interface TodoItemProps {
    item: ToDo
    onToggle: () => void
    onDelete: () => void
    onEdit: (text: string) => void
}

const TodoItem = ({ item, onToggle, onDelete, onEdit }: TodoItemProps) => {
    const [editing, setEditing] = useState(false)
    const [textLocal, setTextLocal] = useState(item.description)

    useEffect(() => {
        setTextLocal(item.description)
    }, [item.description])

    return (
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
                    style={{ flex: 1, backgroundColor: 'transparent' }}
                />
            ) : (
                <Pressable onPress={() => setEditing(true)} style={{ flex: 1 }}>
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

            <IconButton
                icon="trash-can-outline"
                size={24}
                onPress={onDelete}
                style={{ margin: 0 }}
            />

        </Animated.View>
    )
}


export default TodoItem
