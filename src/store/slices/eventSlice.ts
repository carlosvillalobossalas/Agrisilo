import { createSlice } from "@reduxjs/toolkit";
import { IEvent } from "../../interfaces/events";

interface EventState {
    events: IEvent[]
    event: IEvent | null
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
        }
    }
})


export const { setAllEvents, eventLoading, setEvent, setColorBy, setStatusFilter, setClientFilter, setServiceFilter, setEventByCalendarEvent, setPDFPath } = eventSlice.actions
export default eventSlice.reducer