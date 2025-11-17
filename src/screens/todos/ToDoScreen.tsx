import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper'
import CustomTodoItem from '../../components/CustomTodoItem'
import { deleteToDo, getAllToDos, saveToDo } from '../../services/todo'
import { setAllToDos } from '../../store/slices/todoSlice'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../store'
import { ToDo } from '../../interfaces/todos'

const ToDoScreen = () => {

  const dispatch = useDispatch()
  const authState = useAppSelector(state => state.authState)
  const todos = useAppSelector(state => state.todoState.todos)

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
          borderRadius: 10
        }}
      />

      {todos
        .sort((a, b) => Number(a.completed) - Number(b.completed))
        .map(item => (
          <CustomTodoItem
            key={item.id}
            item={item}
            onToggle={() => toggleTodo(item.id)}
            onDelete={() => handleDeleteTodo(item.id)}
            onEdit={(text) => editTodo(item.id, text)}
          />
        ))
      }

    </View>
  )
}

export default ToDoScreen
