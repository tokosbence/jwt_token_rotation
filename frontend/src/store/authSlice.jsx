import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialState = {
  token: null,
  userId: null,
};

const authTokenSlice = createSlice({
  name: "authToken",
  initialState,
  reducers: {
    addToken(state, action) {
      const token = action.payload;
      const decode = jwt_decode(token);
      console.log(decode);
      const id = decode._id;
      console.log("ID", id);
      state.token = token;
      state.userId = id;
    },
    deleteToken(state, action) {
      state.token = null;
      state.userId = null;
    },
  },
});

export const authTokenActions = authTokenSlice.actions;

export default authTokenSlice;
