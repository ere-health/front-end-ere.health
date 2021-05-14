import { createAction } from "../../libs/redux-toolkit.esm.js";
import store from "../../store.js";

export const addPrescriptionAction = createAction("addPrescriptionAction");
export const addPrescription = (prescription) => {
    store.dispatch(addPrescriptionAction(prescription));
}

export const selectPrescriptionAction = createAction("selectPrescriptionAction");
export const selectPrescription = (prescription) => {
    store.dispatch(selectPrescriptionAction(prescription));
}

export const signedPrescriptionAction = createAction("signedPrescriptionAction");
export const signedPrescription = (prescription) => {
    store.dispatch(signedPrescriptionAction(prescription));
}

export const updatePrescriptionAction = createAction("updatePrescriptionAction");
export const updatePrescription = (name, value) => {
    store.dispatch(updatePrescriptionAction({name, value}));
}