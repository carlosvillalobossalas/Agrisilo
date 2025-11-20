import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../interfaces/auth";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

interface AuthState {
    user: FirebaseAuthTypes.User | null;
    userFS: User | null;
    users: User[];
    userFSNotLogged: User | null;
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
    userFS: null,
    users: [],
    userFSNotLogged: null,
    code: '',
    inviteData: undefined,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "authState",
    initialState,
    reducers: {
        authLoading: (state, action) => {
            state.loading = action.payload
        },
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            console.log(action.payload)
            state.user = action.payload.user;
            state.userFS = action.payload.userFS
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
        },
        setAllUsers: (state, action) => {
            state.users = action.payload
        },
        setCodeAndInitialData: (state, action: PayloadAction<InvitePayload>) => {
            state.code = action.payload.code
            state.inviteData = action.payload.inviteData
        },
        clearInviteState: (state) => {
            state.code = '';
            state.inviteData = undefined;
        },
        setUserFSNotLogged: (state, action) => {
            state.userFSNotLogged = action.payload
        }
    },
});

export const {
    authLoading,
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    setCodeAndInitialData,
    clearInviteState,
    setAllUsers,
    setUserFSNotLogged
} = authSlice.actions;
export default authSlice.reducer;