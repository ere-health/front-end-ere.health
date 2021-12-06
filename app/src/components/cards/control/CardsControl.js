import { createAction } from "../../../libs/redux-toolkit.esm.js";
import store from "../../../store.js";

export const selectCardAction = createAction("selectCardAction");
export const selectCard = (cardHandle) => {
    store.dispatch(selectCardAction(cardHandle));
}

export const selectPinAction = createAction("selectPinAction");
export const selectPin = (pinType) => {
    store.dispatch(selectPinAction(pinType));
}

export const loadCardsAction = createAction("loadCardsAction");
export const loadCards = () => {
    store.dispatch(loadCardsAction());
}

export const changePinAction = createAction("changePinAction");
export const changePin = () => {
    store.dispatch(changePinAction());
}

export const updateCardsFromServerAction = createAction("updateCardsFromServerAction");
export const updateCardsFromServer = (cards) => {
    store.dispatch(updateCardsFromServerAction(cards));
}