import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const requestStatusAction = createAction("requestStatusAction");
export const requestStatus = () => {
    store.dispatch(requestStatusAction());
}

export const updateStatusFromServerAction = createAction("updateStatusFromServerAction");
export const updateStatusFromServer = (status) => {
    store.dispatch(updateStatusFromServerAction({status}));
} 