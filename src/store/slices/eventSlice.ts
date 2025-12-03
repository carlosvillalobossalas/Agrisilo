import { createSlice } from "@reduxjs/toolkit";
import { IEvent } from "../../interfaces/events";

interface EventState {
    events: IEvent[]
    event: IEvent | null
    onNotification: boolean
    loading: boolean
    error: string | null
    config: {
        statusFilter: string
        clientFilter: string
        serviceFilter: string
        colorBy: string
    }
    pdfPath?: string
}

const initialState: EventState = {
    events: [],
    event: null,
    onNotification: false,
    loading: false,
    error: null,
    pdfPath: undefined,
    config: {
        statusFilter: 'none',
        clientFilter: 'none',
        serviceFilter: 'none',
        colorBy: 'service'
    }
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
        },
        setColorBy: (state, action) => {
            state.config.colorBy = action.payload
        },
        setStatusFilter: (state, action) => {
            state.config.statusFilter = action.payload
        },
        setClientFilter: (state, action) => {
            state.config.clientFilter = action.payload
        },
        setServiceFilter: (state, action) => {
            state.config.serviceFilter = action.payload
        },
        setEventByCalendarEvent: (state, action) => {
            const event = state.events.find(event => event.id === action.payload)
            if (event) {
                state.event = event
            }
        },
        setPDFPath: (state, action) => {
            state.pdfPath = action.payload
        },
        setOnOpenNotification: (state, action) => {
            state.onNotification = true
            state.event = action.payload
        },
        setOnCloseNotification: (state) => {
            state.onNotification = false
            state.event = null
        }

    }
})


export const {
    setAllEvents,
    eventLoading,
    setEvent,
    setColorBy,
    setStatusFilter,
    setClientFilter,
    setServiceFilter,
    setEventByCalendarEvent,
    setPDFPath,
    setOnOpenNotification,
    setOnCloseNotification
} = eventSlice.actions
export default eventSlice.reducer