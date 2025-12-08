import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import authReducer from './slices/authSlice';
import statusReducer from './slices/statusSlice'
import serviceReducer from './slices/serviceSlice'
import clientReducer from './slices/clientSlice'
import eventReducer from './slices/eventSlice'
import todoReducer from './slices/todoSlice'
import reminderReducer from './slices/reminderSlice'


export const store = configureStore({
    reducer: {
        authState: authReducer,
        statusState: statusReducer,
        serviceState: serviceReducer,
        clientState: clientReducer,
        eventState: eventReducer,
        todoState: todoReducer,
        reminderState: reminderReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 👈 desactiva solo este check
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;