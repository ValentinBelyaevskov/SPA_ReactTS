import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Backendless from "backendless";


// initialState
const initialState = {
   list: [{
      username: "",
      email: "",
      objectId:  "",
   }],
   loaded: false,
   loading: false,
   error: "",
   errorType: "",
}


// slice
const friendsSlice = createSlice({
   name: 'friends',
   initialState,

   reducers: {},

   extraReducers: builder => {}
})