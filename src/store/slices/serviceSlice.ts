import { createSlice } from "@reduxjs/toolkit";
import { Service } from "../../interfaces/services";

interface ServiceState {
    services: Service[]
    service: Service | null
    loading: boolean
    error: string | null
}

const initialState: ServiceState = {
    services: [],
    service: null,
    loading: false,
    error: null
}

const serviceSlice = createSlice({
    name: "serviceState",
    initialState,
    reducers: {
        serviceLoading: (state, action) => {
            state.loading = action.payload
        },
        setAllServices: (state, action) => {
            state.services = action.payload
        },
        setService: (state, action) => {
            state.service = action.payload
        }
    }
})


export const { setAllServices, serviceLoading, setService } = serviceSlice.actions
export default serviceSlice.reducer