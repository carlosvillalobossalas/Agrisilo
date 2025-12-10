import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  pendingNavigation: {
    screen: string;
    params?: any;
    type: 'event' | 'todo_reminder' | null;
  } | null;
}

const initialState: NotificationState = {
  pendingNavigation: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setPendingNavigation: (state, action: PayloadAction<{ screen: string; params?: any; type: 'event' | 'todo_reminder' }>) => {
      state.pendingNavigation = action.payload;
    },
    clearPendingNavigation: (state) => {
      state.pendingNavigation = null;
    },
  },
});

export const { setPendingNavigation, clearPendingNavigation } = notificationSlice.actions;
export default notificationSlice.reducer;
