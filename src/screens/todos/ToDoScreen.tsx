import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper'
import CustomTodoItem from '../../components/CustomTodoItem'
import { deleteToDo, getAllToDos, saveToDo } from '../../services/todo'
import { setAllToDos } from '../../store/slices/todoSlice'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../store'
import { saveReminder } from '../../services/reminders'

const ToDoScreen = () => {

  const dispatch = useDispatch()
  const authState = useAppSelector(state => state.authState)
  const todos = useAppSelector(state => state.todoState.todos)
  const reminders = useAppSelector(state => state.reminderState.reminders)

  const [newValue, setNewValue] = useState('')

  // 🔵 TOGGLE by ID
  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    await saveToDo({
      ...todo,
      completed: !todo.completed
    })
  }

  // 🔵 ASSIGN USER by ID
  const assignUser = async (id: string, userId: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    await saveToDo({
      ...todo,
      assignedUserId: userId || undefined
    })
  }

  // 🔵 CREATE REMINDER for TODO
  const createReminder = async (todoId: string, date: Date) => {
    const todo = todos.find(t => t.id === todoId)
    if (!todo || !todo.assignedUserId) return

    await saveReminder({
      id: '',
      todoId: todoId,
      reminderDate: date.toISOString(),
      userIds: [todo.assignedUserId],
      createdAt: new Date().toISOString(),
      sent: false
    })
  }

  // 🔵 EDIT by ID
  const editTodo = async (id: string, text: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    await saveToDo({
      ...todo,
      description: text
    })
  }

  // 🔵 DELETE by ID
  const handleDeleteTodo = async (id: string) => {
    await deleteToDo(id)
  }

  // 🔵 NEW TODO
  const handleNewTodo = async () => {
    if (!newValue.trim()) return

    await saveToDo({
      id: '',
      userId: authState.user?.uid ?? '',
      description: newValue,
      completed: false
    })

    setNewValue('')
  }

  // 🔵 Real-time Firestore listener
  useEffect(() => {
    const unsubscribe = getAllToDos((data) => {
      dispatch(setAllToDos(data))
    })
    return unsubscribe
  }, [])

  return (
    <View style={{
      flex: 1,
      gap: 10,
      paddingVertical: 20,
      paddingHorizontal: 25,
    }}>

      <TextInput
        right={
          <TextInput.Icon
            icon={'plus-thick'}
            style={{ paddingTop: 15 }}
            onPress={handleNewTodo}
          />
        }
        label={'Tarea nueva'}
        value={newValue}
        onChangeText={setNewValue}
        style={{
          backgroundColor: 'white',
          paddingVertical: 5,
          borderRadius: 10,
          zIndex: 0
        }}
      />

      {todos
        .sort((a, b) => Number(a.completed) - Number(b.completed))
        .map(item => {
          const assignedUser = authState.users.find(u => u.id === item.assignedUserId)
          const todoReminder = reminders.find(r => r.todoId === item.id && !r.sent)
          return (
            <CustomTodoItem
              key={item.id}
              item={item}
              onToggle={() => toggleTodo(item.id)}
              onDelete={() => handleDeleteTodo(item.id)}
              onEdit={(text) => editTodo(item.id, text)}
              onAssignUser={(userId) => assignUser(item.id, userId)}
              onCreateReminder={(todoId, date) => createReminder(todoId, date)}
              users={authState.users.map(u => ({ id: u.id, name: u.name }))}
              assignedUserName={assignedUser?.name}
              reminderDate={todoReminder?.reminderDate}
            />
          )
        })
      }

    </View>
  )
}

export default ToDoScreen
