import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userID: null,
    deviceConfigCompleted: false, 
    value: null,
};

export const splashSlice = createSlice({
    name: 'splash',
    initialState,
    reducers: {
        userSave: (state, action) => {
            state.value = action.payload;
        },
        saveUserID: (state, action) => {
            state.userID = action.payload;
        },
        setDevice: (state, action) => {
            state.deviceConfigCompleted = action.payload;
        },
    },
});

export const { userSave, saveUserID, setDevice } = splashSlice.actions;

export default splashSlice.reducer;
