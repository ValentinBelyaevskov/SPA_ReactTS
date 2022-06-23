import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { AppDispatch } from "redux/store";



export const setPlayerField = <P>(
   dispatch: AppDispatch,
   playerFieldAction: ActionCreatorWithPayload<P>,
) => {

   return (payload: P): void => {
      dispatch(playerFieldAction(payload));
   }
}