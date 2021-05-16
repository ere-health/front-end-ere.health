import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import {setLeanThemeAction,setMusterThemeAction} from "../control/MainControl.js";

const initialState = {
    isMuster  : true
}

export const mainReducer = createReducer(initialState, (builder) => {
    builder.addCase(setLeanThemeAction, (state) => {
        state.isMuster = false;
    });
    builder.addCase(setMusterThemeAction, (state) => {
      state.isMuster = true;
  });
})