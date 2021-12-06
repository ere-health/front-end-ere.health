import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import {selectCardAction,selectPinAction,loadCardsAction,changePinAction,updateCardsFromServerAction} from "../control/CardsControl.js";
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";

const initialState = {
    cards  : [],
    selectedCard: {
        cardHandle: "",
        pinType: "PIN.CH"
    }
}

export const cardsReducer = createReducer(initialState, (builder) => {
    builder.addCase(selectCardAction, (state, {payload: cardHandle}) => {
        if(!state.selectedCard) {
            state.selectedCard = {};
        }
        state.selectedCard.cardHandle = cardHandle;
    });
    builder.addCase(selectPinAction, (state, {payload: pinType}) => {
        if(!state.selectedCard) {
            state.selectedCard = {};
        }
        state.selectedCard.pinType = pinType;
    });
    builder.addCase(loadCardsAction, (state) => {
        serverWebSocketActionForwarder.send({ type: "GetCards"});
    });
    builder.addCase(changePinAction, (state) => {
        serverWebSocketActionForwarder.send({ type: "ChangePin", payload: {
            cardHandle: state.selectedCard.cardHandle,
            pinType: state.selectedCard.pinType}
        });
    });
    builder.addCase(updateCardsFromServerAction, (state, {payload: cards}) => {
        if(cards.length > 0) {
            state.cards = cards;
            state.selectedCard = {
                cardHandle : cards[0].cardHandle,
                pinType: 'PIN.CH'
            }
        } 
    });
})