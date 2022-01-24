import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const updateRuntimeConfigAction = createAction("updateRuntimeConfigAction");
export const updateRuntimeConfig = (path, value) => {
    store.dispatch(updateRuntimeConfigAction({path, value}));
}