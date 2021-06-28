import { createAction } from "../../libs/redux-toolkit.esm.js";
import store from "../../store.js";

export const addPrescriptionAction = createAction("addPrescriptionAction");
export const addPrescription = (prescription) => {
    store.dispatch(addPrescriptionAction(prescription));
}

export const selectPrescriptionAction = createAction("selectPrescriptionAction");
export const selectPrescription = (prescriptions, isPrevious) => {
    store.dispatch(selectPrescriptionAction({prescriptions, isPrevious}));
}

export const createNewPrescriptionAction = createAction("createNewPrescriptionAction");
export const createNewPrescription = () => {
    store.dispatch(createNewPrescriptionAction());
}

export const signedPrescriptionAction = createAction("signedPrescriptionAction");
export const signedPrescription = (prescription) => {
    store.dispatch(signedPrescriptionAction(prescription));
}

export const updatePrescriptionAction = createAction("updatePrescriptionAction");
export const updatePrescription = (name, value, key, statePath, useWindow) => {
    store.dispatch(updatePrescriptionAction({name, value, key, statePath, useWindow}));
}

export const addSignedAction = createAction("addSignedAction");
export const addSigned = (bundles) => {
    store.dispatch(addSignedAction(bundles));
}

export const signAndUploadBundlesAction = createAction("signAndUploadBundlesAction");
export const signAndUploadBundles = (bundles) => {
    store.dispatch(signAndUploadBundlesAction(bundles));
}

export const addValidationErrorForMainWindowAction = createAction("addValidationErrorForMainWindowAction");
export const addValidationErrorForMainWindow = (fieldId, error) => {
    store.dispatch(addValidationErrorForMainWindowAction({fieldId, error}));
}

export const removeValidationErrorForMainWindowAction = createAction("removeValidationErrorForMainWindowAction");
export const removeValidationErrorForMainWindow = (fieldId) => {
    store.dispatch(removeValidationErrorForMainWindowAction({fieldId}));
}