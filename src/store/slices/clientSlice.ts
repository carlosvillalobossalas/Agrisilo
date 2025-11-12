import { createSlice } from "@reduxjs/toolkit";
import { Client } from "../../interfaces/client";

interface ClientState {
    clients: Client[]
    client: Client | null
    loading: boolean
    error: string | null
}

const initialState: ClientState = {
    clients: [],
    client: null,
    loading: false,
    error: null
}

const clientSlice = createSlice({
    name: "clientState",
    initialState,
    reducers: {
        clientLoading: (state, action) => {
            state.loading = action.payload
        },
        setAllClients: (state, action) => {
            state.clients = action.payload
        },
        setClient: (state, action) => {
            state.client = action.payload
        }
    }
})


export const { clientLoading, setAllClients, setClient } = clientSlice.actions
export default clientSlice.reducer