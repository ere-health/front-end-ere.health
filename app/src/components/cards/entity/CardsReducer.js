import { createReducer } from "../../../libs/redux-toolkit.esm.js"
import {
    selectCardSMCBAction,
    selectCardEHBAAction,
    selectCardEGKAction,
    selectCardAction,
    selectPinAction,
    loadCardsAction,
    changePinAction,
    verifyPinAction,
    unblockPinAction,
    statusPinAction,
    updateCardsFromServerAction
} from "../control/CardsControl.js";
import serverWebSocketActionForwarder from "../../../prescriptions/boundary/websocket/ServerWebSocketActionForwarder.js";

const initialState = {
    cards  : [],
    selectCardEHBA: "",
    selectCardSMCB: "",
    selectCardEGK: "",
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
    builder.addCase(selectCardSMCBAction, (state, {payload: card}) => {
        if(!state.selectedCardSMCB) {
            state.selectedCardSMCB = {};
        }
        state.selectedCardSMCB = card;
    });
    builder.addCase(selectCardEHBAAction, (state, {payload: card}) => {
        if(!state.selectedCardEHBA) {
            state.selectedCardEHBA = {};
        }
        state.selectedCardEHBA = card;
    });
    builder.addCase(selectCardEGKAction, (state, {payload: card}) => {
        if(!state.selectedCardEGK) {
            state.selectedCardEGK = {};
        }
        state.selectedCardEGK = card;
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
    builder.addCase(statusPinAction, (state) => {
        serverWebSocketActionForwarder.send({ type: "GetPinStatus", payload: {
            cardHandle: state.selectedCard.cardHandle,
            pinType: state.pinType
        }
        });
    });

    builder.addCase(updateCardsFromServerAction, (state, {payload: cards}) => {
        if(cards.length > 0) {
            state.cards = cards;
            state.selectedCard = cards[0];
        }
        for(let card of cards) {
            if(card.cardType === "SMC_B") {
                state.selectedCardSMCB = card.cardHandle;
            }
            else if(card.cardType === "HBA") {
                state.selectedCardEHBA = card.cardHandle;
            }
            else if(card.cardType === "EGK") {
                state.selectedCardEGK = card.cardHandle;
            }
        }
        if(!state.pinType) {
			state.pinType = "PIN.CH";
		}
    });
})