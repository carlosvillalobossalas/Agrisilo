import { createSlice } from "@reduxjs/toolkit";
import { ToDo } from "../../interfaces/todos";

interface ToDoState {
    todos: ToDo[]
    todo: ToDo | null
    loading: boolean
    error: string | null
}

const initialState: ToDoState = {
    todos: [],
    todo: null,
    loading: false,
    error: null
}

const todoSlice = createSlice({
    name: "todoState",
    initialState,
    reducers: {
        todoLoading: (state, action) => {
            state.loading = action.payload
        },
        setAllToDos: (state, action) => {
            state.todos = action.payload
        },
        setToDo: (state, action) => {
            state.todo = action.payload
        }
    }
})


export const { todoLoading, setAllToDos, setToDo } = todoSlice.actions
export default todoSlice.reducer