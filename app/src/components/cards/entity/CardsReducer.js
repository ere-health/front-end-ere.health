import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import {selectCardAction,selectPinAction,loadCardsAction,changePinAction,verifyPinAction,unblockPinAction,updateCardsFromServerAction} from "../control/CardsControl.js";
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";

const initialState = {
    cards  : [],
    selectedCard: {
        cardHandle: ""
    },
    pinType: "PIN.CH"
}

export const cardsReducer = createReducer(initialState, (builder) => {
    builder.addCase(selectCardAction, (state, {payload: card}) => {
        if(!state.selectedCard) {
            state.selectedCard = {};
        }
        state.selectedCard = card;
    });
    builder.addCase(selectPinAction, (state, {payload: pinType}) => {
        state.pinType = pinType;
    });
    builder.addCase(loadCardsAction, (state) => {
        serverWebSocketActionForwarder.send({ type: "GetCards"});
    });
    builder.addCase(changePinAction, (state) => {
        serverWebSocketActionForwarder.send({ type: "ChangePin", payload: {
            cardHandle: state.selectedCard.cardHandle,
            pinType: state.pinType}
        });
    });
    builder.addCase(verifyPinAction, (state) => {
        serverWebSocketActionForwarder.send({ type: "VerifyPin", payload: {
            cardHandle: state.selectedCard.cardHandle}
        });
    });
    builder.addCase(unblockPinAction, (state) => {
        serverWebSocketActionForwarder.send({ type: "UnblockPin", payload: {
            cardHandle: state.selectedCard.cardHandle,
            pinType: state.pinType,
            setNewPin: false
        }
        });
    });

    builder.addCase(updateCardsFromServerAction, (state, {payload: cards}) => {
        if(cards.length > 0) {
            state.cards = cards;
            state.selectedCard = cards[0];
        }
        if(!state.pinType) {
			state.pinType = "PIN.CH";
		}
    });
})