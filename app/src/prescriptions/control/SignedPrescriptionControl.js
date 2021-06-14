import { createAction } from "../../libs/redux-toolkit.esm.js";
import store from "../../store.js";

export const addSignedPrescriptionAction = createAction("addSignedPrescriptionAction");
export const addSignedPrescription = (prescription) => {
    store.dispatch(addSignedPrescriptionAction(prescription));
}

export const sendSignedPrescriptionAction = createAction("sendSignedPrescriptionAction");
export const sendSignedPrescription = (payload) => {
    store.dispatch(sendSignedPrescriptionAction(payload));
}