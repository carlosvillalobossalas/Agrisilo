import { createSlice } from "@reduxjs/toolkit";
import { IEvent } from "../../interfaces/events";

interface EventState {
    events: IEvent[]
    event: IEvent | null
    loading: boolean
    error: string | null
}

const initialState: EventState = {
    events: [],
    event: null,
    loading: false,
    error: null
}

const eventSlice = createSlice({
    name: "eventState",
    initialState,
    reducers: {
        eventLoading: (state, action) => {
            state.loading = action.payload
        },
        setAllEvents: (state, action) => {
            state.events = action.payload
        },
        setEvent: (state, action) => {
            state.event = action.payload
        }
    }
})


export const { setAllEvents, eventLoading, setEvent } = eventSlice.actions
export default eventSlice.reducer