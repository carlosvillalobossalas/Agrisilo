import { createSlice } from "@reduxjs/toolkit";
import { Status } from "../../interfaces/status";

interface StatusState {
    statuses: Status[]
    status: Status | null
    loading: boolean
    error: string | null
}

const initialState: StatusState = {
    statuses: [],
    status: null,
    loading: false,
    error: null
}

const statusSlice = createSlice({
    name: "statusState",
    initialState,
    reducers: {
        statusLoading: (state, action) => {
            state.loading = action.payload
        },
        setAllStatus: (state, action) => {
            state.statuses = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        }
    }
})


export const { setAllStatus, statusLoading, setStatus } = statusSlice.actions
export default statusSlice.reducer