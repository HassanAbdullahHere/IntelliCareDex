import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userID: null, 
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
    },
});

export const { userSave, saveUserID } = splashSlice.actions;

export default splashSlice.reducer;
