import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const setMusterThemeAction = createAction("setMusterThemeAction");
export const setMusterTheme = () => {
    store.dispatch(setMusterThemeAction());
}

export const setLeanThemeAction = createAction("setLeanThemeAction");
export const setLeanTheme = () => {
    store.dispatch(setLeanThemeAction());
}