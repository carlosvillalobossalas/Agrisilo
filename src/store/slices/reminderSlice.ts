import { createSlice } from "@reduxjs/toolkit";
import { IReminder } from "../../interfaces/reminders";

export interface ReminderState {
    reminders: IReminder[]
    reminder: IReminder | null
    loading: boolean
}

const initialState: ReminderState = {
    reminders: [],
    reminder: null,
    loading: false
}

const reminderSlice = createSlice({
    name: 'reminder',
    initialState,
    reducers: {
        setAllReminders: (state, action) => {
            state.reminders = action.payload
        },
        reminderLoading: (state, action) => {
            state.loading = action.payload
        },
        setReminder: (state, action) => {
            state.reminder = action.payload
        }
    }
})

export const {
    setAllReminders,
    reminderLoading,
    setReminder
} = reminderSlice.actions

export default reminderSlice.reducer
