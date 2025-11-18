import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../interfaces/auth";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

interface AuthState {
    user: FirebaseAuthTypes.User | null;
    users: User[];
    code: string
    inviteData: FirebaseFirestoreTypes.DocumentData | undefined
    loading: boolean;
    error: string | null;
}
interface InvitePayload {
    code: string;
    inviteData: FirebaseFirestoreTypes.DocumentData | undefined;
}

const initialState: AuthState = {
    user: null,
    users: [],
    code: '',
    inviteData: undefined,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "authState",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
        setCodeAndInitialData: (state, action: PayloadAction<InvitePayload>) => {
            state.code = action.payload.code
            state.inviteData = action.payload.inviteData
        },
        clearInviteState: (state) => {
            state.code = '';
            state.inviteData = undefined;
        }
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    setCodeAndInitialData,
    clearInviteState
} = authSlice.actions;
export default authSlice.reducer;