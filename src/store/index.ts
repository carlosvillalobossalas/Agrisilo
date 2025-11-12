import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import authReducer from './slices/authSlice';
import statusReducer from './slices/statusSlice'
import serviceReducer from './slices/serviceSlice'
import clientReducer from './slices/clientSlice'
import eventReducer from './slices/eventSlice'

export const store = configureStore({
    reducer: {
        authState: authReducer,
        statusState: statusReducer,
        serviceState: serviceReducer,
        clientState: clientReducer,
        eventState: eventReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;