import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import authReducer from './slices/authSlice';
import statusReducer from './slices/statusSlice'

export const store = configureStore({
    reducer: {
        authState: authReducer,
        statusState: statusReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;