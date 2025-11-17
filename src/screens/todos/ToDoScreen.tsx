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

  const authState = useAppSelector(state => state.authState)
  const todoState = useAppSelector(state => state.todoState)
  const dispatch = useDispatch()

  const [newValue, setNewValue] = useState('')
  const [todos, setTodos] = useState<ToDo[]>([])


  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    await saveToDo({
      ...todo,
      completed: !todo.completed
    })
  }

  const editTodo = async (id: string, text: string) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    await saveToDo({
      ...todo,
      description: text
    })
  }

  const handleDeleteTodo = async (id: string) => {
    await deleteToDo(id)
  }
  const handleNewTodo = async () => {
    if (newValue === '') return

    setNewValue('')
    await saveToDo({
      id: '',
      userId: authState.user?.uid ?? '',
      description: newValue,
      completed: false
    })
  }

  useEffect(() => {
    const unsubscribe = getAllToDos((data) => {
      console.log('todos', data)
      dispatch(setAllToDos(data))
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    setTodos(todoState.todos)
  }, [todoState])


  return (
    <View style={{ flex: 1, gap: 10, paddingVertical: 20, paddingHorizontal: 25, }}>

      <TextInput
        right={< TextInput.Icon
          icon={'plus-thick'}
          style={{ paddingTop: 15 }}
          onPress={handleNewTodo} />}
        label={'Tarea nueva'}
        value={newValue}
        onChangeText={(text) => setNewValue(text)}
        style={{
          backgroundColor: 'white',
          paddingVertical: 5,
          borderRadius: 10
        }}
      />
      {
        todos.map((item) => (
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