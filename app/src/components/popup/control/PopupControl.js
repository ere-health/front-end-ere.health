import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const hidePopupAction = createAction("hidePopupAction");
export const _hidePopup = () => {
    store.dispatch(hidePopupAction());
}

export const showPopupIdAction = createAction("showPopupIdAction");
export const showPopupId = () => {
    store.dispatch(showPopupIdAction());
}

export const showPopupAllAction = createAction("showPopupAllAction");
export const showPopupAll = () => {
    store.dispatch(showPopupAllAction());
}

export const showPopupProgressAction = createAction("showPopupProgressAction");
export const showPopupProgress = () => {
    store.dispatch(showPopupProgressAction());
}

export const showPopupFatigAction = createAction("showPopupFatigAction");
export const showPopupFatig = () => {
    store.dispatch(showPopupFatigAction());
}

