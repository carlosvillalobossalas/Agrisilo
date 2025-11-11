import { createSlice } from "@reduxjs/toolkit";
import { Status } from "../../interfaces/status";

interface StatusState {
    statuses: Status[]
    loading: boolean
    error: string | null
}

const initialState: StatusState = {
    statuses: [],
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
        }
    }
})


export const { setAllStatus, statusLoading } = statusSlice.actions
export default statusSlice.reducer