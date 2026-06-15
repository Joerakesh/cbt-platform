import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  student: any;
} = {
  student: undefined,
};

const studentSlice = createSlice({
  name: "student",

  initialState,

  reducers: {
    // Save student
    setStudent: (state, action) => {
      state.student = action.payload;
    },

    // Logout
    clearStudent: (state) => {
      state.student = null;
    },
  },
});

export const {
  setStudent,

  clearStudent,
} = studentSlice.actions;

export default studentSlice.reducer;
